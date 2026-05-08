import librosa
import numpy as np


def extract_audio_features(file_path, sr=16000, n_mfcc=13):
    y, sr = librosa.load(file_path, sr=sr, mono=True)
    duration = librosa.get_duration(y=y, sr=sr)

    if len(y) < sr:
        return {
            "valid": False,
            "reason": "Audio is shorter than 1 second.",
            "duration": round(float(duration), 2)
        }

    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfcc_mean = mfcc.mean(axis=1)
    mfcc_std = mfcc.std(axis=1)

    return {
        "valid": True,
        "duration": round(float(duration), 2),
        "mfcc_mean_avg": round(float(np.mean(mfcc_mean)), 4),
        "mfcc_std_avg": round(float(np.mean(mfcc_std)), 4),
        "zcr": round(float(librosa.feature.zero_crossing_rate(y).mean()), 4),
        "rms": round(float(librosa.feature.rms(y=y).mean()), 4),
        "spectral_centroid": round(float(librosa.feature.spectral_centroid(y=y, sr=sr).mean()), 4),
        "spectral_rolloff": round(float(librosa.feature.spectral_rolloff(y=y, sr=sr).mean()), 4),
        "mfcc_vector": [round(float(x), 4) for x in mfcc_mean.tolist()]
    }
