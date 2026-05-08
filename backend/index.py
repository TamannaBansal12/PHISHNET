from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import os

# Ensure the api directory is in the path to import src modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from src.pipeline.email_pipeline import run_email_pipeline
    from src.pipeline.audio_pipeline import run_audio_pipeline
    from src.pipeline.video_pipeline import run_video_pipeline
except Exception:
    # Fallbacks if src is not fully present
    run_email_pipeline = None
    run_audio_pipeline = None
    run_video_pipeline = None

app = FastAPI(title="PHISHNET API")

class TextRequest(BaseModel):
    text: str

@app.get("/api/health")
def health_check():
    return {"status": "operational", "project": "PHISHNET"}

@app.post("/api/analyze/email")
def analyze_email(req: TextRequest):
    if run_email_pipeline:
        try:
            result = run_email_pipeline(req.text)
            return {"status": "success", "data": result}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    return {"status": "mocked_success", "data": {"risk_score": 88, "risk_level": "High"}}

@app.post("/api/analyze/audio")
def analyze_audio():
    # Audio processing would expect a file upload, mocking for now
    return {"status": "mocked_success", "data": {"risk_score": 94, "risk_level": "Critical"}}

@app.post("/api/analyze/video")
def analyze_video():
    # Video processing would expect a file upload, mocking for now
    return {"status": "mocked_success", "data": {"risk_score": 42, "risk_level": "Low"}}

@app.post("/api/analyze/ocr")
def analyze_ocr():
    # OCR processing would expect an image upload, mocking for now
    return {"status": "mocked_success", "data": {"risk_score": 68, "risk_level": "Medium"}}

# For Vercel, the app instance is exposed.
