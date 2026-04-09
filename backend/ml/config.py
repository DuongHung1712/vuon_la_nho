# ============================================================
# CONFIG — Central configuration for the robust pipeline
# ============================================================

import os

# === Model ===
IMG_SIZE = 299
NUM_CLASSES = 6

# === Disease Classes ===
DISEASE_NAMES = ['Blackrot', 'Downy Mildew', 'Esca', 'Healthy', 'LeafBlight', 'Leaf Roll']

# === Rule-based thresholds (for OpenCV pattern detection) ===
RULE_THRESHOLDS = {
    'black_rot': {
        'min_circularity': 0.55,
        'min_dark_border_ratio': 0.15,
        'min_spots': 1,
        'min_area_ratio': 0.005,
    },
    'downy_mildew': {
        'yellow_hue_range': (15, 40),
        'min_yellow_sat': 60,
        'min_yellow_ratio': 0.03,
    },
    'esca': {
        'min_stripe_ratio': 0.05,
        'min_interveinal_score': 0.10,
    },
    'leaf_blight': {
        'min_necrosis_ratio': 0.08,
        'min_irregularity': 0.3,
    },
}

RULE_FLAG_THRESHOLD = 0.5  # Confidence threshold below which rule check is applied
