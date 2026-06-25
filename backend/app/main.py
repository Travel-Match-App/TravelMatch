from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np
import io
import cv2
import random
import sys
import os
from pydantic import BaseModel, validator
from app.database import salvar_recomendacao, registrar_usuario, login_usuario
from app.clima import router as clima_router
from app.flights import router as flights_router
from app.tokens import criar_token, validar_token
from fastapi.responses import JSONResponse


sys.path.append(os.path.dirname(__file__))

app = FastAPI()

security = HTTPBearer()

app.include_router(clima_router)
app.include_router(flights_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("app/model/modelo_vestimentas.h5")
classes = [
    "boina",
    "camisa_havaiana",
    "casaco",
    "corrida",
    "explorador",
    "imagens_azuis",
    "imagens_verdes",
    "imagens_vermelhas",
]

destinos = {
    "camisa_havaiana": ["Havaí"],
    "boina": ["Provence", "Holambra"],
    "casaco": ["Canadá", "Suíça", "Antártica"],
    "imagens_vermelhas": ["Paris", "Toquio", "Dubai", "Atacama"],
    "imagens_verdes": ["Nova York", "Gramado", "Bali", "Sydney"],
    "imagens_azuis": ["Rio de Janeiro", "Ibiza", "Santorini", "Veneza", "Cancún"],
    "explorador": ["Amazônia", "Machu Picchu"],
    "corrida": ["Mônaco", "Indianápolis"],
}

fake_data = {
    "Roma": {"clima": "Mediterrâneo", "custo": "Moderado", "atrações": ["Coliseu", "Vaticano"]},
    "Amsterdam": {"clima": "Temperado", "custo": "Alto", "atrações": ["Canais", "Museu Van Gogh"]},
    "Berlim": {"clima": "Temperado", "custo": "Moderado", "atrações": ["Muro de Berlim", "Portão de Brandemburgo"]},
}

def obter_usuario_atual(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    print("Token recebido:", token)
    usuario_id = validar_token(token)
    if not usuario_id:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
    return usuario_id

@app.get("/rota-protegida")
def rota_protegida(usuario_id: int = Depends(obter_usuario_atual)):
    return {"mensagem": f"Usuário {usuario_id} autenticado"}

def predict(pil_image: Image.Image):
    img = pil_image.resize((150, 150))
    img_array = img_to_array(img) / 255.0
    img_array = img_array.reshape((1, 150, 150, 3))
    pred = model.predict(img_array)[0]
    max_idx = np.argmax(pred)
    confidence = pred[max_idx]
    return classes[max_idx], confidence

def suggest_by_color(pil_image: Image.Image):
    img_np = np.array(pil_image)
    img_cv = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    blue, green, red = cv2.mean(img_cv)[:3]

    if blue > green and blue > red:
        sugestoes = destinos["imagens_azuis"]
        categoria = "imagens_azuis"
    elif green > blue and green > red:
        sugestoes = destinos["imagens_verdes"]
        categoria = "imagens_verdes"
    else:
        sugestoes = destinos["imagens_vermelhas"]
        categoria = "imagens_vermelhas"

    escolhido = random.choice(sugestoes)
    return {
        "result": escolhido,
        "alternatives": [d for d in sugestoes if d != escolhido],
        "base": "cor predominante",
        "categoria": categoria,
    }

@app.post("/recommend")
async def recommend(file: UploadFile = File(...)) -> dict:
    contents = await file.read()
    pil_image = Image.open(io.BytesIO(contents)).convert("RGB")

    try:
        categoria, confidence = predict(pil_image)
        if confidence >= 0.01:
            sugestoes = destinos.get(categoria, ["Desconhecido"])
            escolhido = random.choice(sugestoes)
            # Aqui passamos None para usuario_id pois não temos usuário logado no contexto
            salvar_recomendacao(None, contents, escolhido)
            return {
                "result": escolhido,
                "alternatives": [d for d in sugestoes if d != escolhido],
                "base": f"modelo treinado ({categoria} - confiança: {confidence:.2f})",
            }
        else:
            resposta = suggest_by_color(pil_image)
            salvar_recomendacao(None, contents, resposta["result"])
            return resposta
    except Exception:
        resposta = suggest_by_color(pil_image)
        salvar_recomendacao(None, contents, resposta["result"])
        return resposta

class UsuarioComConfirmacao(BaseModel):
    email: str
    senha: str
    confirm_password: str
    nome_completo: str

    @validator('confirm_password')
    def senhas_devem_conferir(cls, v, values):
        if 'senha' in values and v != values['senha']:
            raise ValueError('As senhas não conferem')
        return v

class LoginRequest(BaseModel):
    email: str
    senha: str

@app.post("/register")
def rota_cadastrar(usuario: UsuarioComConfirmacao):
    print("Recebido:", usuario)
    sucesso, msg = registrar_usuario(usuario.email, usuario.senha, usuario.nome_completo)
    if sucesso:
        return {"mensagem": msg}
    else:
        raise HTTPException(status_code=400, detail=msg)

@app.post("/login")
def login(data: LoginRequest):
    sucesso, resultado = login_usuario(data.email, data.senha)
    if sucesso:
        token = criar_token(resultado["id"])
        return {"status": "ok", "usuario": resultado, "token": token}
    return {"status": "erro", "mensagem": resultado}

@app.get("/destination-info/{nome}")
def get_destination_info(nome: str):
    for lugares in destinos.values():
        if nome in lugares:
            return {
                "destino": nome,
                "descricao": f"{nome} é um destino turístico recomendado com base em vestimentas.",
            }
    raise HTTPException(status_code=404, detail="Destino não encontrado")

@app.get("/user-suggestions/{user_id}")
def get_user_suggestions(user_id: str):
    return {"suggestions": []}

@app.get("/user-stats/{user_id}")
def get_user_stats(user_id: str):
    return {"stats": {}}

@app.get("/destination-compare/{city}")
def compare_destination(city: str):
    data = fake_data.get(city)
    if not data:
        return JSONResponse(status_code=404, content={"error": "Destino não encontrado"})
    return {"destino": city, "dados": data}