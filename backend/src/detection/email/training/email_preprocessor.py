import os
import re
import unicodedata
import pandas as pd

RAW_DIR = os.path.expanduser("~/DATASETS/PHISHNET/email")
OUTPUT_PATH = "data/processed/email_cleaned.csv"


def clean_text(text):
    text = str(text)
    text = unicodedata.normalize("NFKC", text.lower())

    text = re.sub(r"https?://\S+|www\.\S+", " URL ", text)
    text = re.sub(r"\S+@\S+", " EMAIL ", text)
    text = re.sub(r"\d+", " NUMBER ", text)
    text = re.sub(r"[^a-zA-Z\s]", " ", text)

    return " ".join(text.split())


def detect_text_column(df):
    possible = ["text", "email", "body", "message", "content", "Email Text", "subject"]

    for col in possible:
        if col in df.columns:
            return col

    object_cols = df.select_dtypes(include="object").columns

    if len(object_cols) > 0:
        return object_cols[0]

    return None


def detect_label_column(df):
    possible = ["label", "Label", "class", "Class", "target"]

    for col in possible:
        if col in df.columns:
            return col

    return None


def main():
    os.makedirs("data/processed", exist_ok=True)

    rows = []

    for file in os.listdir(RAW_DIR):
        if not file.endswith(".csv"):
            continue

        path = os.path.join(RAW_DIR, file)
        print(f"\nProcessing: {file}")

        try:
            df = pd.read_csv(path, encoding_errors="ignore")
        except:
            df = pd.read_csv(path, encoding="latin1", encoding_errors="ignore")

        text_col = detect_text_column(df)
        label_col = detect_label_column(df)

        print(f"Detected text column: {text_col}")
        print(f"Detected label column: {label_col}")

        if text_col is None:
            print(f"❌ Skipping {file} (no text column)")
            continue

        for _, row in df.iterrows():
            raw_text = row.get(text_col, "")

            if not str(raw_text).strip():
                continue

            if label_col:
                label = row.get(label_col, 0)
            else:
                label = 1 if "phish" in file.lower() else 0

            try:
                label = int(label)
            except:
                label = 1 if str(label).lower() in ["phishing", "spam"] else 0

            rows.append({
                "source_file": file,
                "label": label,
                "raw_text": str(raw_text),
                "cleaned_text": clean_text(raw_text)
            })

    if len(rows) == 0:
        print("\n❌ No data processed. Check dataset structure.")
        return

    final_df = pd.DataFrame(rows)

    # SAFE FILTERING
    if "cleaned_text" in final_df.columns:
        final_df = final_df[final_df["cleaned_text"].astype(str).str.len() > 5]
    else:
        print("⚠️ cleaned_text missing — skipping length filter")

    final_df.to_csv(OUTPUT_PATH, index=False)

    print("\n✅ Email preprocessing completed")
    print(f"Saved to: {OUTPUT_PATH}")
    print(f"Total rows: {len(final_df)}")

    if "label" in final_df.columns:
        print(final_df["label"].value_counts())


if __name__ == "__main__":
    main()