import os
from dotenv import load_dotenv

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
)
from sqlalchemy.orm import declarative_base

# Load environment variables
load_dotenv()

# Build database URL
DATABASE_URL = (
    f"mysql+asyncmy://{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set False later in production
)

# Session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)

# Base class for models
Base = declarative_base()
