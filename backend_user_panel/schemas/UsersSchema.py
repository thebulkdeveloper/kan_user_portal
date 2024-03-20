from typing import Optional
from pydantic import BaseModel

from models.User import Role


class CreateUsers(BaseModel):
    mobile: int
    name: str
    password_hash: str
    role: Role

    # @validator('mobile')
    # def validate_mobile(cls, v):
    #     if not v.isdigit() or len(v) != 10:
    #         raise ValueError('Mobile number must be a 10-digit number')
    #     return v


class UserOut(BaseModel):
    id: int
    name: str
    mobile: int
    role: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    mobile: int
    password_hash: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    id: Optional[str] = None


class PassbookActions(BaseModel):
    panel_id: int
    action: str
    coin: int


class ChangePassword(BaseModel):
    id: int
    password: str


class LoadImageSchema(BaseModel):
    image_path: str


