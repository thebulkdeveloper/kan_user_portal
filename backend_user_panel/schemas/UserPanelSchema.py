from pydantic import BaseModel
from models import UserPanel


class NewPanelBase(BaseModel):
    panel_id: int
    username: str
    password: str
    cal_amount: int
    bank_image_url: str
    status: UserPanel.PanelStatus


class CreateNewPanel(NewPanelBase):
    pass


class NewPanelOut(BaseModel):
    id: int
    user_id: int
    panel_id: int
    username: str
    cal_amount: int
    status: str
    bank_image_url: str
    class Config:
        from_attributes = True


class PanelOutCr(BaseModel):
    id: int
    username: str
    coin_rate: float
    total_coin: int
    cal_amount: int
    status: str
    class Config:
        from_attributes = True


class MyPanelOut(BaseModel):
    id: int
    panel_id: int
    user_id: int
    title: str
    exchange_type: str
    imageurl: str
    status: str
    username: str
    t_amount: float
    password: str = None
    exchange_url:str = None

    class Config:
        from_attributes = True


class MyPanelOutSingle(MyPanelOut):
    bank_image_url: str

    class Config:
        from_attributes = True
