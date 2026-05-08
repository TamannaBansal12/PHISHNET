import re
import pandas as pd

INPUT_PATH = "data/processed/email_cleaned.csv"
OUTPUT_PATH = "data/processed/email_features.csv"

SUSPICIOUS_WORDS = [
    "urgent", "verify", "password", "bank", "account",
    "click", "login", "otp", "suspended", "limited",
    "immediately", "payment", "transfer", "invoice"
]


def extract_features(text):
    text = str(text)
    lower = text.lower()

    return {
        "url_count": len(re.findall(r"https?://|www\.", text)),
        "email_count": len(re.findall(r"\S+@\S+", text)),
        "number_count": len(re.findall(r"\d+", text)),
        "urgent_word_count": sum(word in lower for word in SUSPICIOUS_WORDS),
        "text_length": len(text)
    }


def main():
    df = pd.read_csv(INPUT_PATH)

    features = df["raw_text"].apply(extract_features).apply(pd.Series)
    df = pd.concat([df, features], axis=1)

    df.to_csv(OUTPUT_PATH, index=False)

    print("✅ Email feature engineering completed")
    print(f"Saved to: {OUTPUT_PATH}")
    print(df.head())


if __name__ == "__main__":
    main()