import os
import pickle
import numpy as np

# ---------------------------------------------------------
# Cu-PAN Decision Tree & Ensemble Model Classes
# ---------------------------------------------------------

class DecisionTreeNode:
    def __init__(self, feature=None, threshold=None, left=None, right=None, value=None):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.value = value

    @property
    def is_leaf(self):
        return self.value is not None


class DecisionTreeRegressor:
    def __init__(self, max_depth=8, min_samples_split=4, max_features=None):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features
        self.root = None

    def fit(self, X, y):
        self.n_features = X.shape[1]
        self.root = self._build_tree(X, y, depth=0)

    def _build_tree(self, X, y, depth):
        n_samples = X.shape[0]
        if depth >= self.max_depth or n_samples < self.min_samples_split or np.var(y) < 1e-6:
            return DecisionTreeNode(value=float(np.mean(y)))

        if self.max_features is not None and self.max_features < self.n_features:
            feat_indices = np.random.choice(self.n_features, self.max_features, replace=False)
        else:
            feat_indices = np.arange(self.n_features)

        best_feat, best_thresh, best_var_red = None, None, -1.0
        current_var = np.var(y) * n_samples

        for feat in feat_indices:
            vals = np.unique(X[:, feat])
            if len(vals) <= 1:
                continue
            thresholds = (vals[:-1] + vals[1:]) / 2.0
            if len(thresholds) > 25:
                thresholds = np.quantile(thresholds, np.linspace(0.05, 0.95, 25))

            for thresh in thresholds:
                left_mask = X[:, feat] <= thresh
                right_mask = ~left_mask
                if np.sum(left_mask) < 2 or np.sum(right_mask) < 2:
                    continue

                left_var = np.var(y[left_mask]) * np.sum(left_mask)
                right_var = np.var(y[right_mask]) * np.sum(right_mask)
                var_red = current_var - (left_var + right_var)

                if var_red > best_var_red:
                    best_var_red = var_red
                    best_feat = feat
                    best_thresh = thresh

        if best_feat is None or best_var_red <= 0.0:
            return DecisionTreeNode(value=float(np.mean(y)))

        left_mask = X[:, best_feat] <= best_thresh
        right_mask = ~left_mask

        left_child = self._build_tree(X[left_mask], y[left_mask], depth + 1)
        right_child = self._build_tree(X[right_mask], y[right_mask], depth + 1)

        return DecisionTreeNode(feature=best_feat, threshold=best_thresh, left=left_child, right=right_child)

    def predict(self, X):
        return np.array([self._predict_one(x, self.root) for x in X])

    def _predict_one(self, x, node):
        if node.is_leaf:
            return node.value
        if x[node.feature] <= node.threshold:
            return self._predict_one(x, node.left)
        return self._predict_one(x, node.right)


class RandomForestRegressorModel:
    def __init__(self, n_estimators=60, max_depth=9, min_samples_split=3, max_features=None, random_state=42):
        self.n_estimators = n_estimators
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.max_features = max_features
        self.trees = []

    def fit(self, X, y):
        self.trees = []
        n_samples = X.shape[0]
        feat_sub = self.max_features or max(1, int(X.shape[1] * 0.75))

        for _ in range(self.n_estimators):
            boot_idx = np.random.choice(n_samples, n_samples, replace=True)
            tree = DecisionTreeRegressor(
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                max_features=feat_sub
            )
            tree.fit(X[boot_idx], y[boot_idx])
            self.trees.append(tree)

    def predict(self, X):
        X = np.atleast_2d(X)
        tree_preds = np.array([tree.predict(X) for tree in self.trees])
        return np.mean(tree_preds, axis=0)

    def predict_with_uncertainty(self, X):
        """Returns mean prediction and standard deviation across ensemble trees."""
        X = np.atleast_2d(X)
        tree_preds = np.array([tree.predict(X) for tree in self.trees])
        mean_pred = np.mean(tree_preds, axis=0)
        std_pred = np.std(tree_preds, axis=0)
        return mean_pred, std_pred


# Custom unpickler to transparently resolve classes pickled under __main__ or other scripts
class _CuPanUnpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if name in ("RandomForestRegressorModel", "HighPrecisionRandomForest", "DecisionTreeRegressor", "DecisionTreeNode", "HighPrecisionTree"):
            return globals().get(name, RandomForestRegressorModel)
        return super().find_class(module, name)


HighPrecisionRandomForest = RandomForestRegressorModel
HighPrecisionTree = DecisionTreeRegressor


def load_cupan_model(model_path):
    """Load serialized model with robust class resolution. Auto-trains if missing."""
    if not os.path.exists(model_path):
        print(f"Model file not found at {model_path}. Auto-generating model from calibration dataset...")
        possible_csvs = [
            os.path.join(os.path.dirname(__file__), "..", "src", "data", "calibration_dataset.csv"),
            os.path.join(os.path.dirname(__file__), "..", "calibration_dataset.csv"),
            os.path.join(os.getcwd(), "src", "data", "calibration_dataset.csv")
        ]
        csv_path = None
        for p in possible_csvs:
            if os.path.exists(p):
                csv_path = os.path.abspath(p)
                break
        if csv_path:
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            return train_dualzone_model(csv_path, model_path)
        else:
            raise FileNotFoundError(f"Neither model file {model_path} nor calibration dataset CSV found.")

    with open(model_path, "rb") as f:
        try:
            return _CuPanUnpickler(f).load()
        except Exception as e:
            print(f"Warning: custom unpickler failed ({e}), falling back to standard pickle.")
            f.seek(0)
            return pickle.load(f)


def train_dualzone_model(csv_path, save_path):
    """Trains the True Dual-Zone (Ag + Cu) Random Forest Regressor on the validated dataset and saves it."""
    import pandas as pd
    df = pd.read_csv(csv_path)

    # Use both Zone A (Ag) and Zone B (Cu) features for genuine dual-zone regression
    feature_cols = [
        "agZone_L", "agZone_a", "agZone_b", "agZone_dE",   # Ag-zone colorimetric
        "cuZone_L", "cuZone_a", "cuZone_b", "cuZone_dE",   # Cu-zone colorimetric
        "temp_C", "rh_pct", "strip_age_days"                # Environmental
    ]
    # Only use columns that exist in the dataset (graceful for partial CSVs)
    available_cols = [c for c in feature_cols if c in df.columns]
    X = df[available_cols].values
    y = df["true_dose_ppmh"].values

    rf = RandomForestRegressorModel(n_estimators=80, max_depth=10, min_samples_split=2, random_state=42)
    rf.fit(X, y)
    with open(save_path, "wb") as f:
        pickle.dump(rf, f)
    print(f"Dual-Zone Random Forest model trained on {len(df)} samples using {len(available_cols)} features and saved to {save_path}")
    return rf

