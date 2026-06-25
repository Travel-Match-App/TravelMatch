from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException
from jwt import ExpiredSignatureError, InvalidTokenError

SECRET_KEY = "seu-segredo-aqui"
ALGORITHM = "HS256"
TOKEN_EXPIRATION_MINUTES = 30

def criar_token(usuario_id: int) -> str:
    payload = {
        "sub": str(usuario_id),
        "exp": datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRATION_MINUTES),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def validar_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id = int(payload.get("sub"))
        return usuario_id
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirado")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")