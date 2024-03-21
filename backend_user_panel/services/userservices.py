from typing import Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session
from models.BankDetail import BankDetailModel
from models.Panel import PanelModel
from schemas.PanelSchema import PanelOut
from schemas.UserPanelSchema import MyPanelOut, MyPanelOutSingle, NewPanelOut
from services import oauth2
from services.database import get_db
from models.User import User

from models.UserPanel import UserPanelModel
from io import BytesIO
import shutil
from PIL import Image
import uuid
import os


# Get All Panels
async def get_all_panels(db: Session = Depends(get_db), type: Optional[str] = "") -> list[PanelOut]:
    panellist = (
        db.query(PanelModel)
        .filter(PanelModel.exchange_type.contains(type))
        .order_by(PanelModel.created_at.desc())
        .all()
    )
    if not panellist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Currently no panel created!")
    return panellist


# Get Single Panel By Id
async def get_panel_id(pid, db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)) -> PanelOut:
    user = db.query(User).filter(User.id == current_user.id, User.role == "User").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Only users can access this panel")

    panel = db.query(PanelModel).filter(PanelModel.id == pid).first()

    db.close()
    if not panel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currently no panel found.")

    return panel


# Get Panels filtered by types
async def get_panels_types(db: Session = Depends(get_db)) -> list[MyPanelOut]:
    
        paneltypes = (
            db.query(PanelModel.exchange_type)
            .distinct()
            .order_by(PanelModel.exchange_type.asc())
            .all()
        )
        if not paneltypes:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No panel found.")
        db.close()
        return paneltypes


# Create Panel
async def create_panel(
        panel_id,
        username,
        password,
        amount,
        payment_img,
        db,
        current_user
):
    # Authenticate that the user is logged in
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to create panel")
    

    
    user = db.query(User).filter(User.id == current_user.id, User.role == "User").first()
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Only users can create panel")

    
    new_panel = UserPanelModel(user_id=int(current_user.id),
                               panel_id=panel_id,
                               username=username,
                               password=password,
                               cal_amount=amount,
                               status="Pending")

    try:
        file_extension = payment_img.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        upload_folder = "images/payment_ss"
        os.makedirs(upload_folder, exist_ok=True)
        image_path = os.path.join(upload_folder, unique_filename)

        # Open the uploaded image using Pillow
        with Image.open(payment_img.file) as img:
            # Convert RGBA image to RGB
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            # Reduce image size by compressing
            img.thumbnail((800, 800))
            # Save the compressed image to a buffer
            buffer = BytesIO()
            img.save(buffer, format='JPEG', quality=85)  # Adjust quality as per your requirement
            buffer.seek(0)
            # Save the compressed image to the file system
            with open(image_path, "wb") as f:
                shutil.copyfileobj(buffer, f)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=str(e))

    # Save the image path to the database
    new_panel.bank_image_url = image_path

    try:
        db.add(new_panel)
        db.commit()
        db.refresh(new_panel)
        return new_panel
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(e))
    finally:
        db.close()


# #Get User MyPanel
async def get_my_panel(db: Session = Depends(get_db),
                       current_user=Depends(oauth2.get_current_user)) -> NewPanelOut:
    user = db.query(User).filter(User.id == current_user.id, User.role == "User").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Only users can access this panel")

    mypanels = db.query(
        UserPanelModel.id,
        UserPanelModel.panel_id,
        UserPanelModel.user_id,
        UserPanelModel.username,
        UserPanelModel.cal_amount.label('t_amount'),
        UserPanelModel.password,
        UserPanelModel.status,
        UserPanelModel.isdeleted,
        PanelModel.title,
        PanelModel.imageurl,
        PanelModel.exchange_type) \
        .join(PanelModel,
              UserPanelModel.panel_id == PanelModel.id) \
        .filter(UserPanelModel.user_id == current_user.id,
                UserPanelModel.status == "Approved",
                UserPanelModel.isdeleted == 'false') \
        .order_by(UserPanelModel.created_at.desc()) \
        .all()

    db.close()

    if not mypanels:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currently no panels found.")
    return mypanels


# #Get User My Panel Single
async def get_my_panel_single(pid: int, db: Session = Depends(get_db),
                              current_user=Depends(oauth2.get_current_user)) -> MyPanelOutSingle:
    user = db.query(User).filter(User.id == current_user.id, User.role == "User").first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Only users can access this panel")

    mypanels = db.query(
        UserPanelModel.id,
        UserPanelModel.panel_id,
        UserPanelModel.user_id,
        UserPanelModel.username,
        UserPanelModel.cal_amount.label('t_amount'),
        UserPanelModel.status,
        UserPanelModel.bank_image_url,
        UserPanelModel.isdeleted,
        PanelModel.title,
        PanelModel.imageurl,
        PanelModel.exchange_type) \
        .join(PanelModel,
              UserPanelModel.panel_id == PanelModel.id) \
        .filter(UserPanelModel.user_id == current_user.id, UserPanelModel.id == pid,
                UserPanelModel.status == "Approved",
                UserPanelModel.isdeleted == 'false') \
        .first()
    db.close()

    if not mypanels:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Currently no Panel found.")
    return mypanels


# Get Bank Details
async def get_bank_details(db: Session = Depends(get_db), current_user=Depends(oauth2.get_current_user),
                           user_account=False):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access.")

    query = db.query(BankDetailModel)
    if not user_account:
        bank_details = query.filter_by(is_master=True).order_by(BankDetailModel.id.desc()).all()
    else:
        bank_details = query.filter_by(user_id=current_user.id, is_master=False).all()

    if not bank_details:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="No Bank details available")
    return bank_details


# Change password Mypanel

async def mypanel_password_change(id,
                                  password,
                                  db: Session = Depends(get_db),
                                  current_user=Depends(oauth2.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access!")

    user = db.query(UserPanelModel).filter(UserPanelModel.id == id, UserPanelModel.user_id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Unauthorized to access!")

    mypanel = db.query(UserPanelModel).filter(UserPanelModel.id == id,
                                              UserPanelModel.status == 'Approved',
                                              UserPanelModel.isdeleted == 'false').first()
    if not mypanel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Panel Id {id} is not found")
    query = text(
        f"""
        INSERT INTO public.notifications
        (title, "type", status, dismissed, user_panel_id, created_at)
        VALUES('Panel Password Changed', 'PASS_CHANGE', true, false, {id}, now());
        """
    )
    db.execute(query)
    mypanel.password = password
    db.commit()
    db.refresh(mypanel)
    db.close()
    return {"detail": "Password changed successfully!"}


# Close My Panel
async def close_mypanel(id: int, db: Session = Depends(get_db),
                        current_user=Depends(oauth2.get_current_user)):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Please login to access!")

    user = db.query(UserPanelModel).filter(UserPanelModel.id == id,
                                           UserPanelModel.user_id == current_user.id).first()

    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Unauthorize to access!")

    mypanel = db.query(UserPanelModel).filter(UserPanelModel.id == id,
                                              UserPanelModel.status == 'Approved',
                                              UserPanelModel.isdeleted == 'false').first()

    if not mypanel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Panel Id {id} is not found")
    mypanel.isdeleted = True
    db.commit()
    db.refresh(mypanel)
    db.close

    return {"detail": "Panel deleted successfully!"}
