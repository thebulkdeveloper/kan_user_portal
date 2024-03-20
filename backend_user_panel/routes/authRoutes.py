import traceback

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from services.database import get_db
from schemas.UsersSchema import CreateUsers, UserOut, UserLogin
from models.User import User
from models.Session import Session as LoginSession
from services import utils, oauth2

router = APIRouter(
    tags=['Authentication']
)


# Create new user start
@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=UserOut)
async def create_user(user: CreateUsers,
                      db: Session = Depends(get_db)):
    if user.role.value == "Admin":
        raise HTTPException(status_code=400, detail="Invalid Role")
    # Hashing the password
    hashed_password = utils.hash(user.password_hash)
    user.password_hash = hashed_password

    new_user = User(**user.model_dump())

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except IntegrityError as integrity_error:
        print(integrity_error)
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Mobile number already exists.")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail=str(e))
    finally:
        db.close()


# Create new user ends


# Login user start
@router.post('/login')
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter_by(mobile=user_credentials.mobile).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials.")

        if not utils.verify(user_credentials.password_hash, user.password_hash):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Credentials.")

        access_token = oauth2.create_access_token(data={"user_id": user.id})
        ls = db.query(LoginSession).filter_by(user_id=user.id).first()
        if ls:
            ls.status = True
            ls.token = access_token
        else:
            db.add(LoginSession(
                token=access_token,
                user_id=user.id
            ))
        db.commit()
        return {"access_token": access_token,
                "token_type": "bearer",
                "role": user.role,
                "id": user.id}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    finally:
        db.close()


@router.post('/logout/{user_id}', status_code=status.HTTP_202_ACCEPTED)
async def logout(user_id: int, db: Session = Depends(get_db)):
    try:
        session = db.query(LoginSession).filter_by(user_id=user_id).first()
        if session:
            session.status = False
        db.commit()
        return {
            "message":  "Logged out successfully"
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
