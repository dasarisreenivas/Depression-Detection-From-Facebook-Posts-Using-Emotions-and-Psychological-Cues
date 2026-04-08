import torch
import numpy as np
from torchvision import models, transforms
from PIL import Image
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class ImageModel:
    def __init__(self):
        # pretrained=True is deprecated; use weights= instead
        self.model = models.vgg16(weights=models.VGG16_Weights.IMAGENET1K_V1).features.to(device)
        self.model.eval()

        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],   # ImageNet stats
                                 std=[0.229, 0.224, 0.225])
        ])

    def extract_features(self, img_path):
        try:
            img = Image.open(img_path).convert("RGB")
        except Exception as e:
            logger.error(f"Failed to open image '{img_path}': {e}")
            raise

        img = self.transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            features = self.model(img)

        features = features.mean(dim=[2, 3]).cpu().numpy().flatten()

        # L2 normalize
        norm = np.linalg.norm(features)
        if norm > 0:
            features = features / norm

        return features