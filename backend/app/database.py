import mysql.connector
from datetime import datetime
import bcrypt

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="recomendador_viagens"
    )

def salvar_recomendacao(usuario_id, imagem_base64, resultado):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO registro_login (usuario_id, imagem_base64, resultado, data_hora) 
                VALUES (%s, %s, %s, %s)
                """,
                (usuario_id, imagem_base64, resultado, datetime.now())
            )
        conn.commit()
    finally:
        conn.close()

def salvar_login(usuario_id):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO login (usuario_id, data_login) 
                VALUES (%s, %s)
                """,
                (usuario_id, datetime.now())
            )
        conn.commit()
    finally:
        conn.close()

def registrar_usuario(email, senha, nome_completo):
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
            if cursor.fetchone():
                return False, "E-mail já cadastrado"
            
            senha_hash = bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
            cursor.execute(
                "INSERT INTO usuarios (email, senha, nome_completo) VALUES (%s, %s, %s)",
                (email, senha_hash, nome_completo)
            )
        conn.commit()
        return True, "Usuário registrado com sucesso"
    finally:
        conn.close()

def login_usuario(email, senha):
    conn = get_connection()
    try:
        with conn.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
            usuario = cursor.fetchone()

        if not usuario:
            return False, "Usuário não encontrado"
        if not bcrypt.checkpw(senha.encode("utf-8"), usuario["senha"].encode("utf-8")):
            return False, "Senha incorreta"

        salvar_login(usuario["id"])

        return True, {
            "id": usuario["id"],
            "email": usuario["email"],
            "nome_completo": usuario.get("nome_completo", "")
        }
    finally:
        conn.close()