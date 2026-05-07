# src/agents/model_router.py

MODEL_REGISTRY = {

    "email": {
        "lightweight": "TF-IDF + Logistic Regression",
        "balanced": "DistilBERT / TinyBERT",
        "heavy": "DeBERTa-v3 / RoBERTa + LLM Reflection"
    },

    "audio": {
        "lightweight": "MFCC + Random Forest",
        "balanced": "CNN / BiLSTM Audio Classifier",
        "heavy": "wav2vec2 / Whisper + LLM Reflection"
    },

    "video": {
        "lightweight": "MobileNetV2 Frame Classifier",
        "balanced": "EfficientNet / XceptionNet",
        "heavy": "ViT / TimeSformer / VLM Reasoning"
    },

    "ocr": {
        "lightweight": "Tesseract OCR + Rules",
        "balanced": "EasyOCR + Layout Analyzer",
        "heavy": "Qwen2-VL / LLaVA / GPT-4o Vision"
    },

    "reasoning": {
        "lightweight": "Rule-Based Risk Scorer",
        "balanced": "Critic Agent",
        "heavy": "Agentic AI Brain + RAG Prevention"
    }
}


def get_model_level(
    risk_keyword_count,
    advanced_signal_score,
    confidence=1.0
):

    if confidence < 0.65:
        return "heavy"

    if advanced_signal_score >= 75:
        return "heavy"

    if risk_keyword_count >= 5:
        return "heavy"

    if advanced_signal_score >= 40:
        return "balanced"

    if risk_keyword_count >= 2:
        return "balanced"

    return "lightweight"


def route_model(
    email_text,
    advanced_signal_score=0,
    confidence=1.0,
    suspicious_attachment=False,
    deepfake_signal=False,
    financial_fraud=False,
    credential_theft=False
):

    text = str(email_text)
    text_lower = text.lower()
    length = len(text)

    high_risk_terms = [
        "password",
        "otp",
        "bank",
        "transfer",
        "urgent",
        "verify",
        "login",
        "suspended",
        "invoice",
        "payment",
        "wire transfer",
        "account locked",
        "reset password"
    ]

    risk_keyword_count = sum(
        term in text_lower for term in high_risk_terms
    )

    email_level = get_model_level(
        risk_keyword_count,
        advanced_signal_score,
        confidence
    )

    reasoning_level = email_level

    if financial_fraud or credential_theft:
        reasoning_level = "heavy"

    if suspicious_attachment:
        ocr_level = "heavy"
    else:
        ocr_level = "balanced"

    if deepfake_signal:
        audio_level = "heavy"
        video_level = "heavy"
    else:
        audio_level = "lightweight"
        video_level = "lightweight"

    selected_models = {

        "email": MODEL_REGISTRY["email"][email_level],

        "audio": MODEL_REGISTRY["audio"][audio_level],

        "video": MODEL_REGISTRY["video"][video_level],

        "ocr": MODEL_REGISTRY["ocr"][ocr_level],

        "reasoning": MODEL_REGISTRY["reasoning"][reasoning_level]
    }

    routing_reason = []

    if email_level == "lightweight":

        routing_reason.append(
            "Low-risk text detected. Lightweight email model selected."
        )

    if email_level == "balanced":

        routing_reason.append(
            "Moderate phishing indicators detected. Balanced semantic analysis enabled."
        )

    if email_level == "heavy":

        routing_reason.append(
            "High-risk phishing indicators detected. Heavy reasoning escalation enabled."
        )

    if suspicious_attachment:

        routing_reason.append(
            "Suspicious attachment detected. OCR/VLM escalation activated."
        )

    if deepfake_signal:

        routing_reason.append(
            "Deepfake indicators detected. Advanced audio/video models activated."
        )

    if financial_fraud or credential_theft:

        routing_reason.append(
            "Critical fraud intent detected. Heavy reasoning path enforced."
        )

    heavy_count = sum([

        email_level == "heavy",

        audio_level == "heavy",

        video_level == "heavy",

        ocr_level == "heavy",

        reasoning_level == "heavy"
    ])

    if heavy_count >= 3:

        carbon_impact = "High"

        compute_efficiency = "Maximum security / higher compute"

    elif heavy_count >= 1:

        carbon_impact = "Medium"

        compute_efficiency = "Balanced security-energy routing"

    else:

        carbon_impact = "Low"

        compute_efficiency = "Lightweight energy-efficient routing"

    orchestration_table = [

        {
            "Modality": "Email",
            "Lightweight": MODEL_REGISTRY["email"]["lightweight"],
            "Balanced": MODEL_REGISTRY["email"]["balanced"],
            "Heavy/VLM": MODEL_REGISTRY["email"]["heavy"],
            "Selected": selected_models["email"],
            "Level": email_level
        },

        {
            "Modality": "Audio",
            "Lightweight": MODEL_REGISTRY["audio"]["lightweight"],
            "Balanced": MODEL_REGISTRY["audio"]["balanced"],
            "Heavy/VLM": MODEL_REGISTRY["audio"]["heavy"],
            "Selected": selected_models["audio"],
            "Level": audio_level
        },

        {
            "Modality": "Video",
            "Lightweight": MODEL_REGISTRY["video"]["lightweight"],
            "Balanced": MODEL_REGISTRY["video"]["balanced"],
            "Heavy/VLM": MODEL_REGISTRY["video"]["heavy"],
            "Selected": selected_models["video"],
            "Level": video_level
        },

        {
            "Modality": "OCR / Image",
            "Lightweight": MODEL_REGISTRY["ocr"]["lightweight"],
            "Balanced": MODEL_REGISTRY["ocr"]["balanced"],
            "Heavy/VLM": MODEL_REGISTRY["ocr"]["heavy"],
            "Selected": selected_models["ocr"],
            "Level": ocr_level
        },

        {
            "Modality": "Reasoning",
            "Lightweight": MODEL_REGISTRY["reasoning"]["lightweight"],
            "Balanced": MODEL_REGISTRY["reasoning"]["balanced"],
            "Heavy/VLM": MODEL_REGISTRY["reasoning"]["heavy"],
            "Selected": selected_models["reasoning"],
            "Level": reasoning_level
        }
    ]

    return {

        "selected_models": selected_models,

        "model_levels": {

            "email": email_level,

            "audio": audio_level,

            "video": video_level,

            "ocr": ocr_level,

            "reasoning": reasoning_level
        },

        "routing_reason": routing_reason,

        "carbon_impact": carbon_impact,

        "compute_efficiency": compute_efficiency,

        "input_length": length,

        "risk_keyword_count": risk_keyword_count,

        "advanced_signal_score": advanced_signal_score,

        "orchestration_table": orchestration_table,

        "green_it_summary": (
            "PHISHNET dynamically routes between lightweight, balanced, "
            "and heavy VLM/LLM models to minimize unnecessary compute "
            "while preserving high-risk detection accuracy."
        )
    }