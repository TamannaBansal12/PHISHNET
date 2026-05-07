import os
import joblib
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    classification_report,
    accuracy_score,
    confusion_matrix
)


# =========================================================
# PHISHNET MULTI-MODEL AUDIO ARCHITECTURE
# =========================================================

AUDIO_MODEL_LEVELS = {

    "lightweight": {
        "name": "MFCC + Random Forest",
        "purpose": "Fast low-compute synthetic voice screening",
        "green_it": "Lowest compute usage",
        "status": "ACTIVE"
    },

    "balanced": {
        "name": "CNN / BiLSTM Audio Classifier",
        "purpose": "Temporal and spectral voice pattern analysis",
        "green_it": "Balanced accuracy-energy routing",
        "status": "PLANNED"
    },

    "heavy": {
        "name": "wav2vec2 / Whisper + LLM Reflection",
        "purpose": "Advanced deepfake and voice impersonation reasoning",
        "green_it": "High compute justified for high-risk forensic analysis",
        "status": "PLANNED"
    }
}


# =========================================================
# PATHS
# =========================================================

FEATURES_PATH = "data/processed/audio_features.npy"

LABELS_PATH = "data/processed/audio_labels.npy"

MODEL_PATH = "models/audio_model.pkl"


# =========================================================
# TRAINING PIPELINE
# =========================================================

def main():

    os.makedirs("models", exist_ok=True)

    print("=================================================")
    print("PHISHNET AUDIO INTELLIGENCE ENGINE")
    print("Green-Aware Multi-Model Architecture")
    print("=================================================")

    print("\n🎙️ Available Audio Models:")

    for level, info in AUDIO_MODEL_LEVELS.items():

        print(f"\n[{level.upper()}]")

        print(f"Model: {info['name']}")

        print(f"Purpose: {info['purpose']}")

        print(f"Green IT: {info['green_it']}")

        print(f"Status: {info['status']}")

    print("\nLoading audio features...")

    X = np.load(FEATURES_PATH)

    y = np.load(LABELS_PATH)

    print(f"\nAudio features shape: {X.shape}")

    print(f"Labels shape: {y.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTraining lightweight audio intelligence model...")

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n=================================================")
    print("✅ AUDIO MODEL RESULTS")
    print("=================================================")

    print("\nAccuracy:", accuracy_score(y_test, preds))

    print("\nClassification Report:")

    print(classification_report(y_test, preds))

    print("\nConfusion Matrix:")

    print(confusion_matrix(y_test, preds))

    joblib.dump(model, MODEL_PATH)

    print("\n=================================================")

    print(f"✅ Saved model: {MODEL_PATH}")

    print("✅ Green-Aware Audio Intelligence Pipeline Ready")

    print("=================================================")


if __name__ == "__main__":
    main()