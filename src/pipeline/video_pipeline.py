import os
from src.detection.video.video_detector import analyze_video_file
from src.scoring.risk_scorer import risk_level
from src.agents.model_router import route_model


def run_video_pipeline(video_path):
    detection = analyze_video_file(video_path)

    prediction = detection.get("prediction", "")
    confidence = float(detection.get("confidence", 0))

    if "Manipulated" in prediction or "Deepfake" in prediction:
        base_score = int(confidence * 90)
    else:
        base_score = int((1 - confidence) * 45)

    final_score = min(max(base_score, 5), 100)
    final_level = risk_level(final_score)

    model_routing = route_model(
        email_text=f"video file {os.path.basename(video_path)} {prediction}",
        advanced_signal_score=final_score
    )

    reflection = f"""
Agentic Reflection:
The uploaded video was analyzed through frame-level feature extraction. The baseline model
uses visual consistency features such as pixel intensity variation, edge artifacts,
blur variance, and sampled frame statistics to identify manipulated or deepfake-style content.

Model Prediction: {prediction}
Confidence: {confidence}
Risk Score: {final_score}/100
Risk Level: {final_level}

Green AI Routing:
Selected Model Path: {model_routing["selected_model"]}
Reason: {model_routing["routing_reason"]}
Carbon Impact: {model_routing["carbon_impact"]}

Note:
This is currently a baseline video detector. The next upgrade should include balanced original/manipulated training,
OCR, watermark/manipulation checks, and VLM-based visual reasoning.
"""

    prevention = f"""
Prevention Recommendation:
- Do not trust identity claims made only through video.
- Verify the person using a secondary communication channel.
- Avoid approving financial or credential-based requests based on video alone.
- Escalate suspicious deepfake videos to security teams for forensic review.
- Use watermarking, provenance checks, and VLM-based visual reasoning in future upgrades.

RAG/Knowledge Context:
Deepfake video attacks often involve impersonation, facial manipulation, lip-sync mismatch,
lighting inconsistencies, or synthetic visual artifacts.
"""

    evidence = detection.get("evidence", [])
    evidence.append(f"Green AI model selected: {model_routing['selected_model']}")
    evidence.append(f"Estimated carbon impact: {model_routing['carbon_impact']}")

    return {
        "modality": "video",
        "detection": detection,
        "risk_score": final_score,
        "risk_level": final_level,
        "reflection": reflection,
        "prevention": prevention,
        "model_routing": model_routing,
        "evidence": evidence,
    }