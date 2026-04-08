import numpy as np


class FusionModel:
    def __init__(self, w1=1.0, w2=1.0, w3=1.0):
        self.w1 = w1
        self.w2 = w2
        self.w3 = w3

    def fuse(self, pt=None, pi=None, pv=None):
        """
        Dynamically fuse only the modalities that are provided.
        - Only text:        pt / 1
        - Text + Image:     (pt + pi) / 2
        - Text + Video:     (pt + pv) / 2
        - Image + Video:    (pi + pv) / 2
        - All three:        (pt + pi + pv) / 3
        """
        modalities = []
        weights = []

        if pt is not None:
            modalities.append(self.w1 * pt)
            weights.append(self.w1)

        if pi is not None:
            modalities.append(self.w2 * pi)
            weights.append(self.w2)

        if pv is not None:
            modalities.append(self.w3 * pv)
            weights.append(self.w3)

        if not modalities:
            raise ValueError("At least one modality (pt, pi, pv) must be provided.")

        return sum(modalities) / sum(weights)

    def predict(self, pt=None, pi=None, pv=None):
        p_final = self.fuse(pt=pt, pi=pi, pv=pv)
        return 1 if p_final >= 0.5 else 0