def generate_reflection(result, risk_score, risk_level, model_routing=None):
    prediction = result.get("prediction", "Unknown")
    confidence = result.get("confidence", 0)
    features = result.get("features", {})

    green_section = ""
    if model_routing:
        green_section = f"""
Green AI / Carbon-Aware Routing:
- Selected model path: {model_routing.get("selected_model", "N/A")}
- Routing reason: {model_routing.get("routing_reason", "N/A")}
- Estimated carbon impact: {model_routing.get("carbon_impact", "N/A")}
- Compute efficiency: {model_routing.get("compute_efficiency", "N/A")}
"""

    return f"""
The system analyzed this email using a hybrid phishing detection pipeline.

Model Decision:
The email was classified as **{prediction}** with confidence **{confidence}**.

Security Signals Observed:
- URLs detected: {features.get("url_count", 0)}
- Email addresses detected: {features.get("email_count", 0)}
- Numbers detected: {features.get("number_count", 0)}
- Urgency indicators: {features.get("urgent_word_count", 0)}
- Text length: {features.get("text_length", 0)}

Agentic Reflection:
The model decision was reviewed against suspicious communication patterns such as urgency,
credential-seeking behavior, embedded links, sender references, spoofing signals,
brand impersonation, and social engineering cues.

{green_section}

Final Risk Interpretation:
This email is categorized as **{risk_level}** with a risk score of **{risk_score}/100**.
"""