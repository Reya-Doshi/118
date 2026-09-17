"""
SARVAS Dual-Zone Random Forest Regressor Training Script
Reproducibly generates models/cupan_best_model.pkl from src/data/calibration_dataset.csv
"""

import os
import sys

# Ensure root directory is on sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from models.cupan_model import train_dualzone_model

def main():
    csv_path = os.path.join(PROJECT_ROOT, "src", "data", "calibration_dataset.csv")
    if not os.path.exists(csv_path):
        csv_path = os.path.join(PROJECT_ROOT, "calibration_dataset.csv")

    save_path = os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl")

    if not os.path.exists(csv_path):
        print(f"Error: Calibration dataset not found at {csv_path}")
        sys.exit(1)

    print(f"Training SARVAS Dual-Zone Random Forest Model...")
    print(f"Dataset: {csv_path}")
    print(f"Output:  {save_path}")

    train_dualzone_model(csv_path, save_path)
    print("Training complete! Model ready for production backend inference.")

if __name__ == "__main__":
    main()
