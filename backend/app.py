from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import email, audio, video, ocr

app = FastAPI(
    title="PHISHNET Enterprise API",
    description="Multimodal Threat Intelligence API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/py-api/health")
def health_check():
    return {"status": "operational", "project": "PHISHNET Enterprise"}

# Mount the routers with the py-api prefix
app.include_router(email.router, prefix="/py-api")
app.include_router(audio.router, prefix="/py-api")
app.include_router(video.router, prefix="/py-api")
app.include_router(ocr.router, prefix="/py-api")
