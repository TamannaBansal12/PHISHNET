import cv2
import joblib
import numpy as np

import os

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))

MODEL_PATH = os.path.join(backend_dir, "models", "video_model.pkl")
MAX_FRAMES_PER_VIDEO = 30

model = joblib.load(MODEL_PATH)


def extract_video_features(file_path):
    cap = cv2.VideoCapture(file_path)

    pixel_means = []
    edge_means = []
    blur_scores = []
    frame_count = 0

    while cap.isOpened() and frame_count < MAX_FRAMES_PER_VIDEO:
        ret, frame = cap.read()

        if not ret:
            break

        frame = cv2.resize(frame, (224, 224))
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        pixel_means.append(np.mean(gray))

        edges = cv2.Canny(gray, 100, 200)
        edge_means.append(np.mean(edges))

        blur_scores.append(cv2.Laplacian(gray, cv2.CV_64F).var())

        frame_count += 1

    cap.release()

    if not pixel_means:
        return None

    return np.array([
        np.mean(pixel_means),
        np.std(pixel_means),
        np.mean(edge_means),
        np.std(edge_means),
        np.mean(blur_scores),
        np.std(blur_scores),
        frame_count
    ]).reshape(1, -1)


def analyze_video_file(file_path):
    features = extract_video_features(file_path)

    if features is None:
        return {
            "modality": "video",
            "prediction": "Unable to analyze",
            "confidence": 0.0,
            "evidence": ["No frames could be extracted from the video."],
            "features": {}
        }

    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    confidence = float(max(probability))

    return {
        "modality": "video",
        "prediction": "Manipulated / Deepfake Video" if prediction == 1 else "Original Video",
        "confidence": round(confidence, 2),
        "evidence": [
            "Sampled frames extracted from video.",
            "Pixel intensity consistency analyzed.",
            "Edge artifact patterns analyzed.",
            "Blur and frame-level artifact score analyzed.",
            "Random Forest video classifier applied."
        ],
        "features": {
            "feature_vector_size": int(features.shape[1]),
            "frames_analyzed": int(features[0][-1])
        }
    }