import os
import joblib
import pandas as pd

from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix
)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression


# =========================================================
# PHISHNET MULTI-MODEL EMAIL ARCHITECTURE
# =========================================================

EMAIL_MODEL_LEVELS = {

    "lightweight": {
        "name": "TF-IDF + Logistic Regression",
        "purpose": "Fast low-compute phishing screening",
        "green_it": "Lowest compute usage",
        "status": "ACTIVE"
    },

    "balanced": {
        "name": "DistilBERT / TinyBERT",
        "purpose": "Semantic phishing analysis",
        "green_it": "Balanced accuracy-energy routing",
        "status": "PLANNED"
    },

    "heavy": {
        "name": "DeBERTa-v3 / RoBERTa + LLM Reflection",
        "purpose": "Advanced contextual reasoning for complex phishing",
        "green_it": "High compute justified for high-risk threats",
        "status": "PLANNED"
    }
}


# =========================================================
# PATHS
# =========================================================

INPUT_PATH = "data/processed/email_features.csv"

MODEL_DIR = "models"

MODEL_PATH = "models/email_model.pkl"

VECTORIZER_PATH = "models/vectorizer.pkl"


# =========================================================
# TRAINING PIPELINE
# =========================================================

def main():

    os.makedirs(MODEL_DIR, exist_ok=True)

    print("=================================================")
    print("PHISHNET EMAIL INTELLIGENCE ENGINE")
    print("Green-Aware Multi-Model Architecture")
    print("=================================================")

    print("\n📧 Available Email Models:")

    for level, info in EMAIL_MODEL_LEVELS.items():

        print(f"\n[{level.upper()}]")

        print(f"Model: {info['name']}")

        print(f"Purpose: {info['purpose']}")

        print(f"Green IT: {info['green_it']}")

        print(f"Status: {info['status']}")

    print("\nLoading email features...")

    df = pd.read_csv(INPUT_PATH)

    df = df.dropna(subset=["cleaned_text", "label"])

    X_text = df["cleaned_text"].astype(str)

    X_numeric = df[
        [
            "url_count",
            "email_count",
            "number_count",
            "urgent_word_count",
            "text_length",
        ]
    ]

    y = df["label"].astype(int)

    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        min_df=2,
        max_df=0.95
    )

    print("\nVectorizing text using lightweight route...")

    X_text_vec = vectorizer.fit_transform(X_text)

    X = hstack([X_text_vec, X_numeric])

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTraining lightweight email intelligence model...")

    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        solver="liblinear"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n=================================================")
    print("✅ EMAIL MODEL RESULTS")
    print("=================================================")

    print("\nAccuracy:", accuracy_score(y_test, preds))

    print("\nClassification Report:")

    print(classification_report(y_test, preds))

    print("\nConfusion Matrix:")

    print(confusion_matrix(y_test, preds))

    joblib.dump(model, MODEL_PATH)

    joblib.dump(vectorizer, VECTORIZER_PATH)

    print("\n=================================================")

    print(f"✅ Saved model: {MODEL_PATH}")

    print(f"✅ Saved vectorizer: {VECTORIZER_PATH}")

    print("✅ Green-Aware Email Intelligence Pipeline Ready")

    print("=================================================")


if __name__ == "__main__":
    main()