import cv2
import torch
import numpy as np
from torchvision import models, transforms
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class VideoModel:
    def __init__(self):
        # pretrained=True is deprecated; use weights= instead
        self.model = models.vgg16(weights=models.VGG16_Weights.IMAGENET1K_V1).features.to(device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],   # ImageNet stats
                                 std=[0.229, 0.224, 0.225])
        ])

    def extract_frames(self, video_path):
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            logger.error(f"Cannot open video file: '{video_path}'")
            raise ValueError(f"Cannot open video file: '{video_path}'")

        frames = []
        fps = int(cap.get(cv2.CAP_PROP_FPS))
        interval = max(1, fps // 2)

        count = 0
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            if count % interval == 0:
                frames.append(frame)
            count += 1

        cap.release()

        if not frames:
            logger.warning(f"No frames extracted from '{video_path}'.")

        return frames

    def extract_features(self, video_path):
        try:
            frames = self.extract_frames(video_path)
        except ValueError:
            return np.zeros(512)

        if not frames:
            return np.zeros(512)

        batch = [self.transform(f) for f in frames]
        batch = torch.stack(batch).to(device)

        with torch.no_grad():
            features = self.model(batch)

        features = features.mean(dim=[2, 3])
        result = features.mean(dim=0).cpu().numpy()

        # L2 normalize
        norm = np.linalg.norm(result)
        if norm > 0:
            result = result / norm

        return result