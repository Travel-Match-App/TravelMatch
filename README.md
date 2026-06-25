# TravelMatch 🌎✈️

## Sobre o Projeto

O TravelMatch é uma plataforma inteligente de recomendação de destinos turísticos baseada em Inteligência Artificial e Visão Computacional.

A aplicação permite que usuários enviem imagens representando seus gostos, interesses ou estilos de viagem. A partir da análise dessas imagens, o sistema identifica características visuais relevantes e recomenda destinos turísticos compatíveis, apresentando descrições e sugestões de locais para visitação.

O projeto foi desenvolvido utilizando arquitetura Full Stack, com frontend moderno, backend em Python e integração com modelos de Machine Learning para análise de imagens.

---

## Objetivos

* Utilizar Inteligência Artificial para compreender preferências dos usuários.
* Recomendar destinos turísticos personalizados.
* Demonstrar a aplicação prática de Machine Learning e Visão Computacional.
* Oferecer uma interface intuitiva e responsiva para interação dos usuários.

---

## Funcionalidades

### Upload de Imagens

* Envio de imagens pelo usuário.
* Validação de formatos suportados.
* Armazenamento temporário para processamento.

### Análise Inteligente

* Processamento da imagem utilizando técnicas de Visão Computacional.
* Extração de características visuais.
* Classificação dos elementos presentes na imagem.

### Recomendação de Destinos

* Geração de recomendações personalizadas.
* Exibição de descrições dos destinos.
* Sugestão de pontos turísticos e atrações.

### Histórico de Recomendações

* Registro das análises realizadas.
* Armazenamento das recomendações geradas.
* Consulta posterior dos resultados.

---

## Arquitetura do Sistema

```text
TravelMatch
│
├── frontend
│   ├── app
│   ├── components
│   ├── pages
│   ├── assets
│   └── services
│
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── recommendation.py
│   │   └── models
│   │
│   ├── uploads
│   └── venv
│
└── database
```

---

## Tecnologias Utilizadas

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Axios

### Backend

* Python 3.11+
* FastAPI
* Uvicorn

### Inteligência Artificial

* TensorFlow
* Keras
* OpenCV
* NumPy
* Pillow

### Banco de Dados

* MySQL

### Ferramentas

* Git
* GitHub
* VS Code
* Postman

---

## Requisitos

### Software

* Python 3.11 ou superior
* Node.js 18 ou superior
* MySQL Server 8.0
* Git

---

## Instalação

### Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/travelmatch.git

cd travelmatch
```

---

## Configuração do Backend

Entrar na pasta:

```bash
cd backend
```

Criar ambiente virtual:

```bash
python -m venv venv
```

Ativar ambiente virtual:

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

---

## Configuração do Banco de Dados

Criar banco:

```sql
CREATE DATABASE travelmatch;
```

Exemplo de configuração:

```python
mysql.connector.connect(
    host="localhost",
    user="root",
    password="sua_senha",
    database="travelmatch"
)
```

---

## Executando o Backend

```bash
uvicorn app.main:app --reload
```

Servidor disponível em:

```text
http://localhost:8000
```

Documentação Swagger:

```text
http://localhost:8000/docs
```

---

## Configuração do Frontend

Entrar na pasta:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar aplicação:

```bash
npm start
```

ou

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:3000
```

---

## Fluxo de Funcionamento

1. Usuário acessa o sistema.
2. Realiza upload de uma imagem.
3. A imagem é enviada ao backend.
4. O modelo de IA analisa a imagem.
5. Características visuais são identificadas.
6. O sistema gera recomendações de destinos.
7. O resultado é armazenado no banco de dados.
8. O usuário visualiza os destinos sugeridos.

---

## Exemplo de Uso da API

### Endpoint

```http
POST /recommend
```

### Request

```json
{
  "image": "arquivo.jpg"
}
```

### Response

```json
{
  "destination": "Paris",
  "description": "Destino recomendado com base na análise da imagem.",
  "places": [
    "Torre Eiffel",
    "Museu do Louvre",
    "Arco do Triunfo"
  ]
}
```
## Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.

Todos os direitos reservados © 2026.
