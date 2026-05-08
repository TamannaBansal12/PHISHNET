import re


def analyze_headers(text):
    text = str(text)
    issues = []

    from_match = re.search(r"from:\s*(.*)", text, re.IGNORECASE)
    reply_match = re.search(r"reply-to:\s*(.*)", text, re.IGNORECASE)
    return_match = re.search(r"return-path:\s*(.*)", text, re.IGNORECASE)

    from_value = from_match.group(1).strip() if from_match else ""
    reply_value = reply_match.group(1).strip() if reply_match else ""
    return_value = return_match.group(1).strip() if return_match else ""

    if reply_value and from_value and reply_value.split("@")[-1] != from_value.split("@")[-1]:
        issues.append("Reply-To domain mismatch detected")

    if return_value and from_value and return_value.split("@")[-1] != from_value.split("@")[-1]:
        issues.append("Return-Path domain mismatch detected")

    if "spf=fail" in text.lower():
        issues.append("SPF authentication failed")

    if "dkim=fail" in text.lower():
        issues.append("DKIM authentication failed")

    if "dmarc=fail" in text.lower():
        issues.append("DMARC authentication failed")

    return {
        "header_issues": issues,
        "header_score": min(len(issues) * 12, 30)
    }