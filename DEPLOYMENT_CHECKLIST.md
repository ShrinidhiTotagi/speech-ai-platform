# Deployment Checklist - Render

## ✅ Local Testing Complete
- [x] scipy 1.11.4 installs without build errors
- [x] All backend packages import successfully
- [x] FastAPI app loads without errors
- [x] ML model loads successfully
- [x] Frontend `.env.local` configured for localhost backend

---

## 🚀 Final Deployment Steps

### Step 1: Push All Changes to GitHub
```powershell
git add .
git commit -m "Fix scipy version (1.11.4), add gunicorn, CORS support, frontend env vars"
git push origin main
```

**Files changed:**
- `backend/requirements.txt` — scipy 1.13.1 → 1.11.4
- `render.yaml` — gunicorn startup, increased timeout, FRONTEND_URL support
- `frontend/.env.local` — local dev API configuration
- `backend/.env.example` — backend env vars documentation
- `frontend/.env.example` — frontend env vars documentation

---

### Step 2: Configure Render Environment Variables

#### Backend Service (`fluencyassist-backend`)
Set these in Render dashboard under "Environment":

```
MONGO_URI=mongodb+srv://[your-username]:[your-password]@[your-cluster].mongodb.net/?retryWrites=true&w=majority
MONGO_DBNAME=stutterDB
JWT_SECRET=[generate a secure random string]
GOOGLE_CLIENT_ID=[your Google OAuth client ID]
GOOGLE_CLIENT_SECRET=[your Google OAuth client secret]
SMTP_EMAIL=[your Gmail address]
SMTP_PASSWORD=[your Gmail app password - NOT regular password]
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
MODEL_PATH=./models/model_epoch10.pth
DEVICE=cpu
FRONTEND_URL=https://[your-frontend-service-name].onrender.com
```

⚠️ **Important:** Set `FRONTEND_URL` to your actual Render frontend URL (e.g., `https://myapp-frontend.onrender.com`)

#### Frontend Service (`fluencyassist-frontend`)
Set these in Render dashboard under "Environment":

```
REACT_APP_API_BASE=https://[your-backend-service-name].onrender.com
REACT_APP_GOOGLE_CLIENT_ID=[same as backend]
```

⚠️ **Important:** Set `REACT_APP_API_BASE` to your actual Render backend URL (e.g., `https://myapp-backend.onrender.com`)

---

### Step 3: Deploy Services

1. **Backend:**
   - Go to Render Dashboard → Select `fluencyassist-backend` service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for build to complete (should take ~2-5 minutes)
   - Check logs for successful startup
   - Test: `curl https://[backend-url]/health`

2. **Frontend:**
   - Go to Render Dashboard → Select `fluencyassist-frontend` service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Wait for build to complete (should take ~1-2 minutes)
   - Verify `REACT_APP_API_BASE` is set before deploying

---

### Step 4: Verify Deployment

**Test Backend:**
```bash
curl https://your-backend-url.onrender.com/health
# Should return: {"status": "ok", "model_loaded": true}
```

**Test Frontend:**
1. Navigate to `https://your-frontend-url.onrender.com`
2. Sign up or login
3. Upload/record an audio file
4. Submit for analysis
5. Check browser console for errors (should show no CORS errors)
6. Verify analysis results appear in UI ✅

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Build fails with "gfortran" error** | ✅ Fixed — using scipy 1.11.4 now |
| **CORS error in browser console** | Verify `FRONTEND_URL` is set in backend env vars |
| **"Failed to fetch" on audio submit** | Verify `REACT_APP_API_BASE` is set in frontend env vars |
| **401 Unauthorized on `/predict`** | Check frontend is sending `Authorization: Bearer <token>` header |
| **Analysis results not showing** | Check browser Network tab — `/predict` should return JSON with `result` field |
| **Model not loading** | Verify `model_epoch10.pth` exists in `backend/models/` directory |

---

## 📝 Service URLs (Update these with your actual URLs)

- Backend API: `https://fluencyassist-backend.onrender.com`
- Frontend: `https://fluencyassist-frontend.onrender.com`

---

## 🔐 Environment Variables Quick Reference

| Variable | Backend | Frontend | Type |
|----------|---------|----------|------|
| `REACT_APP_API_BASE` | ❌ | ✅ | URL to backend |
| `FRONTEND_URL` | ✅ | ❌ | URL to frontend |
| `MONGO_URI` | ✅ | ❌ | MongoDB connection |
| `JWT_SECRET` | ✅ | ❌ | JWT signing key |
| `GOOGLE_CLIENT_ID` | ✅ | ✅ | OAuth client ID |
| `REACT_APP_GOOGLE_CLIENT_ID` | ❌ | ✅ | OAuth client ID (frontend) |

