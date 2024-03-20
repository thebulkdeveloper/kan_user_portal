from fastapi import Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.Passbook import Passbook
from models.BankDetail import BankDetailModel
from models.UserPanel import UserPanelModel
from services.database import get_db
from schemas.UsersSchema import UserOut
from schemas.PanelSchema import PanelOut, CreatePanel

from models.User import User
from models.Panel import PanelModel
from services import oauth2


# GET ALL USERS
async def get_all_users(db: Session = Depends(get_db),
                        current_user=Depends(oauth2.get_current_user)) -> list[UserOut]:
    user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access.")

    users = db.query(User).filter(User.role == "User").order_by(User.id.desc()).all()

    db.close
    if not users:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currently no users found.")

    return users


# CREATE PANEL
async def create_panel(panel: CreatePanel, db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)) -> PanelOut:
    try:
        user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access.")

        new_panel = PanelModel(created_by=current_user.id, **panel.model_dump())
        db.add(new_panel)
        db.commit()
        db.refresh(new_panel)
        return new_panel
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()





# DELETE PANEL LISTS
async def delete_panel(id: int, db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)):
    user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized operation.")

    panel = db.query(PanelModel).filter(PanelModel.id == id).first()

    if panel is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Panel not found!")
    try:
        db.delete(panel)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()


# ADD BANK DETAILS
async def add_new_bank_detail(
        bank_name,
        ifsc_code,
        acc_no,
        upi_id,
        db: Session = Depends(get_db),
        current_user=Depends(oauth2.get_current_user)):
    # Authenticate that the user is logged in
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to create panel")

    user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Unauthorized operation.")

    new_bank_detail = BankDetailModel(bank_name=bank_name,
                                      ifsc_code=ifsc_code,
                                      acc_no=acc_no,
                                      upi_id=upi_id,
                                      is_master=True)
    try:
        existing_bank_detail = db.query(BankDetailModel).filter(BankDetailModel.user_id.is_(None), 
                                                                BankDetailModel.is_master == True).first()
        if existing_bank_detail:
            existing_bank_detail.bank_name = bank_name
            existing_bank_detail.ifsc_code = ifsc_code
            existing_bank_detail.acc_no = acc_no
            existing_bank_detail.upi_id = upi_id
            existing_bank_detail.is_master = True
            db.commit()
            db.refresh(existing_bank_detail)
            return existing_bank_detail

        else:
            db.add(new_bank_detail)
            db.commit()
            db.refresh(new_bank_detail)
            return new_bank_detail
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))
    finally:
        db.close()



#Get User Panels
async def get_user_panels(db: Session, **filters):
    query = """select * , up.id, up.panel_id from user_panels up
join users u on up.user_id = u.id
join panel_lists pl on up.panel_id = pl.id where up.status = 'Pending' order by up.created_at desc"""

    result = db.execute(text(query))
    data = result.fetchall()
    keys = result.keys()

    data = [dict(zip(keys, row)) for row in data]

    return data


# Get User Requests
async def get_user_requests(db: Session, current_user=Depends(oauth2.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access")
    user = db.query(User).filter(User.id == current_user.id, User.role=="Admin").first()
    if not user:
           raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Only admin can access!")
    query = """
            SELECT p.id as passbook_id,
            up.id as user_panel_id,
            up.user_id,
            p.approved_by,
            p.is_rejected,
            p.transaction_id,
            pl.title,
            p.transaction_type,
            p.delivered, 
            p.amount, 
            up.cal_amount as total_amount,
            up.username, 
            up.password,
            p.screenshot,
            bd.bank_name,
            bd.ifsc_code,
            bd.acc_no,
            bd.upi_id
            FROM passbook p
            join user_panels up 
            on p.panel_id = up.id
            join panel_lists pl
            on up.panel_id = pl.id
            left join bank_details bd
            on bd.user_id = up.user_id
            where p.approved_by is null and 
            p.is_rejected = 'false' and 
            is_deleted = 'false'
            order by p.created_at desc
"""
    requests = db.execute(text(query))
    keys = requests.keys()
    data = [dict(zip(keys, row)) for row in requests.fetchall()]
    return data
    

#User request actions
async def user_requests_action(pid:int, 
                               action_type:str,
                               username:str,
                               password:str,
                               amount:int,
                               transaction_id:str,
                               db:Session, 
                               current_user = Depends(oauth2.get_current_user)):

    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to perform.")
    user = db.query(User).filter(User.id == current_user.id, User.role == "Admin").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Unauthorized access")
    
    request = db.query(Passbook).filter(Passbook.id==pid, Passbook.approved_by.is_(None)).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Request not found!")
    
    user_panel = db.query(UserPanelModel).filter(UserPanelModel.id == request.panel_id).first()
    

    total_amt = 0
    if request.transaction_type == "Deposit":
         total_amt = user_panel.cal_amount+amount
    elif request.transaction_type == "Withdraw":
        total_amt = user_panel.cal_amount-amount
    try:
        if action_type == "Approved":
            request.approved_by = current_user.id
            request.transaction_id = transaction_id
            request.delivered = True
            #Update UserPanel table
            user_panel.username = username
            user_panel.password = password
            user_panel.cal_amount = total_amt
            db.commit()
            db.refresh(request)
            return {"detail": "Request approved"}

        if action_type == "Rejected":
            request.approved_by = current_user.id
            request.transaction_id = None
            request.delivered = False
            request.is_rejected = True
            db.commit()
            db.refresh(request)
            return {"detail": "Request rejected"}



    except Exception:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(Exception))
    finally:
        db.close()
