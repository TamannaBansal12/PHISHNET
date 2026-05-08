def classify_email_intent(text):
    text = str(text).lower()
    intents = []

    if any(x in text for x in ["password", "otp", "pin", "login", "verify account", "reset your password"]):
        intents.append("credential_theft")

    if any(x in text for x in ["payment", "transfer", "invoice", "bank", "refund", "account suspended"]):
        intents.append("financial_fraud")

    if any(x in text for x in [".exe", ".docm", ".xlsm", ".zip", ".rar", "download attachment"]):
        intents.append("malware_delivery")

    if any(x in text for x in ["ceo", "manager", "urgent approval", "wire transfer"]):
        intents.append("business_email_compromise")

    if any(x in text for x in ["prize", "winner", "lottery", "gift", "reward"]):
        intents.append("reward_scam")

    if not intents:
        intents.append("general_email")

    return intents