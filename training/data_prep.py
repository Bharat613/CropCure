import os
from PIL import Image
import numpy as np

def preprocess_image(image_path, img_size=(224,224)):
    img = Image.open(image_path).convert("RGB")
    img = img.resize(img_size)
    arr = np.array(img)/255.0
    return arr

# Example: loop through dataset and preprocess
train_dir = "data/train"
for cls in os.listdir(train_dir):
    cls_path = os.path.join(train_dir, cls)
    for img_file in os.listdir(cls_path):
        img_arr = preprocess_image(os.path.join(cls_path, img_file))
