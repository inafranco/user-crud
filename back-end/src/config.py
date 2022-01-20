from pydantic import BaseSettings, Field


class Settings(BaseSettings):
    db_url: str = Field(..., env='DATABASE_URL')
    jwt_secret: str = Field(..., env='JWT_SECRET_KEY')

settings = Settings()