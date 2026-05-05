import re
import joblib
import numpy as np
from scipy.sparse import hstack

MODEL_PATH = "models/email_model.pkl"
VECTORIZER_PATH = "models/vectorizer.pkl"

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

SUSPICIOUS_WORDS = [
    "urgent", "verify", "password", "bank", "account",
    "click", "login", "otp", "suspended", "limited",
    "immediately", "payment", "transfer", "invoice"
]


def extract_security_features(text):
    text = str(text)
    lower = text.lower()

    return [
        len(re.findall(r"https?://|www\.", text)),
        len(re.findall(r"\S+@\S+", text)),
        len(re.findall(r"\d+", text)),
        sum(word in lower for word in SUSPICIOUS_WORDS),
        len(text)
    ]


def analyze_text_content(text):
    text = str(text)

    text_vec = vectorizer.transform([text])
    numeric_features = np.array(extract_security_features(text)).reshape(1, -1)

    X = hstack([text_vec, numeric_features])

    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0]
    confidence = float(max(probability))

    return {
        "modality": "email/text",
        "prediction": "Phishing" if prediction == 1 else "Legitimate",
        "confidence": round(confidence, 2),
        "features": {
            "url_count": int(numeric_features[0][0]),
            "email_count": int(numeric_features[0][1]),
            "number_count": int(numeric_features[0][2]),
            "urgent_word_count": int(numeric_features[0][3]),
            "text_length": int(numeric_features[0][4]),
        },
        "evidence": [
            f"ML prediction: {'Phishing' if prediction == 1 else 'Legitimate'}",
            f"Model confidence: {round(confidence, 2)}",
            f"URLs detected: {int(numeric_features[0][0])}",
            f"Urgency indicators: {int(numeric_features[0][3])}",
            "TF-IDF + phishing security features used."
        ]
    }