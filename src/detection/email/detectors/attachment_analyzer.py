import re

RISKY_EXTENSIONS = [
    ".exe", ".scr", ".bat", ".cmd", ".js", ".vbs", ".jar",
    ".docm", ".xlsm", ".pptm", ".zip", ".rar", ".7z"
]


def analyze_attachments(text):
    text = str(text).lower()
    issues = []

    for ext in RISKY_EXTENSIONS:
        if ext in text:
            issues.append(f"Risky attachment extension detected: {ext}")

    suspicious_names = re.findall(r"(invoice|payment|receipt|resume|bank|statement)[\w\-]*\.(exe|zip|rar|docm|xlsm)", text)

    if suspicious_names:
        issues.append("Suspicious attachment naming pattern detected")

    return {
        "attachment_issues": issues,
        "attachment_score": min(len(issues) * 15, 30)
    }