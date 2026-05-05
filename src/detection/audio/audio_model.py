import os
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

FEATURES_PATH = "data/processed/audio_features.npy"
LABELS_PATH = "data/processed/audio_labels.npy"
MODEL_PATH = "models/audio_model.pkl"


def main():
    os.makedirs("models", exist_ok=True)

    X = np.load(FEATURES_PATH)
    y = np.load(LABELS_PATH)

    print(f"Audio features shape: {X.shape}")
    print(f"Labels shape: {y.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )

    print("Training audio model...")
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n✅ Audio Model Results")
    print("Accuracy:", accuracy_score(y_test, preds))
    print("\nClassification Report:")
    print(classification_report(y_test, preds))
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, preds))

    joblib.dump(model, MODEL_PATH)
    print(f"\n✅ Saved model: {MODEL_PATH}")


if __name__ == "__main__":
    main()