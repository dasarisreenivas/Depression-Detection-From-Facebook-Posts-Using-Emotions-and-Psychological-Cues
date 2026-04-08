import os
import joblib
import numpy as np
from flask import Flask, request, jsonify

from ml_pipeline.text_module import TextModel
from ml_pipeline.image_module import ImageModel
from ml_pipeline.video_module import VideoModel
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# -------- LOAD MODELS --------
svm_text = joblib.load("backend/saved_models/text.pkl")
svm_img = joblib.load("backend/saved_models/image.pkl")
svm_vid = joblib.load("backend/saved_models/video.pkl")

text_model = TextModel()
image_model = ImageModel()
video_model = VideoModel()


# -------- FUSION --------
def late_fusion(pt, pi, pv):
    p_final = (pt + pi + pv) / 3.0
    return int(p_final >= 0.5), float(p_final)


# -------- API ROUTE --------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        text = request.form.get("text")
        image = request.files.get("image")
        video = request.files.get("video")

        # -------- TEXT --------
        if text:
            ft = text_model.extract_features(text)
            pt = svm_text.predict_proba([ft])[0][1]
        else:
            pt = 0.0

        # -------- IMAGE --------
        if image:
            img_path = "temp_img.jpg"
            image.save(img_path)

            fi = image_model.extract_features(img_path)
            pi = svm_img.predict_proba([fi])[0][1]

            os.remove(img_path)
        else:
            pi = 0.0

        # -------- VIDEO --------
        if video:
            vid_path = "temp_vid.mp4"
            video.save(vid_path)

            fv = video_model.extract_features(vid_path)
            pv = svm_vid.predict_proba([fv])[0][1]

            os.remove(vid_path)
        else:
            pv = 0.0

        # -------- FUSION --------
        pred, prob = late_fusion(pt, pi, pv)

        return jsonify({
            "prediction": "Depressed" if pred == 1 else "Healthy",
            "confidence": round(prob, 3),
            "details": {
                "text": round(pt, 3),
                "image": round(pi, 3),
                "video": round(pv, 3)
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)