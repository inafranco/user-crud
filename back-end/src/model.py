from datetime import datetime
from typing import Optional
import databases
import ormar
from ormar.decorators.signals import pre_update
from pydantic.main import BaseModel
import sqlalchemy

from src.config import settings

database = databases.Database(settings.db_url)
metadata = sqlalchemy.MetaData()

class BaseMeta(ormar.ModelMeta):
    metadata = metadata
    database = database

class Address(ormar.Model):
    class Meta(BaseMeta):
        tablename = "address"

    id: int = ormar.Integer(primary_key=True)
    country: str = ormar.String(max_length=128, nullable=False)
    state: str = ormar.String(max_length=128, nullable=False)
    city: str = ormar.String(max_length=128, nullable=False)
    cep: str = ormar.String(max_length=8, nullable=False)
    street: str = ormar.String(max_length=128, nullable=False)
    number: str = ormar.String(max_length=128, nullable=False)
    complement: str = ormar.String(max_length=128)


class User(ormar.Model):
    class Meta(BaseMeta):
        tablename = "users"

    id: int = ormar.Integer(primary_key=True)
    name: str = ormar.String(max_length=128, unique=True, nullable=False)
    email: str = ormar.String(max_length=128, unique=True, nullable=False)
    cpf: str = ormar.String(max_length=11, unique=True, nullable=False)
    pis: str = ormar.String(max_length=11, unique=True, nullable=False)
    address: Address = ormar.ForeignKey(Address)
    password: str = ormar.String(max_length=128, nullable=False)
    active: bool = ormar.Boolean(default=True)
    created_at: datetime = ormar.DateTime(default=datetime.now)
    updated_at: datetime = ormar.DateTime(default=datetime.now)

@pre_update(User)
async def before_update(sender, instance, **kwargs):
    instance.updated_at = datetime.now()

class CreateAddress(BaseModel):
    country: str = ormar.String(max_length=128, nullable=False)
    state: str = ormar.String(max_length=128, nullable=False)
    city: str = ormar.String(max_length=128, nullable=False)
    cep: str = ormar.String(max_length=8, nullable=False)
    street: str = ormar.String(max_length=128, nullable=False)
    number: str = ormar.String(max_length=128, nullable=False)
    complement: str = ormar.String(max_length=128)

class CreateUser(BaseModel):
    name: str = ormar.String(max_length=128, nullable=False)
    email: str = ormar.String(max_length=128, nullable=False)
    cpf: str = ormar.String(max_length=11, nullable=False)
    pis: str = ormar.String(max_length=11, nullable=False)
    address: Optional[CreateAddress]
    password: str = ormar.String(max_length=128, nullable=False)
    active: Optional[bool] = ormar.Boolean(default=True)

class UpdateAddress(BaseModel):
    country: Optional[str]
    state: Optional[str]
    city: Optional[str]
    cep: Optional[str]
    street: Optional[str]
    number: Optional[str]
    complement: Optional[str]

class UpdateUser(BaseModel):
    name: Optional[str]
    email: Optional[str]
    cpf: Optional[str]
    pis: Optional[str]
    address: Optional[UpdateAddress]
    password: Optional[str]
    active: Optional[bool]

engine = sqlalchemy.create_engine(settings.db_url)
metadata.create_all(engine)