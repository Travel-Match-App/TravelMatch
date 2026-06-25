from fastapi import APIRouter
import requests

router = APIRouter()

API_KEY = "1ee26fcca3dd7ae1baa12961bba41ce3"

@router.get("/weather/{destination}")
def get_weather(destination: str):
    url = f"http://api.openweathermap.org/data/2.5/weather?q={destination}&units=metric&lang=pt_br&appid={API_KEY}"
    resposta = requests.get(url)
    if resposta.status_code == 200:
        dados = resposta.json()
        return {
            "descricao": dados["weather"][0]["description"],
            "temperatura": dados["main"]["temp"],
            "umidade": dados["main"]["humidity"],
            "vento": dados["wind"]["speed"]
        }
    else:
        return {"error": "Destino não encontrado ou erro na API externa"}