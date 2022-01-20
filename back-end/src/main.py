from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from asyncpg.exceptions import UniqueViolationError
from src.model import Address, CreateUser, UpdateUser, User, database
from src.utils import OAuth2PasswordBearerWithCookie
from src.config import settings
from ormar import exceptions
from passlib.hash import bcrypt
import jwt

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Exception Handlers
@app.exception_handler(exceptions.NoMatch)
async def user_not_found(request, error):
    return PlainTextResponse("User Not Found", status_code=404)


@app.exception_handler(exceptions.ModelError)
@app.exception_handler(RequestValidationError)
async def invalid_request(request, error):
    return PlainTextResponse(str(error), status_code=400)


@app.exception_handler(UniqueViolationError)
async def duplicated_unique_field(request, error):
    message = "Not Unique Value: " + str(error).split("DETAIL: ")[1]
    return PlainTextResponse(message, status_code=400)

# Login
oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/login")

def verify_user_password(password: str, user: User):
    return bcrypt.verify(password, user.password)

async def get_current_user_from_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=['HS256']
        )
        email: str = payload.get("user")
        if email is None:
            raise credentials_exception
    except:
        raise credentials_exception
    user = await User.objects.get(email=email)
    if user is None:
        raise credentials_exception
    return user

@app.post("/login")
async def login(data: OAuth2PasswordRequestForm = Depends()):
    key = data.username
    user = False
    try:
        user = await User.objects.filter(email=key).get()
    except:
        pass

    if (not user):
        try:
            user = await User.objects.filter(cpf=key).get()
        except:
            pass

    if (not user):
        try:
            user = await User.objects.filter(pis=key).get()
        except:
            return PlainTextResponse("User not found", status_code=400)

    if not verify_user_password(data.password, user):
        return PlainTextResponse("Wrong Password", status_code=401)

    token = jwt.encode({ "user": user.email }, settings.jwt_secret)
    response = JSONResponse({
        "access_token": token,
        "token_type": "bearer"
    })
    response.set_cookie(key='access_token', value="Bearer " + token, httponly=True)
    return response

@app.post("/logout")
async def login(user: User = Depends(get_current_user_from_token)):
    response = JSONResponse({})
    response.delete_cookie("Authorization", domain="localtest.me")
    return response

# Routes
@app.get("/users")
async def get_all_users(user: User = Depends(get_current_user_from_token)):
    users = await User.objects.all()
    response_users = []
    for user in users:
        await user.address.load()
        response_users.append(user.dict(exclude={"address__id"}))
    return response_users

@app.post("/users", status_code=201)
async def create_user(body: CreateUser):
    body.password = bcrypt.hash(body.password)

    address = await Address.objects.create(**body.address.dict())
    user = await User.objects.create(**body.dict(exclude={"address"}), address=address.pk)

    await user.address.load()
    return user.dict(exclude={"address__id"})

@app.get("/users/me")
async def get_user(user: User = Depends(get_current_user_from_token)):
    await user.address.load()
    return user.dict(exclude={"address__id"})

@app.put("/users/me")
async def update_user(body: UpdateUser, user: User = Depends(get_current_user_from_token)):
    address = await Address.objects.get(pk=user.address.id)
    await address.update(**body.address.dict(exclude_none=True))

    await user.update(**body.dict(exclude_none=True, exclude={"address"}))
    await user.address.load()

    return user.dict(exclude={"address__id"})

@app.delete("/users/me")
async def delete_user(user: User = Depends(get_current_user_from_token)):
    await user.delete()
    return "OK"

# Events
@app.on_event("startup")
async def startup():
    if not database.is_connected:
        await database.connect()


@app.on_event("shutdown")
async def shutdown():
    if database.is_connected:
        await database.disconnect()
