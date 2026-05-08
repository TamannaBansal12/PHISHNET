TACTICS = {
    "urgency": ["urgent", "immediately", "act now", "limited time", "asap"],
    "fear": ["suspended", "blocked", "terminated", "compromised", "unauthorized"],
    "authority": ["admin", "security team", "manager", "ceo", "official"],
    "reward": ["prize", "winner", "bonus", "gift", "lottery"],
    "credential_request": ["password", "otp", "pin", "login", "verify account"],
    "financial_pressure": ["payment", "bank", "transfer", "invoice", "refund"],
}


def analyze_social_engineering(text):
    text = str(text).lower()
    detected = []
    score = 0

    for tactic, words in TACTICS.items():
        if any(word in text for word in words):
            detected.append(tactic)
            score += 10

    return {
        "social_tactics": detected,
        "social_score": min(score, 40)
    }