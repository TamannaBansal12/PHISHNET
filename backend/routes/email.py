from fastapi import APIRouter, HTTPException
from backend.schemas.email import EmailAnalyzeRequest, EmailAnalyzeResponse
from backend.services.email_service import email_service

router = APIRouter(prefix="/email", tags=["Email Analysis"])

@router.post("/analyze", response_model=EmailAnalyzeResponse)
async def analyze_email_endpoint(request: EmailAnalyzeRequest):
    try:
        response = email_service.analyze(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
