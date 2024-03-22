import os
import shutil
import uuid
from io import BytesIO
from typing import Optional

import qrcode
from PIL import Image
from fastapi import APIRouter, Depends, Query, status, HTTPException, UploadFile, Form, Body
from fastapi.params import Path
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from models import UserPanel
from models.BankDetail import BankDetailModel
from models.User import User
from schemas.PanelSchema import PanelOut, PanelTypesOut
from schemas.UserPanelSchema import MyPanelOut, MyPanelOutSingle, NewPanelOut
from schemas.UsersSchema import UserOut, ChangePassword, LoadImageSchema
from services import oauth2
from services import userservices
from services.database import get_db

router = APIRouter(
    tags=['User']
)


# Get Single Profile After login
@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserOut)
async def user_Profile(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    try:
        users = db.query(User).filter(User.id == current_user.id).first()
        return users
    except Exception:
        return Exception


# Get Panel Lists

@router.get("/panel/all", status_code=status.HTTP_200_OK, response_model=list[PanelOut])
async def get_all_panels(db: Session = Depends(get_db),
                         type: Optional[str] = ""):
    return await userservices.get_all_panels(db, type)


# Get Single Panel By Id
@router.get("/panel/{pid}", status_code=status.HTTP_200_OK, response_model=PanelOut)
async def get_panels_id(pid: int, db: Session = Depends(get_db),
                        current_user=Depends(oauth2.get_current_user)):
    return await userservices.get_panel_id(pid, db, current_user)


# Get all Exchange Types
@router.get("/panel/types/all", status_code=status.HTTP_200_OK, response_model=list[PanelTypesOut])
async def get_panels_types(db: Session = Depends(get_db)):
    return await userservices.get_panels_types(db)


# Create Panel By Users
@router.post("/panel/create/new", status_code=status.HTTP_201_CREATED,
             response_model=NewPanelOut)
async def create_panel(panel_id: int = Form(...),
                       username: str = Form(...),
                       password: str = Form(...),
                       amount: int = Form(...),
                       payment_img: UploadFile = UploadFile(...),
                       db: Session = Depends(get_db),
                       current_user: User = Depends(oauth2.get_current_user)):
    return await userservices.create_panel(panel_id,
                                           username,
                                           password,
                                           amount,
                                           payment_img,
                                           db,
                                           current_user)


@router.get("/passbook")
async def passbook(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):

    user = db.query(User).filter(User.id == current_user.id, User.role == "User").first()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access passbook")
    
    
    query = f"""
            select p.*, u.id , u.mobile , u."name" , u."role"
            from passbook p 
            join users u on p.user_id  = u.id 
            where u.id={current_user.id} 
            order by created_at desc

        """
    result = db.execute(text(query))
    keys = result.keys()
    data = [dict(zip(keys, row)) for row in result.fetchall()]

    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No Records found!")

    return data


#Get MyPanels all
@router.get("/panel/mypanel/all", response_model=list[MyPanelOut])
async def get_my_panel(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    return await userservices.get_my_panel(db, current_user)


# MyPannel Single
@router.get("/panel/mypanel/single/{pid}", response_model=MyPanelOutSingle)
async def get_my_panel_single(pid: int, db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user)):
    return await userservices.get_my_panel_single(pid, db, current_user)



@router.get("/generate_qr_code")
async def generate_upi_qr(db: Session = Depends(get_db),
                          amount: str = Query(..., description="Amount to be paid"),
                          description: str = Query(..., description="Description of payment")):
    payment_data = db.execute(text("SELECT * FROM bank_details WHERE is_master is true")).first()
    if payment_data is None:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Payment Info Not Available"
        )
    upi_url = f"upi://pay?pa={payment_data.upi_id}&am={amount}&cu=INR&tn={description}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(upi_url)
    qr.make(fit=True)

    qr_code_img = qr.make_image(fill_color="black", back_color="white")
    qr_code_img_path = "images/qr_code/generated_qr_code.png"
    qr_code_img.save(qr_code_img_path)

    return FileResponse(qr_code_img_path)


# GET BANK DETAILS
@router.get("/bankdetails")
async def get_bank_details(db: Session = Depends(get_db),
                           current_user=Depends(oauth2.get_current_user),
                           user_account: bool = Query(False)):
    return await userservices.get_bank_details(db, current_user, user_account)


# MyPanel change password

#TODO: Bug detail = "detail": "Method Not Allowed"

@router.patch("/panel/mypanel/changepassword")
async def mypanel_change_password(pass_data: ChangePassword,
                                  db: Session = Depends(get_db),
                                  current_user=Depends(oauth2.get_current_user)):
    try:
        if pass_data.id == 0 or pass_data.password == "":
            raise HTTPException(status_code=400, detail="Invalid request")
        return await userservices.mypanel_password_change(pass_data.id, pass_data.password, db, current_user)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    # return {"message": "Change password routes initiated"}


# Close MyPanel
@router.put('/panel/mypanel/delete/{id}')
async def close_my_panel(id: int, db: Session = Depends(get_db),
                         current_user=Depends(oauth2.get_current_user)):
    return await userservices.close_mypanel(id, db, current_user)


@router.post("/my_panel_actions")
async def my_panel_actions(
        user_panel_id: int = Form(...),
        amount: int = Form(...),
        action_type: str = Form(...),
        payment_img: UploadFile = Form(None),
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)
):
    try:
        if action_type == "Deposit":
            file_extension = payment_img.filename.split(".")[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            upload_folder = "images/payment_ss"
            os.makedirs(upload_folder, exist_ok=True)
            image_path = os.path.join( upload_folder, unique_filename)

            with Image.open(payment_img.file) as img:
                if img.mode == 'RGBA':
                    img = img.convert('RGB')
                img.thumbnail((800, 800))
                buffer = BytesIO()
                img.save(buffer, format='JPEG', quality=85)  # Adjust quality as per your requirement
                buffer.seek(0)
                with open(image_path, "wb") as f:
                    shutil.copyfileobj(buffer, f)

                panel = db.execute(
                    text("SELECT * FROM user_panels WHERE id = :panel_id AND user_id = :user_id"),
                    {"panel_id": user_panel_id, "user_id": current_user.id}
                ).fetchone()

                if panel is None:
                    return {"error": "User does not have permission to perform actions on this panel"}

                db.execute(
                    text(f"""INSERT INTO passbook
                            (amount, user_id, panel_id, delivered,transaction_type,screenshot, is_rejected, is_deleted)
                            VALUES(
                         {amount},{panel.user_id},{user_panel_id}, {False}, '{action_type}','{image_path}',{False}, {False});""")

                )
                db.commit()
                return {"message": f"{action_type} performed successfully"}
            
        if action_type == "Withdraw":

            panel = db.execute(
                    text("SELECT * FROM user_panels WHERE id = :panel_id AND user_id = :user_id"),
                    {"panel_id": user_panel_id, "user_id": current_user.id}
                ).fetchone()

            if panel is None:
                    return {"error": "User does not have permission to perform actions on this panel"}
            
            db.execute(
                text(f"""INSERT INTO passbook
                            (amount, user_id, panel_id, delivered,transaction_type, is_rejected, is_deleted)
                            VALUES({amount},{panel.user_id},{user_panel_id}, {False}, '{action_type}',{False}, {False});""")

                )
            db.commit()
            return {"message": f"{action_type} performed successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))
    finally:
        db.close()


#Add User Bank Accounts
@router.post('/bankaccount')
async def add_bank_account(bank_name: str = Form(...),
        ifsc_code: str = Form(...),
        acc_no: int = Form(...),
        upi_id: str = Form(...),
        db: Session = Depends(get_db),
        current_user: User = Depends(oauth2.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access")
    user = db.query(User).filter(User.id == current_user.id, 
                                 User.role == "User").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Only Users can access")
        
    new_bank_detail = BankDetailModel(bank_name=bank_name,
                                      ifsc_code=ifsc_code,
                                      acc_no=acc_no,
                                      upi_id=upi_id,
                                      user_id = current_user.id,
                                      is_master=False)
    try:
        existing_bank_detail = (db.query(BankDetailModel)
                                .filter(BankDetailModel.user_id == current_user.id)
                                .first())
        if existing_bank_detail:
            existing_bank_detail.bank_name = bank_name
            existing_bank_detail.ifsc_code = ifsc_code
            existing_bank_detail.acc_no = acc_no
            existing_bank_detail.upi_id = upi_id
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


@router.get("/notification")
async def get_notifications(db: Session = Depends(get_db), user: User = Depends(oauth2.get_current_user)):
    query = f"""select * from notifications n 
                join user_panels up on up.id = n.user_panel_id 
                join users u on u.id = up.user_id 
                where u.id = {user.id}
            """
    result = db.execute(text(query))
    keys = result.keys()
    data = [dict(zip(keys, row)) for row in result.fetchall()]
    return data


@router.patch("/notification/dismiss/{nt_id}")
async def get_notifications_action(nt_id: int, db: Session = Depends(get_db),
                                   user: User = Depends(oauth2.get_current_user)):
    try:
        query = f"""UPDATE public.notifications
                    SET dismissed=false
                    WHERE id={nt_id};
                """
        db.execute(text(query))
        db.commit()
        return {"message": "Notification Dismissed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/load_image")
async def load_image(image_rq: LoadImageSchema):
    if image_rq.image_path == "":
        raise HTTPException(status_code=404, detail="Image not found")

    return FileResponse(image_rq.image_path, status_code=200)
