# Render Deployment Guide

## Issues Fixed

### 1. **scipy Build Failure (Fortran Compiler Missing)**
   - **Problem**: scipy 1.13.1 requires gfortran to compile from source
   - **Solution**: Downgraded to scipy 1.11.4 which has pre-built wheels for all platforms
   - **File**: `backend/requirements.txt` — updated scipy version

### 2. **Frontend API Not Reaching Backend**
   - **Problem**: Frontend hardcodes `http://127.0.0.1:8000` which doesn't work in production
   - **Solution**: Set `REACT_APP_API_BASE` environment variable during build
   - **File**: `frontend/src/pages/Home.jsx` (Line 12)

### 3. **CORS Blocks Frontend Requests**
   - **Problem**: Backend CORS only allows localhost; doesn't allow deployed frontend
   - **Solution**: Added `FRONTEND_URL` environment variable to render.yaml
   - **Files**: `backend/app.py` (lines 56–60), `render.yaml`

### 4. **Uvicorn Timeout Issues on Render**
   - **Problem**: Single-worker uvicorn can timeout under load
   - **Solution**: Switched to gunicorn with uvicorn workers and increased timeout
   - **File**: `render.yaml` — updated startCommand

---

## Deployment Steps

### Backend (on Render)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Fix scipy version and CORS for Render deployment"
   git push origin main
   ```

2. **Create/Update Render Service**
   - Service name: `fluencyassist-backend`
   - Branch: `main`
   - Root directory: `backend`
   - Environment variables:
     ```
     MONGO_URI=mongodb+srv://...
     MONGO_DBNAME=stutterDB
     JWT_SECRET=<your_secret>
     GOOGLE_CLIENT_ID=<your_id>
     GOOGLE_CLIENT_SECRET=<your_secret>
     SMTP_EMAIL=<your_email>
     SMTP_PASSWORD=<your_app_password>
     FRONTEND_URL=https://fluencyassist-frontend.onrender.com  (your frontend URL)
     ```

3. **Wait for deployment** — Build should complete without Fortran errors

### Frontend (on Render)

1. **Build with correct API URL**
   - Environment variable:
     ```
     REACT_APP_API_BASE=https://fluencyassist-backend.onrender.com
     ```
   - Build command:
     ```bash
     npm install && npm run build
     ```

2. **Verify the static build**
   - Confirm `REACT_APP_API_BASE` is embedded in the JavaScript

---

## Local Testing

### Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
REACT_APP_API_BASE=http://127.0.0.1:8000 npm start
```

---

## Verification Checklist

- [ ] Backend deploys without build errors
- [ ] Backend `/health` endpoint returns `{"status": "ok"}`
- [ ] Frontend loads and doesn't show CORS errors in console
- [ ] Login works and returns a JWT token
- [ ] Audio upload/record sends Authorization header with token
- [ ] `/predict` endpoint returns analysis results
- [ ] Analysis results display in UI
- [ ] PDF report generation works

---

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| scipy build error | ✅ Fixed — using 1.11.4 with pre-built wheels |
| CORS error in browser | ✅ Fixed — set `FRONTEND_URL` env var |
| "Analysis not showing" | ✅ Fixed — set `REACT_APP_API_BASE` during build |
| 401 Unauthorized on `/predict` | Check frontend sends `Authorization: Bearer <token>` |
| Model not loading | Ensure `model_epoch10.pth` exists in `backend/models/` |
