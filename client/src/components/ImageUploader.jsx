import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ImageUploader.css";

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("/leaf.png"); // ✅ default image
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");
  const [dots, setDots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setError("");
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // ✅ Replace default with uploaded
    } else {
      setError("Please upload a valid image file (jpg, png, jpeg).");
    }
  };

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        const newDot = {
          id: Date.now(),
          top: `${Math.random() * 90 + 5}%`,
          left: `${Math.random() * 90 + 5}%`,
        };
        setDots((prev) => [...prev.slice(-8), newDot]);
      }, 400);
      return () => clearInterval(interval);
    } else setDots([]);
  }, [isScanning]);

  const handleScan = async () => {
    if (!imageFile) {
      setError("Please upload a leaf image first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to login to scan crops.");
      navigate("/login");
      return;
    }

    setIsScanning(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
//http://localhost:8000
      const res = await fetch("https://cropcure-qomt.onrender.com/predict", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      setIsScanning(false);

      if (!res.ok) {
        if (data.error === "Token invalid or expired") {
          alert("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        setError(data.error || "Prediction failed. Try again.");
        return;
      }

      localStorage.setItem("leafImage", data.image_url);
      localStorage.setItem("diseaseName", data.prediction);
      localStorage.setItem("confidence", data.confidence);
      localStorage.setItem("pesticides", JSON.stringify(data.pesticides));
      localStorage.setItem("fertilizers", JSON.stringify(data.fertilizers));
      localStorage.setItem("description", data.description);
      localStorage.setItem("notes", data.notes);

      navigate("/result");
    } catch (err) {
      setIsScanning(false);
      setError("Error connecting to backend. Please check the server.");
    }
  };

  const isDefaultImage = preview === "/leaf.png"; // ✅ check default

  return (
    <div className="uploader-container">
      <h2>🌱 Upload Your Leaf Image</h2>

      <label htmlFor="file-upload" className="upload-label">
        Choose Image
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />

      {error && <div className="error-msg">{error}</div>}

      <div className="preview-container">
        <div className="zoom-container">
          <img src={preview} alt="Leaf" className="photo-preview" />

          {isScanning && (
            <div className="scan-overlay">
              <div className="scan-bar"></div>
              <div className="scan-grid"></div>
              {dots.map((dot) => (
                <div
                  key={dot.id}
                  className="dot"
                  style={{ top: dot.top, left: dot.left }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Show buttons only when a real image is uploaded */}
        {!isDefaultImage && (
          <div className="button-group">
            <button onClick={handleScan} disabled={isScanning}>
              {isScanning ? "🔍 Scanning..." : "Start Scan"}
            </button>
            <button
              onClick={() => {
                setImageFile(null);
                setPreview("/leaf.png"); // ✅ reset to default
                setError("");
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
