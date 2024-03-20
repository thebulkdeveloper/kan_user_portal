from pydantic import BaseModel


class PanelBase(BaseModel):
    title:str
    exchange_url:str
    exchange_type:str
    amount:int
    imageurl:str = ""

class CreatePanel(PanelBase):
    pass


class PanelOut(BaseModel):
    id:int
    title:str
    exchange_url:str
    exchange_type:str
    amount:int
    imageurl: str

    class Config:
        from_attributes = True

class PanelTypesOut(BaseModel):
    exchange_type:str

    class Config:
        from_attributes = True
