import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay
from tensorflow.keras.models import load_model

# Dummy example values (replace with real model training output)
loss = [1.2, 0.8, 0.4, 0.2]
val_loss = [1.1, 0.9, 0.6, 0.3]

# Loss Curve
plt.plot(loss, label="Train")
plt.plot(val_loss, label="Validation")
plt.title("Training Loss")
plt.legend()
plt.savefig("reports/loss_curve.png")
plt.close()

# Confusion Matrix (replace with real values)
y_true = [0, 1, 0, 1]
y_pred = [0, 1, 1, 1]

disp = ConfusionMatrixDisplay.from_predictions(y_true, y_pred)
plt.title("Confusion Matrix")
plt.savefig("reports/confusion_matrix.png")
plt.close()

print("Model graphs saved in reports/")
