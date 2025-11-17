import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras import layers, Model

# Define data directories and image parameters
train_dir = "data/train"
val_dir = "data/val"
img_size = (224, 224)
batch_size = 16

# Create data generators for training and validation
train_datagen = ImageDataGenerator(rescale=1. / 255)
val_datagen = ImageDataGenerator(rescale=1. / 255)

train_gen = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical"
)

val_gen = val_datagen.flow_from_directory(
    val_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical"
)

# Use a pre-trained MobileNetV2 model as a feature extractor
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,  # Exclude the top classification layer
    weights='imagenet'  # Use weights from ImageNet
)

# Freeze the base model's weights
base_model.trainable = False

# Add a new classification head on top of the base model
x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(1024, activation='relu')(x)
predictions = layers.Dense(train_gen.num_classes, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=predictions)

# Compile the model
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train the model
model.fit(
    train_gen,
    validation_data=val_gen,
    epochs=5
)

# SAVE THE MODEL in the .h5 format
model.save("../server/model/saved_model.h5")
print("Model saved to ../server/model/saved_model.h5")