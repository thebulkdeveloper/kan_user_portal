from pydantic import BaseModel



class UPActionRequest(BaseModel):
    id: int
    status: str
    amount: float
    transaction_id: str
    updated_user_id: str = None
    updated_user_password: str = None

