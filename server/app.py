from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from functools import wraps
import tensorflow as tf
import numpy as np
from PIL import Image
import io, json, os
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

# -------------------------------
# Load Environment Variables
# -------------------------------
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
MONGO_URI = os.getenv("MONGODB_URI")
PORT = int(os.getenv("PORT", 8000))

# Cloudinary vars
CLOUD_NAME = os.getenv("CLOUD_NAME")
CLOUD_API_KEY = os.getenv("CLOUD_API_KEY")
CLOUD_API_SECRET = os.getenv("CLOUD_API_SECRET")

# -------------------------------
# Cloudinary Configuration
# -------------------------------
cloudinary.config(
    cloud_name=CLOUD_NAME,
    api_key=CLOUD_API_KEY,
    api_secret=CLOUD_API_SECRET
)

# -------------------------------
# App Configuration
# -------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

app.config["SECRET_KEY"] = SECRET_KEY
app.config["MONGO_URI"] = MONGO_URI

mongo = PyMongo(app)
db = mongo.db

# -------------------------------
# Token Authentication
# -------------------------------
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        if not token:
            return jsonify({"error": "Token missing"}), 401
        try:
            data = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = db.users.find_one({"_id": ObjectId(data["user_id"])})
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except Exception as e:
            return jsonify({"error": "Token invalid or expired", "details": str(e)}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# -------------------------------
# Model Loading
# -------------------------------
MODEL_PATHS = [
    "model/saved_model.h5",
    "model/dummy_model.keras",
]

model = None
for path in MODEL_PATHS:
    if os.path.exists(path):
        try:
            model = tf.keras.models.load_model(path)
            print(f"✅ Model loaded from {path}")
            break
        except Exception as e:
            print(f"⚠️ Error loading model from {path}: {e}")

if model is None:
    print("❌ No model loaded. Check model paths.")

try:
    with open("mapping/class_names.json") as f:
        CLASS_NAMES = json.load(f)
except:
    CLASS_NAMES = []

try:
    with open("mapping/disease_to_pesticides.json") as f:
        DISEASE_MAP = json.load(f)
except:
    DISEASE_MAP = {}

# -------------------------------
# Image Preprocessing
# -------------------------------
def preprocess_image(image_bytes, img_size=(224, 224)):
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize(img_size)
        arr = np.array(img) / 255.0
        return np.expand_dims(arr, axis=0)
    except Exception as e:
        print(f"⚠️ Error preprocessing image: {e}")
        return None

# -------------------------------
# Routes
# -------------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "🌿 CropCure API Running!"})

# -------------------------------
# Auth Routes
# -------------------------------
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ("name", "email", "password")):
            return jsonify({"error": "Missing required fields"}), 400

        if db.users.find_one({"email": data["email"]}):
            return jsonify({"error": "Email already registered"}), 400

        hashed_pw = generate_password_hash(data["password"], method="pbkdf2:sha256")

        user_id = db.users.insert_one({
            "name": data["name"],
            "email": data["email"],
            "password": hashed_pw,
            "created_at": datetime.utcnow()
        }).inserted_id

        return jsonify({"message": "User registered successfully!", "user_id": str(user_id)}), 201

    except Exception as e:
        return jsonify({"error": "Server error during registration", "details": str(e)}), 500


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        user = db.users.find_one({"email": data["email"]})

        if not user or not check_password_hash(user["password"], data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        token = jwt.encode({
            "user_id": str(user["_id"]),
            "exp": datetime.utcnow() + timedelta(hours=5)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "token": token,
            "user": {"name": user["name"], "email": user["email"]}
        })
    except Exception as e:
        return jsonify({"error": "Server error during login", "details": str(e)}), 500


@app.route("/profile", methods=["GET"])
@token_required
def profile(current_user):
    try:
        records = list(db.predictions.find({"user_id": str(current_user["_id"])}).sort("timestamp", -1))
        history = [{
            "id": str(r["_id"]),
            "disease_name": r["disease_name"],
            "confidence": r["confidence"],
            "description": r.get("description", ""),
            "timestamp": r["timestamp"].strftime("%Y-%m-%d %H:%M:%S"),
            "image_url": r.get("image_url", "")
        } for r in records]

        return jsonify({
            "name": current_user["name"],
            "email": current_user["email"],
            "history": history
        })
    except Exception as e:
        return jsonify({"error": "Failed to fetch profile", "details": str(e)}), 500

# -------------------------------
# Prediction Route
# -------------------------------
@app.route("/predict", methods=["POST"])
@token_required
def predict(current_user):
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    file_bytes = file.read()
    file.seek(0)

    try:
        upload_result = cloudinary.uploader.upload(file, folder="cropcure_scans")
        image_url = upload_result["secure_url"]
    except Exception as e:
        return jsonify({"error": "Cloudinary upload failed", "details": str(e)}), 500

    x = preprocess_image(file_bytes)
    if x is None:
        return jsonify({"error": "Image processing failed"}), 400

    try:
        preds = model.predict(x)[0]
        top_idx = int(np.argmax(preds))
        confidence = float(preds[top_idx])

        disease_name = CLASS_NAMES[top_idx] if top_idx < len(CLASS_NAMES) else "Unknown"
        mapped_key = disease_name.replace("_", "___", 1)
        data = DISEASE_MAP.get(mapped_key, {})
        pesticides = data.get("pesticides", [])
        fertilizers = data.get("fertilizers", [])
        notes = data.get("notes", "")
        description = data.get("description", "")

        db.predictions.insert_one({
            "user_id": str(current_user["_id"]),
            "image_url": image_url,
            "disease_name": disease_name,
            "confidence": confidence,
            "description": description,
            "pesticides": pesticides,
            "fertilizers": fertilizers,
            "timestamp": datetime.utcnow()
        })

        return jsonify({
            "prediction": disease_name,
            "confidence": round(confidence * 100, 2),
            "image_url": image_url,
            "pesticides": pesticides,
            "fertilizers": fertilizers,
            "description": description,
            "notes": notes
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/history", methods=["GET"])
@token_required
def history(current_user):
    user_id = str(current_user["_id"])
    try:
        scans = list(db.predictions.find({"user_id": user_id, "saved": True}).sort("timestamp", -1))
        for scan in scans:
            scan["_id"] = str(scan["_id"])
        return jsonify({"history": scans}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/delete-scan/<string:scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    try:
        result = db.predictions.delete_one({"_id": ObjectId(scan_id)})
        if result.deleted_count == 0:
            return jsonify({"error": "Record not found"}), 404

        return jsonify({"message": "Record deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# Run App
# -------------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=True)
