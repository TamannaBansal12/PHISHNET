import os
import joblib
import pandas as pd

from scipy.sparse import hstack
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

INPUT_PATH = "data/processed/email_features.csv"
MODEL_DIR = "models"
MODEL_PATH = "models/email_model.pkl"
VECTORIZER_PATH = "models/vectorizer.pkl"


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("Loading email features...")
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

    print("Vectorizing text...")
    X_text_vec = vectorizer.fit_transform(X_text)

    X = hstack([X_text_vec, X_numeric])

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("Training email model...")
    model = LogisticRegression(
        max_iter=1000,
        class_weight="balanced",
        solver="liblinear"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n✅ Email Model Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print("\nClassification Report:")
    print(classification_report(y_test, preds))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, preds))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(vectorizer, VECTORIZER_PATH)

    print(f"\n✅ Saved model: {MODEL_PATH}")
    print(f"✅ Saved vectorizer: {VECTORIZER_PATH}")


if __name__ == "__main__":
    main()