def route_model(email_text, advanced_signal_score=0):
    text = str(email_text)
    text_lower = text.lower()
    length = len(text)

    high_risk_terms = [
        "password", "otp", "bank", "transfer", "urgent", "verify",
        "login", "suspended", "invoice", "payment", "wire transfer",
        "account locked", "reset password"
    ]

    risk_keyword_count = sum(term in text_lower for term in high_risk_terms)

    if length < 300 and risk_keyword_count <= 1 and advanced_signal_score < 25:
        return {
            "selected_model": "lightweight_model",
            "routing_reason": "Short, low-risk input. Lightweight path selected to reduce unnecessary compute.",
            "carbon_impact": "Low",
            "compute_efficiency": "High efficiency / low energy",
            "input_length": length,
            "risk_keyword_count": risk_keyword_count,
        }

    if length < 1200 and risk_keyword_count <= 4 and advanced_signal_score < 60:
        return {
            "selected_model": "balanced_model",
            "routing_reason": "Moderate complexity. Balanced model selected for accuracy and energy efficiency.",
            "carbon_impact": "Medium",
            "compute_efficiency": "Balanced accuracy-energy",
            "input_length": length,
            "risk_keyword_count": risk_keyword_count,
        }

    return {
        "selected_model": "heavy_reasoning_model",
        "routing_reason": "Complex or high-risk input. Stronger reasoning path selected for deeper analysis.",
        "carbon_impact": "High",
        "compute_efficiency": "High accuracy / higher compute",
        "input_length": length,
        "risk_keyword_count": risk_keyword_count,
    }