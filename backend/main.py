import os
import joblib
import numpy as np
import pandas as pd
from tqdm import tqdm
from sklearn.svm import SVC

from ml_pipeline.text_module import TextModel
from ml_pipeline.image_module import ImageModel
from ml_pipeline.video_module import VideoModel

os.makedirs("backend/saved_models", exist_ok=True)


def late_fusion(pt=None, pi=None, pv=None):
    """
    Dynamically fuse only the modalities that are provided.
      - Only text:          pt / 1
      - Any two modalities: (p1 + p2) / 2
      - All three:          (pt + pi + pv) / 3
    """
    available = {k: v for k, v in {"text": pt, "image": pi, "video": pv}.items() if v is not None}

    if not available:
        raise ValueError("At least one modality probability array must be provided.")

    # Trim all arrays to the same length
    n = min(len(v) for v in available.values())
    trimmed = {k: v[:n] for k, v in available.items()}

    p_final = sum(trimmed.values()) / len(trimmed)
    y_pred = (p_final >= 0.5).astype(int)

    return y_pred, p_final


def train():
    print("🚀 Training started...\n")

    trained = {}   # will hold { "text": svm_text, "image": svm_img, "video": svm_vid }
    features = {}  # will hold { "text": X_text, "image": X_img, "video": X_vid }

    # -------- TEXT --------
    text_csv = "datasets/processed/text/train.csv"
    if os.path.exists(text_csv):
        text_df = pd.read_csv(text_csv)
        text_model = TextModel()

        X_text, y_text = [], []
        for t, label in tqdm(zip(text_df['text'][:10000], text_df['label'][:10000]),
                             total=min(10000, len(text_df)), desc="Text features"):
            X_text.append(text_model.extract_features(t))
            y_text.append(label)

        svm_text = SVC(kernel='linear', probability=True)
        svm_text.fit(X_text, y_text)
        joblib.dump(svm_text, "backend/saved_models/text.pkl")

        trained["text"] = svm_text
        features["text"] = X_text
        print("✅ Text model trained and saved.")
    else:
        print("⚠️  Text dataset not found, skipping text modality.")

    # -------- IMAGE --------
    img_base = "datasets/processed/images/train"
    if os.path.exists(img_base):
        image_model = ImageModel()
        X_img, y_img = [], []

        for label in ["depressed", "normal"]:
            folder = os.path.join(img_base, label)
            if not os.path.exists(folder):
                print(f"⚠️  Image folder not found: {folder}")
                continue
            for file in tqdm(os.listdir(folder)[:5000], desc=f"Image [{label}]"):
                path = os.path.join(folder, file)
                X_img.append(image_model.extract_features(path))
                y_img.append(1 if label == "depressed" else 0)

        if X_img:
            svm_img = SVC(kernel='linear', probability=True)
            svm_img.fit(X_img, y_img)
            joblib.dump(svm_img, "backend/saved_models/image.pkl")

            trained["image"] = svm_img
            features["image"] = X_img
            print("✅ Image model trained and saved.")
    else:
        print("⚠️  Image dataset not found, skipping image modality.")

    # -------- VIDEO --------
    vid_base = "datasets/processed/videos"
    if os.path.exists(vid_base):
        video_model = VideoModel()
        X_vid, y_vid = [], []

        for label in ["depressed", "normal"]:
            folder = os.path.join(vid_base, label)
            if not os.path.exists(folder):
                print(f"⚠️  Video folder not found: {folder}")
                continue
            for file in tqdm(os.listdir(folder)[:200], desc=f"Video [{label}]"):
                path = os.path.join(folder, file)
                X_vid.append(video_model.extract_features(path))
                y_vid.append(1 if label == "depressed" else 0)

        if X_vid:
            svm_vid = SVC(kernel='linear', probability=True)
            svm_vid.fit(X_vid, y_vid)
            joblib.dump(svm_vid, "backend/saved_models/video.pkl")

            trained["video"] = svm_vid
            features["video"] = X_vid
            print("✅ Video model trained and saved.")
    else:
        print("⚠️  Video dataset not found, skipping video modality.")

    if not trained:
        print("\n❌ No modalities were trained. Check your dataset paths.")
        return

    print(f"\n✅ All available models trained! Modalities: {list(trained.keys())}")

    # -------- FUSION --------
    print("\n🔗 Running Fusion on trained modalities...")

    pt = trained["text"].predict_proba(features["text"])[:, 1]  if "text"  in trained else None
    pi = trained["image"].predict_proba(features["image"])[:, 1] if "image" in trained else None
    pv = trained["video"].predict_proba(features["video"])[:, 1] if "video" in trained else None

    y_pred, p_final = late_fusion(pt=pt, pi=pi, pv=pv)

    print(f"\n🎯 Sample Final Predictions : {y_pred[:10]}")
    print(f"📊 Sample Probabilities     : {p_final[:10]}")
    print(f"🔢 Modalities used in fusion: {sum(x is not None for x in [pt, pi, pv])}")

    print("\n🎉 TRAINING + FUSION COMPLETE!")


if __name__ == "__main__":
    train() 