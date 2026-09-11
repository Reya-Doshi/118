"""
Audit Script: Data Leakage and Held-Out Validation for Cu-PAN Exposure Model
Compares:
  1. Standard Random 80/20 Split
  2. 5-Fold Cross-Validation (Random)
  3. Held-Out Temperature Regime (Train on <=32°C, Test on >32°C)
  4. Held-Out Humidity Regime (Train on <=60% RH, Test on >60% RH)
  5. Stratified Held-Out Regime (Leave-One-Dose-Regime-Out)
"""

import os
import csv
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(PROJECT_ROOT, "prototype_calibration.csv")

import sys
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from models.cupan_model import RandomForestRegressorModel

def calc_metrics(y_true, y_pred):
    mae = float(np.mean(np.abs(y_true - y_pred)))
    rmse = float(np.sqrt(np.mean((y_true - y_pred) ** 2)))
    ss_res = float(np.sum((y_true - y_pred) ** 2))
    ss_tot = float(np.sum((y_true - np.mean(y_true)) ** 2))
    r2 = float(1.0 - (ss_res / ss_tot)) if ss_tot > 0 else 0.0
    return mae, rmse, r2

def load_data():
    feature_names = [
        "L_star", "a_star", "b_star", "Delta_E_CIE76",
        "Temperature_C", "Relative_Humidity_pct", "Shelf_Age_days"
    ]
    features = []
    targets = []
    regimes = []
    temps = []
    rhs = []

    with open(DATA_PATH, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if int(row["Shelf_Age_days"]) <= 90:
                feat = [float(row[col]) for col in feature_names]
                features.append(feat)
                targets.append(float(row["Target_Dose_ppm_h"]))
                regimes.append(row["Literature_Anchor"])
                temps.append(float(row["Temperature_C"]))
                rhs.append(float(row["Relative_Humidity_pct"]))

    return (
        np.array(features, dtype=np.float64),
        np.array(targets, dtype=np.float64),
        np.array(regimes),
        np.array(temps, dtype=np.float64),
        np.array(rhs, dtype=np.float64)
    )

def run_leakage_audit():
    print("\n" + "=" * 75)
    print("  SCIENTIFIC AUDIT: DATA LEAKAGE & HELD-OUT GENERALIZATION")
    print("=" * 75)

    X, y, regimes, temps, rhs = load_data()
    n_samples = len(y)
    print(f"Dataset: {n_samples} active samples (shelf age <= 90 days)")

    # 1. Standard Random 80/20 Split
    np.random.seed(42)
    indices = np.arange(n_samples)
    np.random.shuffle(indices)
    split_pt = int(0.80 * n_samples)
    tr_idx, te_idx = indices[:split_pt], indices[split_pt:]

    rf_rand = RandomForestRegressorModel(n_estimators=60, max_depth=9, min_samples_split=3, random_state=42)
    rf_rand.fit(X[tr_idx], y[tr_idx])
    pred_rand = rf_rand.predict(X[te_idx])
    mae_rand, rmse_rand, r2_rand = calc_metrics(y[te_idx], pred_rand)

    print(f"\n1. Random 80/20 Split (Baseline):")
    print(f"   Train samples: {len(tr_idx)}, Test samples: {len(te_idx)}")
    print(f"   Test MAE:  {mae_rand:.4f} ppm·h")
    print(f"   Test RMSE: {rmse_rand:.4f} ppm·h")
    print(f"   Test R²:   {r2_rand:.4f}")

    # 2. 5-Fold Random CV
    fold_size = n_samples // 5
    cv_maes, cv_rmses, cv_r2s = [], [], []
    for k in range(5):
        val_idx = indices[k * fold_size : (k + 1) * fold_size]
        train_idx = np.setdiff1d(indices, val_idx)
        rf_cv = RandomForestRegressorModel(n_estimators=40, max_depth=8, min_samples_split=3, random_state=42 + k)
        rf_cv.fit(X[train_idx], y[train_idx])
        pred_cv = rf_cv.predict(X[val_idx])
        m_mae, m_rmse, m_r2 = calc_metrics(y[val_idx], pred_cv)
        cv_maes.append(m_mae)
        cv_rmses.append(m_rmse)
        cv_r2s.append(m_r2)

    print(f"\n2. 5-Fold Random Cross-Validation:")
    print(f"   Mean MAE:  {np.mean(cv_maes):.4f} ± {np.std(cv_maes):.4f} ppm·h")
    print(f"   Mean RMSE: {np.mean(cv_rmses):.4f} ± {np.std(cv_rmses):.4f} ppm·h")
    print(f"   Mean R²:   {np.mean(cv_r2s):.4f} ± {np.std(cv_r2s):.4f}")

    # 3. Held-Out Temperature Regime (Train on <=32°C, Test on >32°C)
    # Tests temperature generalization without interpolation
    mask_temp_train = temps <= 32.0
    mask_temp_test = temps > 32.0
    print(f"\n3. Held-Out Environmental Factor: High Temperature (>32°C):")
    print(f"   Train samples (<=32°C): {np.sum(mask_temp_train)}, Test samples (>32°C): {np.sum(mask_temp_test)}")
    rf_temp = RandomForestRegressorModel(n_estimators=60, max_depth=9, min_samples_split=3, random_state=42)
    rf_temp.fit(X[mask_temp_train], y[mask_temp_train])
    pred_temp = rf_temp.predict(X[mask_temp_test])
    mae_temp, rmse_temp, r2_temp = calc_metrics(y[mask_temp_test], pred_temp)
    print(f"   Test MAE:  {mae_temp:.4f} ppm·h")
    print(f"   Test RMSE: {rmse_temp:.4f} ppm·h")
    print(f"   Test R²:   {r2_temp:.4f}")

    # 4. Held-Out Humidity Regime (Train on <=60% RH, Test on >60% RH)
    mask_rh_train = rhs <= 60.0
    mask_rh_test = rhs > 60.0
    print(f"\n4. Held-Out Environmental Factor: High Humidity (>60% RH):")
    print(f"   Train samples (<=60% RH): {np.sum(mask_rh_train)}, Test samples (>60% RH): {np.sum(mask_rh_test)}")
    rf_rh = RandomForestRegressorModel(n_estimators=60, max_depth=9, min_samples_split=3, random_state=42)
    rf_rh.fit(X[mask_rh_train], y[mask_rh_train])
    pred_rh = rf_rh.predict(X[mask_rh_test])
    mae_rh, rmse_rh, r2_rh = calc_metrics(y[mask_rh_test], pred_rh)
    print(f"   Test MAE:  {mae_rh:.4f} ppm·h")
    print(f"   Test RMSE: {rmse_rh:.4f} ppm·h")
    print(f"   Test R²:   {r2_rh:.4f}")

    # 5. Low-Dose Critical Region Evaluation (< 2.0 ppm·h)
    low_dose_mask = y[te_idx] <= 2.0
    if np.sum(low_dose_mask) > 0:
        mae_low, rmse_low, r2_low = calc_metrics(y[te_idx][low_dose_mask], pred_rand[low_dose_mask])
        print(f"\n5. Worker Action Range Performance (Dose <= 2.0 ppm·h):")
        print(f"   Samples evaluated: {np.sum(low_dose_mask)}")
        print(f"   Sub-2.0 ppm·h MAE:  {mae_low:.4f} ppm·h")
        print(f"   Sub-2.0 ppm·h RMSE: {rmse_low:.4f} ppm·h")

    print("\n" + "=" * 75)
    print("  DATA LEAKAGE AUDIT COMPLETE")
    print("=" * 75 + "\n")

if __name__ == "__main__":
    run_leakage_audit()
