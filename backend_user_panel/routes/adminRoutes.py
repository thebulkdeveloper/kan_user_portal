import enum
import traceback

from fastapi import APIRouter, Depends, Form, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from models.User import User
from schemas.PanelSchema import PanelOut, CreatePanel

from schemas.UsersSchema import UserOut
from schemas.admin_schema import UPActionRequest
from services import oauth2, adminservices
from services.database import get_db

router = APIRouter(
    prefix="/admin",
    tags=['Admin']
)


# Admin Profile
@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserOut)
async def admin_Profile(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access.")
    try:
        users = db.query(User).filter(User.id == current_user.id).first()
        return users
    except Exception:
        return Exception


# Get all users
@router.get('/users', response_model=list[UserOut])
async def get_all_user(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    return await adminservices.get_all_users(db, current_user)


# Create Panels--> admin
@router.post("/create/panellist", status_code=status.HTTP_201_CREATED,
             response_model=PanelOut)
async def create_panel(panel: CreatePanel, db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)):
    return await adminservices.create_panel(panel, db, current_user)





# Delete Panel- Admin
@router.delete("/deletepanel/{id}",
               status_code=status.HTTP_204_NO_CONTENT)
async def delete_panel(id: int, db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)):
    return await adminservices.delete_panel(id, db, current_user)


# Approve User panels
@router.post("/user_panel_action", status_code=status.HTTP_202_ACCEPTED)
async def approve_panel(req_data: UPActionRequest, db: Session = Depends(get_db),
                        current_user=Depends(oauth2.get_current_user)):
    try:
        result = db.execute(text(f"SELECT * FROM user_panels WHERE id={req_data.id}"))
        row = result.fetchone()
        keys = result.keys()
        if row is None:
            return JSONResponse(content={
                "detail": f"No Panel found for the user with the id {req_data.id}"
            }, status_code=status.HTTP_404_NOT_FOUND)

        data = dict(zip(keys, row))
        if data["status"] != "Pending":
            return JSONResponse(
                content={"detail": f"""User Panel is already {data["status"]}"""}
            )
        query = f"UPDATE user_panels SET status='{req_data.status}' WHERE id={req_data.id}"
        db.execute(text(query))
        if req_data.status == "Approved":
            ins_query = f"""
                INSERT INTO passbook
                (amount, user_id, panel_id, approved_by, transaction_id, delivered,transaction_type)
                VALUES({req_data.amount},
                {data['user_id']}, {req_data.id},{current_user.id}, '{req_data.transaction_id}',{'true'}, 'Deposit');

            """

            db.execute(text(ins_query))
            updated_username = req_data.updated_user_id if req_data.updated_user_id else data["username"]
            updated_user_password = req_data.updated_user_password if req_data.updated_user_password else data[
                "password"]
            db.execute(text(f"""
            UPDATE user_panels
                SET username='{updated_username}', "password"='{updated_user_password}',
                cal_amount={req_data.amount} WHERE id={req_data.id};
            """))
        db.commit()
        return {"Message": f"User panel has {req_data.status}"}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Add Bank Details
@router.post("/bankdetail/add", status_code=status.HTTP_201_CREATED)
async def create_bank_details(
        bank_name: str = Form(...),
        ifsc_code: str = Form(...),
        acc_no: int = Form(...),
        upi_id: str = Form(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)):
    return await adminservices.add_new_bank_detail(bank_name,
                                                   ifsc_code,
                                                   acc_no,
                                                   upi_id,
                                                   db,
                                                   current_user)

#Get admin Bank Detail 
@router.get("/bankdetail", status_code=status.HTTP_200_OK)
async def get_admin_bank_detail( db: Session = Depends(get_db),
                                current_user: User = Depends(oauth2.get_current_user)):
    
    if not current_user:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access!")
    user = db.query(User).filter(User.id == current_user.id, User.role=="Admin")
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Only admin can get bank details!")
    
 
    query = """
            SELECT u.name,
            bd.bank_name,
            bd.acc_no,
            bd.ifsc_code,
            bd.upi_id,
            bd.is_master
            FROM bank_details bd
            left join users u
            on bd.user_id = u.id order by bd.id desc

            """

    bank_detail = db.execute(text(query))

    keys = bank_detail.keys()
    bank_detail = [dict(zip(keys, row)) for row in bank_detail.fetchall()]

    
    if not bank_detail:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Bank detail not found!")
    
    return bank_detail


@router.get("/users_panel")
async def get_users_panel(db: Session = Depends(get_db), user: User = Depends(oauth2.get_current_user)):
    return await adminservices.get_user_panels(db)


# Get Deposite, Withdraw request admin
@router.get('/user_requests')
async def get_user_requests(db: Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return await adminservices.get_user_requests(db, current_user)





# Deposite, Withdraw Request action
class ActionType(str, enum.Enum):
    Approved = "Approved"
    Rejected = "Rejected"


@router.post('/user_requests/action')
async def get_user_requests_actions(pid:int = Form(..., description="Enter user panel id"),
                            action_type: ActionType = Form(..., description="Select Action type"),
                            username:str = Form(..., description="Enter username"),
                            password:str = Form(..., description="Enter password"),
                            amount:int = Form(..., description="Enter amount"),
                            transaction_id: str = Form(None,description="Enter transaction id"),
                            db: Session = Depends(get_db), current_user: User = Depends(oauth2.get_current_user)):
    return await adminservices.user_requests_action(pid, 
                                                    action_type, 
                                                    username,
                                                    password,
                                                    amount,
                                                    transaction_id,
                                                    db, 
                                                    current_user)
