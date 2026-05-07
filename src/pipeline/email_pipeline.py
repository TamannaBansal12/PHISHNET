from src.detection.email.detectors.text_detector import analyze_text_content
from src.detection.email.detectors.url_analyzer import analyze_urls
from src.detection.email.detectors.header_analyzer import analyze_headers
from src.detection.email.detectors.brand_detector import detect_brand_impersonation
from src.detection.email.detectors.social_engineering import analyze_social_engineering
from src.detection.email.detectors.attachment_analyzer import analyze_attachments

from src.agents.intent_agent import classify_email_intent
from src.agents.critic_agent import critique_decision
from src.agents.model_router import route_model

from src.scoring.risk_scorer import calculate_risk_score, risk_level
from src.agents.reflection_agent import generate_reflection
from src.agents.prevention_agent import generate_prevention_plan


def notebook_style_signal_engine(text):
    text = str(text).lower()

    score = 0
    signals = []

    if "urgent" in text:
        score += 10
        signals.append("Urgency detected")

    if "password" in text or "otp" in text:
        score += 20
        signals.append("Credential request detected")

    if "click" in text and "link" in text:
        score += 10
        signals.append("Click-based redirection")

    if "bank" in text or "account" in text:
        score += 15
        signals.append("Financial targeting")

    if "verify" in text:
        score += 10
        signals.append("Verification trigger")

    return score, signals


def run_email_pipeline(email_text):
    # ML detection
    detection = analyze_text_content(email_text)

    # Advanced detectors
    url_result = analyze_urls(email_text)
    header_result = analyze_headers(email_text)
    brand_result = detect_brand_impersonation(email_text)
    social_result = analyze_social_engineering(email_text)
    attachment_result = analyze_attachments(email_text)

    # Notebook logic layer
    heuristic_score, heuristic_signals = notebook_style_signal_engine(email_text)

    # Intent
    intents = classify_email_intent(email_text)

    # Combined signal score
    advanced_signal_score = (
        url_result["url_score"]
        + header_result["header_score"]
        + brand_result["brand_score"]
        + social_result["social_score"]
        + attachment_result["attachment_score"]
        + heuristic_score
    )

    advanced_signal_score = min(advanced_signal_score, 100)

    # GREEN AI ROUTING
    model_routing = route_model(email_text, advanced_signal_score)

    # Risk calculation
    base_score = calculate_risk_score(detection)
    final_score = min(base_score + int(advanced_signal_score * 0.4), 100)
    final_level = risk_level(final_score)

    # Agents
    critic_notes = critique_decision(detection, {"advanced_signal_score": advanced_signal_score})
    reflection = generate_reflection(detection, final_score, final_level)
    prevention = generate_prevention_plan(detection, final_score, final_level)

    # Evidence aggregation
    evidence = []
    evidence.extend(detection.get("evidence", []))
    evidence.extend(url_result.get("url_issues", []))
    evidence.extend(header_result.get("header_issues", []))
    evidence.extend(brand_result.get("brand_issues", []))
    evidence.extend(attachment_result.get("attachment_issues", []))
    evidence.extend(heuristic_signals)

    selected_models = model_routing.get("selected_models", {})

    selected_model_summary = (
        selected_models.get("reasoning")
        or model_routing.get("selected_model")
        or "N/A"
    )

    evidence.append(f"Model selected: {selected_model_summary}")
    evidence.append(f"Carbon impact: {model_routing['carbon_impact']}")

    return {
        "detection": detection,
        "risk_score": final_score,
        "risk_level": final_level,
        "reflection": reflection,
        "prevention": prevention,
        "critic_notes": critic_notes,
        "intents": intents,
        "evidence": evidence,
        "advanced_signals": {
            "heuristic_score": heuristic_score,
            "advanced_signal_score": advanced_signal_score
        },
        "model_routing": model_routing
    }