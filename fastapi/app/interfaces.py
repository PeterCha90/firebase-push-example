from typing import List, Union
from pydantic import BaseModel, Field
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

########### 대화형 인터페이스 ###########
class InputChat(BaseModel):
    """채팅 입력을 위한 기본 모델 정의"""

    messages: List[Union[HumanMessage, AIMessage, SystemMessage]] = Field(
        ...,
        description="The chat messages representing the current conversation.",
    )

########### 푸시 알림 엔드포인트 ###########
class PushRequest(BaseModel):
    token: str
    title: str
    body: str

class TokenRequest(BaseModel):
    token: str

class MessageRequest(BaseModel):
    title: str
    body: str
    token: str