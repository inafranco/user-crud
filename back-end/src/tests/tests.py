from pydantic.types import Json
import pytest
from fastapi.testclient import TestClient
from src.main import app

pytest.token = ""

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as client:
        yield client

@pytest.mark.order(1)
def test_create_user(client):
    user_mock = {
        "name": "usertest",
        "email": "user.test@gmail.com",
        "password": "confidential",
        "cpf": "12345678900",
        "pis": "12345678900",
        "active": True,
        "address": {
            "country": "brasil",
            "state": "santa catarina",
            "city": "florianopolis",
            "complement": "ilha da magia",
            "street": "lauro linhares",
            "number": "123",
            "cep": "12345678"
        }
    }
    response = client.post("/users", json=user_mock)
        
    assert response.status_code == 201, response.text

@pytest.mark.order(2)
def test_login(client):
    credentials = {
        "username": "user.test@gmail.com",
        "password": "confidential",
    }
    response = client.post("/login", data=credentials, headers={
        "Content-Type": "application/x-www-form-urlencoded"
    })
        
    assert response.status_code == 200, response.text
    pytest.token = "Bearer " + response.json()["access_token"]

@pytest.mark.order(3)
def test_get_users(client):
    response = client.get("/users")
    assert response.status_code == 200, response.text

@pytest.mark.order(4)
def test_get_user(client):
    response = client.get("/users/me")
    assert response.status_code == 200, response.text

@pytest.mark.order(5)
def test_put_user(client):
    updated_user = {
        "name": "new usertest",
        "address": {
            "number": "1234",
        }
    }
    response = client.put("/users/me", json=updated_user)
    assert response.status_code == 200, response.text

@pytest.mark.order(6)
def test_delete_user(client):
    response = client.delete("/users/me")
    assert response.status_code == 200, response.text
