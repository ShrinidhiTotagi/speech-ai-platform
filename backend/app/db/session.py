from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker
from app.db.base import engine

# Create async session factory
async_session = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)


# Dependency for FastAPI
async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session
