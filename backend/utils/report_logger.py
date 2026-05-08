import os
import json
from datetime import datetime
from uuid import uuid4

REPORT_DIR = os.path.join("backend", "reports")
os.makedirs(REPORT_DIR, exist_ok=True)

def save_report(modality, risk_score=0, confidence=0, verdict="unknown", model_used="unknown", extra_data=None):
    report = {
        "id": str(uuid4()),
        "modality": str(modality).lower(),
        "risk_score": float(risk_score or 0),
        "confidence": float(confidence or 0),
        "verdict": str(verdict or "unknown"),
        "model_used": str(model_used or "unknown"),
        "created_at": datetime.utcnow().isoformat()
    }

    if isinstance(extra_data, dict):
        report.update(extra_data)

    filename = f"{report['modality']}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S_%f')}.json"
    filepath = os.path.join(REPORT_DIR, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

    return report
