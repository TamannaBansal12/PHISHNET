import os

from src.detection.audio.audio_detector import analyze_audio_file
from src.scoring.risk_scorer import risk_level
from src.agents.model_router import route_model


def run_audio_pipeline(audio_path):
    detection = analyze_audio_file(audio_path)

    prediction = detection.get("prediction", "")
    confidence = float(detection.get("confidence", 0))
    audio_score = int(detection.get("audio_signal_score", 0))

    if "Deepfake" in prediction or "Synthetic" in prediction:
        base_score = int(confidence * 85)
        final_score = max(base_score, audio_score, 70)

    elif "Medium" in prediction:
        base_score = int(confidence * 65)
        final_score = max(base_score, audio_score, 45)

    else:
        base_score = int((1 - confidence) * 45)
        final_score = max(base_score, audio_score, 5)

    final_score = min(final_score, 100)
    final_level = risk_level(final_score)

    model_routing = route_model(
        email_text=f"audio file {os.path.basename(audio_path)} {prediction}",
        advanced_signal_score=final_score
    )

    reflection = f"""
Agentic Reflection:
The uploaded audio file was analyzed using MFCC, spectral centroid, spectral rolloff,
and zero-crossing rate features. These features help identify voice irregularities,
synthetic artifacts, and deepfake-style audio inconsistencies.

Model Prediction: {prediction}
Confidence: {confidence}
Audio Signal Score: {audio_score}/100
Risk Score: {final_score}/100
Risk Level: {final_level}

Green AI Routing:
Selected Model Path: {model_routing["selected_model"]}
Reason: {model_routing["routing_reason"]}
Carbon Impact: {model_routing["carbon_impact"]}
"""

    prevention = """
Prevention Recommendation:
- Verify the speaker using an independent trusted channel.
- Do not approve payments, credentials, OTP sharing, or sensitive actions based only on voice.
- Use callback verification for high-risk voice requests.
- Escalate suspicious voice messages to the security/SOC team.
- Maintain voice deepfake awareness training for employees.

RAG/Knowledge Context:
Deepfake audio attacks often use synthetic speech or cloned voices to impersonate trusted people.
The safest prevention method is multi-channel verification and strict approval workflows.
"""

    evidence = detection.get("evidence", [])
    evidence.append(f"Audio signal score: {audio_score}/100")
    evidence.append(f"Green AI model selected: {model_routing['selected_model']}")
    evidence.append(f"Estimated carbon impact: {model_routing['carbon_impact']}")

    return {
        "modality": "audio",
        "detection": detection,
        "risk_score": final_score,
        "risk_level": final_level,
        "reflection": reflection,
        "prevention": prevention,
        "model_routing": model_routing,
        "evidence": evidence,
        "features": detection.get("features", {}),
    }