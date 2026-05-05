BRANDS = {
    "google": ["g00gle", "gooogle", "google-login", "googleverify"],
    "microsoft": ["micr0soft", "rnicrosoft", "microsoft-login", "ms-security"],
    "paypal": ["paypa1", "paypal-secure", "paypalverify"],
    "amazon": ["amaz0n", "amazon-login", "amazonverify"],
    "sbi": ["sbi-verify", "sbionline-secure"],
    "hdfc": ["hdfc-verify", "hdfcbank-secure"],
    "icici": ["icici-verify", "icicibank-secure"],
    "oracle": ["oracle-login", "oracleverify"],
}


def detect_brand_impersonation(text):
    text = str(text).lower()
    issues = []

    for brand, suspicious_terms in BRANDS.items():
        brand_mentioned = brand in text
        spoof_terms = [term for term in suspicious_terms if term in text]

        if brand_mentioned and spoof_terms:
            issues.append(f"Possible {brand.title()} impersonation: {spoof_terms}")

        if spoof_terms and not brand_mentioned:
            issues.append(f"Lookalike brand pattern detected: {spoof_terms}")

    return {
        "brand_issues": issues,
        "brand_score": min(len(issues) * 15, 30)
    }