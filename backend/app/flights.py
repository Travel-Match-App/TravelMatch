from fastapi import APIRouter

router = APIRouter()

@router.get("/flights/{destination}")
def get_flights(destination: str):
    destino_formatado = destination.replace(" ", "+")
    return {
        "links": [
            f"https://www.google.com/flights?q=flights+to+{destino_formatado}",
            f"https://www.kayak.com/flights/{destino_formatado}",
            f"https://www.skyscanner.com/transport/flights-to/{destino_formatado}"
        ]
    }