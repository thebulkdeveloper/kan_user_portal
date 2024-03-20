from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JOSEError, jwt
from sqlalchemy import text
from sqlalchemy.orm import Session

from models.Session import Session as LoginSession
from schemas.UsersSchema import TokenData
from services import database
from services.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.access_token_expire_days)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def verify_access_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=settings.algorithm)
        id = str(payload.get("user_id"))
        if id is None:
            raise credentials_exception
        token_data = TokenData(id=id)
        return token_data

    except JOSEError:
        raise credentials_exception
    except Exception:
        raise credentials_exception


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail="Could not validate credentials.",
                                          headers={"WWW-Authenticate": "Bearer"})
    try:
        token = verify_access_token(token, credentials_exception)
        if not token and not token.id:
            print(token)
            raise credentials_exception

        user = db.execute(text(f"SELECT * FROM users WHERE id={token.id}")).fetchone()
        if not user:
            raise credentials_exception
        session = db.query(LoginSession).filter_by(user_id=user.id).first()
        if not session:
            raise credentials_exception
        return token
    except Exception:
        raise credentials_exception
