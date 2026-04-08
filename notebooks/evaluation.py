# evaluation.py

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_curve,
    auc
)

# ==============================
# 🔹 SAMPLE DATA (Replace with your real predictions)
# ==============================

# True labels (0 = Normal, 1 = Depressed)
y_true = np.random.randint(0, 2, 100)

# Example model predictions
models = {
    "Logistic Regression": {
        "y_pred": np.random.randint(0, 2, 100),
        "y_prob": np.random.rand(100)
    },
    "Random Forest": {
        "y_pred": np.random.randint(0, 2, 100),
        "y_prob": np.random.rand(100)
    },
    "SVM": {
        "y_pred": np.random.randint(0, 2, 100),
        "y_prob": np.random.rand(100)
    }
}

# ==============================
# 🔹 EDA - Histogram
# ==============================

plt.figure(figsize=(6,4))
sns.countplot(x=y_true)
plt.title("Class Distribution (EDA)")
plt.xlabel("Class (0=Normal, 1=Depressed)")
plt.ylabel("Count")
plt.show()

# ==============================
# 🔹 EVALUATION LOOP
# ==============================

for name, data in models.items():
    y_pred = data["y_pred"]
    y_prob = data["y_prob"]

    print("\n" + "="*50)
    print(f"📊 Model: {name}")
    print("="*50)

    # 🔹 Metrics
    acc = accuracy_score(y_true, y_pred)
    prec = precision_score(y_true, y_pred)
    rec = recall_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred)

    print(f"Accuracy : {acc:.4f}")
    print(f"Precision: {prec:.4f}")
    print(f"Recall   : {rec:.4f}")
    print(f"F1 Score : {f1:.4f}")

    print("\nClassification Report:\n")
    print(classification_report(y_true, y_pred))

    # ==============================
    # 🔹 CONFUSION MATRIX
    # ==============================

    cm = confusion_matrix(y_true, y_pred)

    plt.figure(figsize=(5,4))
    sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
    plt.title(f"Confusion Matrix - {name}")
    plt.xlabel("Predicted")
    plt.ylabel("Actual")
    plt.show()

    # ==============================
    # 🔹 ROC CURVE
    # ==============================

    fpr, tpr, _ = roc_curve(y_true, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(5,4))
    plt.plot(fpr, tpr, label=f"AUC = {roc_auc:.2f}")
    plt.plot([0, 1], [0, 1], linestyle="--")
    plt.title(f"ROC Curve - {name}")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.legend()
    plt.show()

    # ==============================
    # 🔹 PREDICTION DISTRIBUTION
    # ==============================

    plt.figure(figsize=(5,4))
    sns.histplot(y_pred, bins=2, kde=False)
    plt.title(f"Prediction Distribution - {name}")
    plt.xlabel("Predicted Class")
    plt.ylabel("Count")
    plt.show()

# ==============================
# 🔥 END
# ==============================

print("\n✅ Evaluation Completed Successfully!")