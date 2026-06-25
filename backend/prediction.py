import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

model = load_model("app/model/modelo_vestimentas.h5")

label_map = {
    0: "boina",
    1: "camisa_havaiana",
    2: "casaco",
    3: "corrida",
    4: "explorador",
    5: "imagens_azuis",
    6: "imagens_verdes",
    7: "imagens_vermelhas"
}

recomendacoes = {
    "camisa_havaiana": "Havaí",
    "boina": "Provence",
    "casaco": "Canadá",
    "corrida": "Monaco", 
    "explorador": "Amazônia",
    "imagens_vermelhas": "Paris",
    "imagens_verdes": "Nova York",
    "imagens_azuis": "Ibiza",
}

def predict_and_recommend(img_path):
    img_height, img_width = 150, 150
    img = image.load_img(img_path, target_size=(img_height, img_width))
    x = image.img_to_array(img) / 255.0
    x = np.expand_dims(x, axis=0)

    preds = model.predict(x)
    class_index = np.argmax(preds)
    classe = label_map.get(class_index, "Classe desconhecida")
    destino = recomendacoes.get(classe, "Destino não definido")

    print(f"Classe prevista: {classe}")
    print(f"Destino recomendado: {destino}")

predict_and_recommend("C:/Trabalho_PDI/backend/dataset/casaco.jpg")