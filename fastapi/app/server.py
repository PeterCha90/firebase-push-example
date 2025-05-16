import uvicorn
import firebase_admin

from typing import List
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from firebase_admin import credentials, messaging
from interfaces import TokenRequest, MessageRequest

load_dotenv()

# FastAPI 애플리케이션 객체 초기화
app = FastAPI()

# CORS 미들웨어 설정
# 외부 도메인에서의 API 접근을 위한 보안 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# firebase-key.json 경로 설정
if not firebase_admin._apps:
    cred = credentials.Certificate("./firebase-key.json")
    firebase_admin.initialize_app(cred)

# 임시 저장소 (DB 대신)
tokens: List[str] = []

# 기본 경로("/")에 대한 리다이렉션 처리
@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/chat/playground")


@app.post("/register-token")
def register_token(req: TokenRequest):
    if req.token not in tokens:
        tokens.append(req.token)
        print("Registered token:", req.token)
    return {"message": "Token registered."}


@app.post("/push")
def send_message(req: MessageRequest):
    # 메시지 구성
    message = messaging.Message(
        notification=messaging.Notification(
            title=req.title,
            body=req.body,
        ),
        token=req.token,
    )

    # 메시지 전송
    try:
        response = messaging.send(message)
        return {"success": True, "message_id": response}
    except Exception as e:
        return {"success": False, "error": str(e)}


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000)
