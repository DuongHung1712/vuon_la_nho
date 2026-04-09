
# ============================================================

# RULE-BASED PATTERN DETECTION & DATASET FILTERING

# ============================================================

# Uses OpenCV to detect disease-specific visual patterns.

# Filters out ambiguous/noisy samples before training.

# ============================================================



import cv2

import numpy as np

import os

from typing import Dict, List, Tuple, Optional

from dataclasses import dataclass, field

from config import RULE_THRESHOLDS, IMG_SIZE





# ============================================================

# Data classes for detection results

# ============================================================



@dataclass

class PatternResult:

    """Result of a single pattern detection."""

    detected: bool

    confidence: float  # 0.0 to 1.0

    details: Dict = field(default_factory=dict)





@dataclass

class FilterDecision:

    """Decision for whether to keep or discard an image."""

    keep: bool

    reason: str

    dominant_pattern: Optional[str]

    pattern_scores: Dict[str, float] = field(default_factory=dict)

    conflicting_patterns: List[str] = field(default_factory=list)





# ============================================================

# 1. BLACK ROT: circular spots + dark border

# ============================================================



def detect_black_rot(img_bgr: np.ndarray) -> PatternResult:

    """

    Detect circular lesion spots with dark borders.

    Black rot lesions are tan/brown circular spots with concentric 

    dark rings (acervuli) and a clear dark margin.

    """

    cfg = RULE_THRESHOLDS['black_rot']

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    h, w = gray.shape[:2]

    total_area = h * w



    # --- Detect brown/tan lesion regions ---

    # Brown/tan in HSV: Hue 10-25, moderate saturation, low-mid value

    lower_brown = np.array([8, 40, 40])

    upper_brown = np.array([28, 255, 180])

    brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)



    # Also include very dark spots (necrotic center)

    lower_dark = np.array([0, 0, 0])

    upper_dark = np.array([180, 255, 60])

    dark_mask = cv2.inRange(hsv, lower_dark, upper_dark)



    # Combine brown + dark

    lesion_mask = cv2.bitwise_or(brown_mask, dark_mask)

    lesion_mask = cv2.morphologyEx(lesion_mask, cv2.MORPH_CLOSE,

                                   cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))

    lesion_mask = cv2.morphologyEx(lesion_mask, cv2.MORPH_OPEN,

                                   cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))



    # --- Find circular contours ---

    contours, _ = cv2.findContours(lesion_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)



    circular_spots = 0

    dark_border_score = 0.0

    max_circularity = 0.0



    for cnt in contours:

        area = cv2.contourArea(cnt)

        if area < cfg['min_area_ratio'] * total_area:

            continue



        perimeter = cv2.arcLength(cnt, True)

        if perimeter == 0:

            continue



        circularity = 4 * np.pi * area / (perimeter ** 2)

        max_circularity = max(max_circularity, circularity)



        if circularity >= cfg['min_circularity']:

            circular_spots += 1



            # Check for dark border around the spot

            # Create a ring mask around the contour

            mask_inner = np.zeros(gray.shape, dtype=np.uint8)

            cv2.drawContours(mask_inner, [cnt], -1, 255, -1)



            mask_dilated = cv2.dilate(mask_inner,

                                       cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15)))

            ring_mask = cv2.bitwise_and(mask_dilated,

                                         cv2.bitwise_not(mask_inner))



            if np.sum(ring_mask) > 0:

                ring_mean = np.mean(gray[ring_mask > 0])

                inner_mean = np.mean(gray[mask_inner > 0])

                # Dark border = ring is darker than surrounding leaf but lighter than center

                if ring_mean < 100:

                    dark_border_score += 1.0



    has_circular = circular_spots >= cfg['min_spots']

    has_dark_border = dark_border_score / max(circular_spots, 1) >= cfg['min_dark_border_ratio']



    confidence = 0.0

    if has_circular:

        confidence += 0.5

        if has_dark_border:

            confidence += 0.3

        confidence += min(0.2, circular_spots * 0.05)



    return PatternResult(

        detected=has_circular,

        confidence=min(confidence, 1.0),

        details={

            'circular_spots': circular_spots,

            'max_circularity': max_circularity,

            'dark_border_score': dark_border_score,

        }

    )





# ============================================================

# 2. DOWNY MILDEW: yellow oily patches

# ============================================================



def detect_downy_mildew(img_bgr: np.ndarray) -> PatternResult:

    """

    Detect yellow/oily angular patches.

    Downy mildew shows angular, oil-spot-like yellow lesions 

    bounded by leaf veins.

    """

    cfg = RULE_THRESHOLDS['downy_mildew']

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    h, w = hsv.shape[:2]

    total_pixels = h * w



    # --- Detect yellow/oily patches ---

    hue_lo, hue_hi = cfg['yellow_hue_range']

    min_sat = cfg['min_yellow_sat']



    lower_yellow = np.array([hue_lo, min_sat, 80])

    upper_yellow = np.array([hue_hi, 255, 255])

    yellow_mask = cv2.inRange(hsv, lower_yellow, upper_yellow)



    # Clean up

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

    yellow_mask = cv2.morphologyEx(yellow_mask, cv2.MORPH_CLOSE, kernel)

    yellow_mask = cv2.morphologyEx(yellow_mask, cv2.MORPH_OPEN, kernel)



    yellow_ratio = np.sum(yellow_mask > 0) / total_pixels



    # --- Check for angular/patchy shape (not round like Black rot) ---

    contours, _ = cv2.findContours(yellow_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    angular_patches = 0

    for cnt in contours:

        area = cv2.contourArea(cnt)

        if area < 0.002 * total_pixels:

            continue

        perimeter = cv2.arcLength(cnt, True)

        if perimeter == 0:

            continue

        circularity = 4 * np.pi * area / (perimeter ** 2)

        # Angular patches have LOW circularity (not perfectly round)

        if circularity < 0.6:

            angular_patches += 1



    detected = yellow_ratio >= cfg['min_yellow_ratio']

    confidence = 0.0

    if detected:

        confidence = min(0.5 + yellow_ratio * 5, 0.8)

        if angular_patches > 0:

            confidence = min(confidence + 0.2, 1.0)



    return PatternResult(

        detected=detected,

        confidence=confidence,

        details={

            'yellow_ratio': yellow_ratio,

            'angular_patches': angular_patches,

        }

    )





# ============================================================

# 3. ESCA: interveinal striped/tiger-stripe pattern

# ============================================================



def detect_esca(img_bgr: np.ndarray) -> PatternResult:

    """

    Detect interveinal chlorosis/necrosis (tiger-stripe pattern).

    Esca causes bands of discoloration between leaf veins, creating

    a characteristic striped look.

    """

    cfg = RULE_THRESHOLDS['esca']

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    h, w = gray.shape[:2]



    # --- Detect interveinal pattern via edge analysis ---

    # Veins create parallel-ish edges; between veins, colors alternate

    # Use Gabor filters at multiple orientations to detect stripe pattern

    stripe_scores = []

    for theta in np.linspace(0, np.pi, 8, endpoint=False):

        kern = cv2.getGaborKernel((21, 21), 4.0, theta, 10.0, 0.5, 0, ktype=cv2.CV_32F)

        filtered = cv2.filter2D(gray.astype(np.float32), cv2.CV_32F, kern)

        stripe_scores.append(np.std(filtered))



    # Striped pattern → high variance in specific orientations

    max_stripe = max(stripe_scores)

    min_stripe = min(stripe_scores)

    stripe_anisotropy = (max_stripe - min_stripe) / (max_stripe + 1e-8)



    # --- Detect brown/red discoloration between veins ---

    # Esca: brown/reddish bands alternating with green

    lower_brown = np.array([5, 50, 40])

    upper_brown = np.array([20, 255, 200])

    brown_mask = cv2.inRange(hsv, lower_brown, upper_brown)



    lower_green = np.array([30, 40, 40])

    upper_green = np.array([85, 255, 255])

    green_mask = cv2.inRange(hsv, lower_green, upper_green)



    brown_ratio = np.sum(brown_mask > 0) / (h * w)

    green_ratio = np.sum(green_mask > 0) / (h * w)



    # Interveinal = both brown and green present in alternating bands

    interveinal_score = min(brown_ratio, green_ratio) * 2

    has_stripe = stripe_anisotropy > cfg['min_stripe_ratio']

    has_interveinal = interveinal_score > cfg['min_interveinal_score']



    detected = has_stripe or has_interveinal

    confidence = 0.0

    if has_stripe:

        confidence += 0.4 * stripe_anisotropy

    if has_interveinal:

        confidence += 0.4 + min(interveinal_score * 2, 0.4)



    return PatternResult(

        detected=detected,

        confidence=min(confidence, 1.0),

        details={

            'stripe_anisotropy': stripe_anisotropy,

            'interveinal_score': interveinal_score,

            'brown_ratio': brown_ratio,

            'green_ratio': green_ratio,

        }

    )





# ============================================================

# 4. LEAF BLIGHT: large irregular necrotic areas

# ============================================================



def detect_leaf_blight(img_bgr: np.ndarray) -> PatternResult:

    """

    Detect large irregular necrotic (dead/brown) areas, typically 

    starting from leaf margins/edges.

    """

    cfg = RULE_THRESHOLDS['leaf_blight']

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    h, w = gray.shape[:2]

    total_area = h * w



    # --- Large brown/necrotic areas ---

    lower_necrosis = np.array([5, 30, 20])

    upper_necrosis = np.array([25, 255, 150])

    necrosis_mask = cv2.inRange(hsv, lower_necrosis, upper_necrosis)



    # Also include very dark (dried-out) tissue

    lower_dried = np.array([0, 0, 0])

    upper_dried = np.array([180, 80, 50])

    dried_mask = cv2.inRange(hsv, lower_dried, upper_dried)



    combined_mask = cv2.bitwise_or(necrosis_mask, dried_mask)

    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))

    combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_CLOSE, kernel)



    necrosis_ratio = np.sum(combined_mask > 0) / total_area



    # --- Check for IRREGULAR shapes (not circular like black rot) ---

    contours, _ = cv2.findContours(combined_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    max_irregularity = 0.0

    large_necrotic_area = 0



    for cnt in contours:

        area = cv2.contourArea(cnt)

        if area < 0.01 * total_area:  # Must be large

            continue

        perimeter = cv2.arcLength(cnt, True)

        if perimeter == 0:

            continue

        circularity = 4 * np.pi * area / (perimeter ** 2)

        irregularity = 1.0 - circularity

        max_irregularity = max(max_irregularity, irregularity)

        if area > 0.03 * total_area:

            large_necrotic_area += 1



    # --- Check if necrosis is near leaf edges ---

    edge_region = np.zeros(gray.shape, dtype=np.uint8)

    border_w = int(w * 0.15)

    border_h = int(h * 0.15)

    edge_region[:border_h, :] = 255

    edge_region[-border_h:, :] = 255

    edge_region[:, :border_w] = 255

    edge_region[:, -border_w:] = 255



    edge_necrosis = cv2.bitwise_and(combined_mask, edge_region)

    edge_ratio = np.sum(edge_necrosis > 0) / max(np.sum(combined_mask > 0), 1)



    detected = (necrosis_ratio >= cfg['min_necrosis_ratio'] and

                max_irregularity >= cfg['min_irregularity'])



    confidence = 0.0

    if detected:

        confidence = 0.3 + min(necrosis_ratio * 3, 0.3)

        if edge_ratio > 0.3:

            confidence += 0.2  # bonus for edge necrosis

        if large_necrotic_area > 0:

            confidence += 0.2



    return PatternResult(

        detected=detected,

        confidence=min(confidence, 1.0),

        details={

            'necrosis_ratio': necrosis_ratio,

            'max_irregularity': max_irregularity,

            'edge_ratio': edge_ratio,

            'large_areas': large_necrotic_area,

        }

    )





# ============================================================

# 5. HEALTHY leaf detection

# ============================================================



def detect_healthy(img_bgr: np.ndarray) -> PatternResult:

    """

    Detect healthy leaves: predominantly green, uniform color, 

    no significant lesions.

    """

    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)

    h, w = hsv.shape[:2]



    # Green pixel ratio

    lower_green = np.array([30, 30, 30])

    upper_green = np.array([90, 255, 255])

    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    green_ratio = np.sum(green_mask > 0) / (h * w)



    # Color uniformity (low std in Hue channel within green region)

    if np.sum(green_mask > 0) > 100:

        hue_values = hsv[:, :, 0][green_mask > 0]

        hue_std = np.std(hue_values)

    else:

        hue_std = 999



    # No disease = no brown/yellow spots

    detected = green_ratio > 0.4 and hue_std < 20

    confidence = 0.0

    if detected:

        confidence = min(green_ratio, 0.7) + max(0, 0.3 - hue_std * 0.01)



    return PatternResult(

        detected=detected,

        confidence=min(confidence, 1.0),

        details={

            'green_ratio': green_ratio,

            'hue_std': hue_std,

        }

    )





# ============================================================

# MASTER FILTER: Analyze and decide whether to keep/discard

# ============================================================



DETECTORS = {

    'Black rot': detect_black_rot,

    'Downy mildew': detect_downy_mildew,

    'Esca': detect_esca,

    'Leaf blight': detect_leaf_blight,

    'Healthy': detect_healthy,

}





def analyze_image(img_path: str, expected_class: Optional[str] = None) -> FilterDecision:

    """

    Run all pattern detectors on an image and decide whether to keep it.



    Rules for discarding:

    1. No dominant pattern detected (ambiguous sample)

    2. Multiple conflicting patterns at similar confidence (noisy)

    3. Expected class pattern not detected at all

    """

    img = cv2.imread(img_path)

    if img is None:

        return FilterDecision(

            keep=False, reason="Cannot read image",

            dominant_pattern=None

        )



    img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))



    # Run all detectors

    results = {}

    for name, detector in DETECTORS.items():

        try:

            results[name] = detector(img)

        except Exception as e:

            results[name] = PatternResult(detected=False, confidence=0.0,

                                          details={'error': str(e)})



    # Collect scores

    scores = {name: r.confidence for name, r in results.items() if r.detected}

    all_scores = {name: r.confidence for name, r in results.items()}



    # Determine dominant pattern

    if not scores:

        return FilterDecision(

            keep=False,

            reason="No dominant pattern detected",

            dominant_pattern=None,

            pattern_scores=all_scores

        )



    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    dominant = sorted_scores[0]



    # Check for conflicting patterns (multiple high-confidence detections)

    conflicting = []

    if len(sorted_scores) > 1:

        for name, score in sorted_scores[1:]:

            if name == 'Healthy':

                continue  # Healthy + disease is not really conflicting

            if score > dominant[1] * 0.7:  # Within 70% of dominant

                conflicting.append(name)



    # Decision logic

    if conflicting and expected_class:

        # If expected class is among detected patterns, still keep

        if expected_class == dominant[0]:

            return FilterDecision(

                keep=True,

                reason=f"Kept: dominant pattern matches expected class {expected_class}",

                dominant_pattern=dominant[0],

                pattern_scores=all_scores,

                conflicting_patterns=conflicting

            )

        else:

            return FilterDecision(

                keep=False,

                reason=f"Conflicting patterns: {conflicting}; dominant={dominant[0]} != expected={expected_class}",

                dominant_pattern=dominant[0],

                pattern_scores=all_scores,

                conflicting_patterns=conflicting

            )



    # If expected class pattern not detected at all

    if expected_class and expected_class in results:

        if not results[expected_class].detected:

            return FilterDecision(

                keep=False,

                reason=f"Expected pattern for '{expected_class}' not detected",

                dominant_pattern=dominant[0],

                pattern_scores=all_scores

            )



    return FilterDecision(

        keep=True,

        reason="Clear dominant pattern",

        dominant_pattern=dominant[0],

        pattern_scores=all_scores,

        conflicting_patterns=conflicting

    )





def filter_dataset(dataset_dir: str, log_path: Optional[str] = None) -> Tuple[List[str], List[str]]:

    """

    Filter entire dataset directory, returning (kept_paths, discarded_paths).

    Expects structure: dataset_dir/ClassName/images...



    Args:

        dataset_dir: root directory with class sub-folders

        log_path: optional path to write filtering log



    Returns:

        kept: list of (image_path, class_name)

        discarded: list of (image_path, class_name, reason)

    """

    kept = []

    discarded = []

    log_lines = []



    for class_name in sorted(os.listdir(dataset_dir)):

        class_dir = os.path.join(dataset_dir, class_name)

        if not os.path.isdir(class_dir):

            continue



        # Handle nested sub-folder structure

        subfolders = [os.path.join(class_dir, d) for d in os.listdir(class_dir)

                      if os.path.isdir(os.path.join(class_dir, d))]

        target_dir = subfolders[0] if subfolders else class_dir



        img_files = [f for f in os.listdir(target_dir)

                     if f.lower().endswith(('.jpg', '.jpeg', '.png'))]



        class_kept = 0

        class_disc = 0



        for f in img_files:

            img_path = os.path.join(target_dir, f)

            decision = analyze_image(img_path, expected_class=class_name)



            if decision.keep:

                kept.append((img_path, class_name))

                class_kept += 1

            else:

                discarded.append((img_path, class_name, decision.reason))

                class_disc += 1

                log_lines.append(

                    f"DISCARDED | {class_name} | {f} | {decision.reason} | "

                    f"scores={decision.pattern_scores}"

                )



        log_lines.append(

            f"CLASS SUMMARY | {class_name} | kept={class_kept} | discarded={class_disc}"

        )

        print(f"  {class_name}: kept={class_kept}, discarded={class_disc}")



    if log_path:

        with open(log_path, 'w') as lf:

            lf.write('\n'.join(log_lines))

        print(f"\n📝 Filter log saved to {log_path}")



    print(f"\n✅ Total: {len(kept)} kept, {len(discarded)} discarded")

    return kept, discarded

