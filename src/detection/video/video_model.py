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
# PHISHNET MULTI-MODEL VIDEO / VLM ARCHITECTURE
# =========================================================

VIDEO_MODEL_LEVELS = {

    "lightweight": {
        "name": "MobileNetV2 Frame Classifier",
        "purpose": "Fast low-compute visual manipulation screening",
        "green_it": "Lowest compute usage",
        "status": "ACTIVE"
    },

    "balanced": {
        "name": "EfficientNet / XceptionNet",
        "purpose": "Frame-level deepfake and artifact analysis",
        "green_it": "Balanced accuracy-energy routing",
        "status": "PLANNED"
    },

    "heavy": {
        "name": "ViT / TimeSformer / VLM Reasoning",
        "purpose": "Advanced temporal reasoning and multimodal manipulation analysis",
        "green_it": "High compute justified for high-risk forensic investigation",
        "status": "PLANNED"
    }
}


# =========================================================
# PATHS
# =========================================================

FEATURES_PATH = "data/processed/video_features.npy"

LABELS_PATH = "data/processed/video_labels.npy"

MODEL_PATH = "models/video_model.pkl"


# =========================================================
# TRAINING PIPELINE
# =========================================================

def main():

    os.makedirs("models", exist_ok=True)

    print("=================================================")
    print("PHISHNET VIDEO / VLM INTELLIGENCE ENGINE")
    print("Green-Aware Multi-Model Architecture")
    print("=================================================")

    print("\n🎥 Available Video / VLM Models:")

    for level, info in VIDEO_MODEL_LEVELS.items():

        print(f"\n[{level.upper()}]")

        print(f"Model: {info['name']}")

        print(f"Purpose: {info['purpose']}")

        print(f"Green IT: {info['green_it']}")

        print(f"Status: {info['status']}")

    print("\nLoading video features...")

    X = np.load(FEATURES_PATH)

    y = np.load(LABELS_PATH)

    print(f"\nVideo features shape: {X.shape}")

    print(f"Labels shape: {y.shape}")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("\nTraining lightweight video intelligence model...")

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\n=================================================")
    print("✅ VIDEO MODEL RESULTS")
    print("=================================================")

    print("\nAccuracy:", accuracy_score(y_test, preds))

    print("\nClassification Report:")

    print(classification_report(y_test, preds))

    print("\nConfusion Matrix:")

    print(confusion_matrix(y_test, preds))

    joblib.dump(model, MODEL_PATH)

    print("\n=================================================")

    print(f"✅ Saved model: {MODEL_PATH}")

    print("✅ Green-Aware Video / VLM Intelligence Pipeline Ready")

    print("=================================================")


if __name__ == "__main__":
    main()