import os
import cv2
import numpy as np
from tqdm import tqdm

RAW_DIR = os.path.expanduser("~/DATASETS/PHISHNET/video")
FEATURES_PATH = "data/processed/video_features.npy"
LABELS_PATH = "data/processed/video_labels.npy"

VIDEO_EXTENSIONS = (".mp4", ".avi", ".mov", ".mkv", ".webm")
MAX_VIDEOS = 800
MAX_FRAMES_PER_VIDEO = 30


def infer_video_label(path):
    path = path.lower()

    if "manipulated" in path:
        return 1

    if "original" in path:
        return 0

    return None


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

        blur = cv2.Laplacian(gray, cv2.CV_64F).var()
        blur_scores.append(blur)

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
    ])


def main():
    os.makedirs("data/processed", exist_ok=True)

    X = []
    y = []
    skipped = 0
    processed = 0

    video_files = []

    for root, _, files in os.walk(RAW_DIR):
        for file in files:
            if file.lower().endswith(VIDEO_EXTENSIONS):
                video_files.append(os.path.join(root, file))

    print(f"Found {len(video_files)} video files")
    print(f"Processing max {MAX_VIDEOS} videos for baseline training")

    for file_path in tqdm(video_files, desc="Processing video"):
        if processed >= MAX_VIDEOS:
            break

        label = infer_video_label(file_path)

        if label is None:
            skipped += 1
            continue

        try:
            features = extract_video_features(file_path)

            if features is None:
                skipped += 1
                continue

            X.append(features)
            y.append(label)
            processed += 1

        except Exception as e:
            skipped += 1
            print(f"Skipped {file_path}: {e}")

    X = np.array(X)
    y = np.array(y)

    np.save(FEATURES_PATH, X)
    np.save(LABELS_PATH, y)

    print("\n✅ Video preprocessing completed")
    print(f"Saved: {FEATURES_PATH}")
    print(f"Saved: {LABELS_PATH}")
    print(f"Samples: {len(X)} | Skipped: {skipped}")
    print(f"Label counts: original={sum(y == 0)}, manipulated={sum(y == 1)}")


if __name__ == "__main__":
    main()