import torch
import numpy as np
from transformers import DebertaTokenizer, DebertaModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class TextModel:
    def __init__(self):
        self.tokenizer = DebertaTokenizer.from_pretrained("microsoft/deberta-base")
        self.model = DebertaModel.from_pretrained("microsoft/deberta-base").to(device)
        self.model.eval()

    def extract_features(self, text):
        if not text or not text.strip():
            logger.warning("Empty or blank text received.")
            raise ValueError("Input text must not be empty.")

        try:
            inputs = self.tokenizer(
                text,
                padding='max_length',
                truncation=True,
                max_length=128,
                return_tensors="pt"
            )
        except Exception as e:
            logger.error(f"Tokenization failed: {e}")
            raise

        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = self.model(**inputs)

        features = outputs.last_hidden_state[:, 0, :].cpu().numpy().flatten()

        # L2 normalize
        norm = np.linalg.norm(features)
        if norm > 0:
            features = features / norm

        return features