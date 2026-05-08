# PHISHNET Deployment Guide

This guide provides instructions to deploy the PHISHNET platform to production using **Vercel** for the Next.js frontend and **Railway/Render** for the FastAPI backend.

## 1. Architecture Overview
PHISHNET uses a decoupled architecture for production:
- **Frontend**: Next.js App Router (deployed to Vercel).
- **Backend**: FastAPI with Python ML pipelines (deployed to Railway or Render).
- **Routing**: The Next.js API routes act as proxies. They forward requests to the FastAPI backend using the `BACKEND_URL` environment variable.

## 2. Deploying the Backend (FastAPI) to Railway

Railway is recommended for the backend due to its native Python support and ability to handle ML model dependencies.

1. **Create a Railway Project**:
   - Go to [Railway.app](https://railway.app/).
   - Click "New Project" -> "Deploy from GitHub repo".
   - Select the PHISHNET repository.
   
2. **Configure Root Directory**:
   - Since the backend code is inside the `backend/` folder, set the **Root Directory** setting in Railway to `/backend`.
   
3. **Start Command**:
   - Railway will automatically detect `requirements.txt`.
   - Set the Start Command to: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   
4. **Environment Variables**:
   - You can leave these blank unless you have specific model keys.

5. **Deploy**:
   - Click Deploy. Once it finishes, generate a public domain (e.g., `https://phishnet-backend.up.railway.app`).
   - Copy this URL.

## 3. Deploying the Frontend (Next.js) to Vercel

1. **Create a Vercel Project**:
   - Go to [Vercel.com](https://vercel.com/).
   - Click "Add New..." -> "Project".
   - Import the PHISHNET repository.
   
2. **Framework Preset**:
   - Vercel will automatically detect **Next.js**.

3. **Environment Variables**:
   - Add the following environment variable:
     - `BACKEND_URL` = `https://phishnet-backend.up.railway.app` (The URL you got from Railway).
     
4. **Deploy**:
   - Click **Deploy**. Vercel will run `npm run build` and publish your site.

## 4. End-to-End Verification

1. Go to your deployed Vercel frontend domain.
2. Navigate to **Email Intelligence**.
3. Upload a sample `.eml` file or paste a phishing text.
4. Click **Run Deep Scan**.
5. The frontend will hit the Next.js `/api/email` route, which securely proxies the `FormData` to the Railway backend. The backend will run the PyCaret/RAG ML models, and stream the JSON response back to the Next.js UI!
