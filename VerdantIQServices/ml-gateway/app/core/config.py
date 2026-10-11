from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "VerdantIQ ML Gateway"
    VERSION: str = "0.1.0"
    INTERNAL_SERVICE_KEY: str = ""
    GEMINI_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    LLM_API_KEY: str = ""
    JWT_SECRET: str = "7ed8af29094849f888143303b99e1338b47412c9e156707111ed44588694b38b"
    JWT_EXPIRATION_MS: int = 86400000
    MONGODB_URI: str = ""
    MONGODB_DB_NAME: str = "VerdantIQ"
    GATEWAY_URL: str = "https://verdantiq-sb-gateway.onrender.com"
    ML_SERVICE_URL: str = "https://verdantiq-ml-gateway.onrender.com"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
