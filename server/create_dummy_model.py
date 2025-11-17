import tensorflow as tf
from keras import Input
from keras.models import Sequential
from keras.layers import Flatten, Dense

# Use Input as first layer (recommended in Keras 3)
model = Sequential([
    Input(shape=(224, 224, 3)),
    Flatten(),
    Dense(10, activation='softmax')
])

# Save as .keras file
model.save("model/dummy_model.keras")
print("Dummy model saved as model/dummy_model.keras")
