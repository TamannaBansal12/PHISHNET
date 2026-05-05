def calculate_risk_score(result):
    confidence = float(result.get("confidence", 0.5))
    features = result.get("features", {})

    score = int(confidence * 60)

    if result.get("prediction") == "Phishing":
        score += 20

    score += min(int(features.get("url_count", 0)) * 5, 10)
    score += min(int(features.get("urgent_word_count", 0)) * 5, 10)

    return min(score, 100)


def risk_level(score):
    if score >= 75:
        return "High Risk"
    if score >= 45:
        return "Medium Risk"
    return "Low Risk"