def critique_decision(result, advanced_signals):
    critiques = []

    prediction = result.get("prediction", "Unknown")
    confidence = float(result.get("confidence", 0))
    total_signal_score = int(advanced_signals.get("advanced_signal_score", 0))

    if confidence < 0.60:
        critiques.append("Model confidence is low, so manual review is recommended.")

    if prediction == "Legitimate" and total_signal_score >= 40:
        critiques.append("Possible false negative: advanced phishing signals are high even though ML predicted legitimate.")

    if prediction == "Phishing" and total_signal_score <= 10:
        critiques.append("Model predicted phishing, but supporting advanced signals are limited.")

    if not critiques:
        critiques.append("No major contradiction found between ML output and advanced signal analysis.")

    return critiques
