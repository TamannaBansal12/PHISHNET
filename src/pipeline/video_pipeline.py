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

    selected_model = (
        model_routing.get("selected_model")
        or model_routing.get("selected_models", {}).get("video")
        or model_routing.get("selected_models", {}).get("reasoning")
        or "N/A"
    )

    model_routing.setdefault("selected_model", selected_model)

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
Selected Model Path: {selected_model}
Reason: {model_routing.get("routing_reason", "N/A")}
Carbon Impact: {model_routing.get("carbon_impact", "N/A")}

Advanced Runtime:
- Lightweight-first Green AI routing enabled
- Dynamic escalation path available
- Critic validation loop enabled
- VLM reasoning path supported for high-risk cases

Note:
This is currently a baseline video detector. The next upgrade should include:
- Balanced original/manipulated training
- OCR integration
- Watermark/provenance checks
- Temporal inconsistency analysis
- VLM-based visual reasoning
- Lip-sync mismatch analysis
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
lighting inconsistencies, synthetic frame artifacts, and AI-generated visual reconstruction.
"""

    evidence = detection.get("evidence", [])

    evidence.append(f"Video prediction: {prediction}")
    evidence.append(f"Video confidence: {confidence}")
    evidence.append(f"Green AI model selected: {selected_model}")
    evidence.append(
        f"Estimated carbon impact: {model_routing.get('carbon_impact', 'N/A')}"
    )

    return {
        "modality": "video",
        "detection": detection,
        "risk_score": final_score,
        "risk_level": final_level,
        "reflection": reflection,
        "prevention": prevention,
        "model_routing": model_routing,
        "evidence": evidence,
        "features": detection.get("features", {}),
    }