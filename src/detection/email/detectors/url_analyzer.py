import re
from urllib.parse import urlparse

SHORTENERS = ["bit.ly", "tinyurl", "t.co", "goo.gl", "ow.ly", "is.gd"]


def analyze_urls(text):
    urls = re.findall(r"https?://[^\s]+|www\.[^\s]+", str(text))
    issues = []

    for url in urls:
        parsed = urlparse(url if url.startswith("http") else "http://" + url)
        domain = parsed.netloc.lower()

        if any(s in domain for s in SHORTENERS):
            issues.append(f"Shortened URL detected: {domain}")

        if re.search(r"\d+\.\d+\.\d+\.\d+", domain):
            issues.append(f"IP-based URL detected: {domain}")

        if domain.count(".") > 3:
            issues.append(f"Excessive subdomains: {domain}")

        if "-" in domain:
            issues.append(f"Hyphenated suspicious domain: {domain}")

        if "login" in domain or "verify" in domain or "secure" in domain:
            issues.append(f"Credential-themed domain: {domain}")

    return {
        "url_count": len(urls),
        "url_issues": issues,
        "url_score": min(len(issues) * 10 + len(urls) * 3, 30)
    }