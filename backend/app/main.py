from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.base import engine, Base
from app.models.user import User  # ensures model is registered

# Import routers
from app.api.routes import auth


# -------------------------------
# Application lifespan
# -------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    async with engine.begin() as conn:
        # DEV MODE ONLY
        # Automatically create tables
        await conn.run_sync(Base.metadata.create_all)

    print("✅ Database connected and tables ensured.")

    yield

    # Shutdown logic
    await engine.dispose()
    print("🛑 Application shutdown complete.")


# -------------------------------
# FastAPI App Initialization
# -------------------------------

app = FastAPI(
    title="Speech AI Platform API",
    version="0.1.0",
    description="Backend API for Speech AI Platform",
    lifespan=lifespan,
)


# -------------------------------
# CORS Configuration
# -------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# Include Routers
# -------------------------------

app.include_router(auth.router)


# -------------------------------
# Health Check Endpoint
# -------------------------------

@app.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "service": "speech-ai-platform",
        "version": "0.1.0"
    }


# -------------------------------
# Root Endpoint
# -------------------------------

@app.get("/", tags=["System"])
async def root():
    return {"message": "Speech AI Platform API is running"}
