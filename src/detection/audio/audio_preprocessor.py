import os
import numpy as np
import librosa
from tqdm import tqdm

RAW_DIR = os.path.expanduser("~/DATASETS/PHISHNET/audio")
FEATURES_PATH = "data/processed/audio_features.npy"
LABELS_PATH = "data/processed/audio_labels.npy"

AUDIO_EXTENSIONS = (".wav", ".mp3", ".flac", ".m4a", ".ogg", ".aac")


def infer_audio_label(path):
    path = path.lower()

    if "original" in path:
        return 0

    if "norm" in path or "rerec" in path or "2sec" in path or "fake" in path:
        return 1

    return None


def extract_audio_features(file_path, sr=16000):
    y, sr = librosa.load(file_path, sr=sr, mono=True)

    if len(y) < sr * 0.5:
        return None

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
    zero_crossing = librosa.feature.zero_crossing_rate(y)

    features = np.concatenate([
        np.mean(mfcc, axis=1),
        [np.mean(spectral_centroid)],
        [np.mean(spectral_rolloff)],
        [np.mean(zero_crossing)]
    ])

    return features


def main():
    os.makedirs("data/processed", exist_ok=True)

    X = []
    y = []
    skipped = 0

    audio_files = []

    for root, _, files in os.walk(RAW_DIR):
        for file in files:
            if file.lower().endswith(AUDIO_EXTENSIONS):
                audio_files.append(os.path.join(root, file))

    print(f"Found {len(audio_files)} audio files")

    for file_path in tqdm(audio_files, desc="Processing audio"):
        label = infer_audio_label(file_path)

        if label is None:
            skipped += 1
            continue

        try:
            features = extract_audio_features(file_path)

            if features is None:
                skipped += 1
                continue

            X.append(features)
            y.append(label)

        except Exception as e:
            skipped += 1
            print(f"Skipped {file_path}: {e}")

    X = np.array(X)
    y = np.array(y)

    np.save(FEATURES_PATH, X)
    np.save(LABELS_PATH, y)

    print("\n✅ Audio preprocessing completed")
    print(f"Saved: {FEATURES_PATH}")
    print(f"Saved: {LABELS_PATH}")
    print(f"Samples: {len(X)} | Skipped: {skipped}")
    print(f"Label counts: real={sum(y == 0)}, fake={sum(y == 1)}")


if __name__ == "__main__":
    main()