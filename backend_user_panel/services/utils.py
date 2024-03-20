
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")



#Create Password Hash
def hash(password:str):
    return pwd_context.hash(password)


# Verify Password
def verify(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)







