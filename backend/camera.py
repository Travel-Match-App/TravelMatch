import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
from PIL import Image
import random

model = load_model("app/model/modelo_vestimentas.h5")
classes = ["boina", "camisa_havaiana", "casaco"]

destinos = {
    "camisa_havaiana": ["Havaí", "Caribe"],
    "boina": ["Paris", "Provence"],
    "casaco": ["Canadá", "Suíça"],
}

def predict(img):
    img = img.resize((150, 150))
    img_array = img_to_array(img) / 255.0
    img_array = img_array.reshape((1, 150, 150, 3))
    pred = model.predict(img_array)[0]
    return classes[np.argmax(pred)]

cap = cv2.VideoCapture(0)

print("Pressione 's' para capturar a imagem ou 'q' para sair.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Reconhecimento de vestimenta", frame)
    key = cv2.waitKey(1)

    if key == ord('s'):
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(img_rgb)
        categoria = predict(pil_image)
        sugestoes = destinos.get(categoria, ["Desconhecido"])
        escolhido = random.choice(sugestoes)

        print(f"Categoria detectada: {categoria}")
        print(f"Destino sugerido: {escolhido}")
        print(f"Alternativas: {[d for d in sugestoes if d != escolhido]}")

    elif key == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()