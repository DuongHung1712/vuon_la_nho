
# ============================================================

# RULE-BASED POST-PROCESSING & VALIDATION

# ============================================================

# After model predicts, apply domain-knowledge rules to:

#   1. Flag suspicious predictions

#   2. Adjust confidence scores

#   3. Log violations for manual review

# ============================================================



import cv2

import numpy as np

import json

import os

from datetime import datetime

from typing import Dict, List, Optional, Tuple

from dataclasses import dataclass, field, asdict

from config import RULE_FLAG_THRESHOLD, DISEASE_NAMES

from rule_based_filters import (

    detect_black_rot, detect_downy_mildew, detect_esca,

    detect_leaf_blight, detect_healthy

)





@dataclass

class PredictionResult:

    """Complete prediction result with rule-based validation."""

    image_path: str

    predicted_class: str

    confidence: float

    probabilities: Dict[str, float]

    rule_validated: bool

    rule_flags: List[str] = field(default_factory=list)

    adjusted_class: Optional[str] = None

    adjusted_confidence: Optional[float] = None

    pattern_details: Dict = field(default_factory=dict)





# ============================================================

# RULE VALIDATION MAP

# ============================================================



VALIDATION_RULES = {

    'Blackrot': {

        'detector': detect_black_rot,

        'required_patterns': ['circular_spots'],

        'description': 'Must have circular spots with dark borders',

    },

    'Downy Mildew': {

        'detector': detect_downy_mildew,

        'required_patterns': ['yellow_ratio'],

        'description': 'Must have yellow oily patches',

    },

    'Esca': {

        'detector': detect_esca,

        'required_patterns': ['stripe_anisotropy'],

        'description': 'Must have interveinal striped pattern',

    },

    'LeafBlight': {

        'detector': detect_leaf_blight,

        'required_patterns': ['necrosis_ratio'],

        'description': 'Must have large irregular necrotic areas',

    },

    'Healthy': {

        'detector': detect_healthy,

        'required_patterns': ['green_ratio'],

        'description': 'Must be predominantly green and uniform',

    },

}





# ============================================================

# CORE POST-PROCESSING FUNCTION

# ============================================================



def validate_prediction(img_path: str, predicted_class: str,

                        confidence: float, probabilities: Dict[str, float],

                        strict_mode: bool = False) -> PredictionResult:

    """

    Validate a model prediction against domain-knowledge rules.



    Args:

        img_path: path to the image

        predicted_class: model's predicted class name

        confidence: model's confidence for predicted class

        probabilities: dict of {class_name: probability}

        strict_mode: if True, adjust prediction when rule violated



    Returns:

        PredictionResult with flags and optional adjustments

    """

    img_array_data = np.fromfile(img_path, np.uint8)
    img = cv2.imdecode(img_array_data, cv2.IMREAD_COLOR)

    if img is None:

        return PredictionResult(

            image_path=img_path,

            predicted_class=predicted_class,

            confidence=confidence,

            probabilities=probabilities,

            rule_validated=False,

            rule_flags=["Cannot read image"]

        )



    img = cv2.resize(img, (299, 299))

    flags = []

    pattern_details = {}



    # Run the detector for the predicted class

    if predicted_class in VALIDATION_RULES:

        rule = VALIDATION_RULES[predicted_class]

        detector = rule['detector']

        result = detector(img)



        pattern_details[predicted_class] = result.details



        if not result.detected:

            flags.append(

                f"RULE VIOLATION: Predicted '{predicted_class}' but "

                f"expected pattern NOT detected. {rule['description']}"

            )

        elif result.confidence < 0.3:

            flags.append(

                f"WEAK PATTERN: '{predicted_class}' pattern detected but "

                f"with low confidence ({result.confidence:.2f})"

            )



    # Cross-check: does another class's pattern match better?

    alternative_scores = {}

    for cls_name, rule in VALIDATION_RULES.items():

        if cls_name == predicted_class:

            continue

        detector = rule['detector']

        result = detector(img)

        if result.detected and result.confidence > 0.5:

            alternative_scores[cls_name] = result.confidence

            pattern_details[cls_name] = result.details



    if alternative_scores:

        best_alt = max(alternative_scores, key=alternative_scores.get)

        if alternative_scores[best_alt] > confidence:

            flags.append(

                f"ALTERNATIVE: Rule-based analysis suggests '{best_alt}' "

                f"(rule_conf={alternative_scores[best_alt]:.2f}) over "

                f"'{predicted_class}' (model_conf={confidence:.2f})"

            )



    # Determine adjusted prediction

    adjusted_class = None

    adjusted_confidence = None



    if strict_mode and flags:

        # In strict mode, prefer rule-based alternative when model is unsure

        if alternative_scores and confidence < RULE_FLAG_THRESHOLD:

            best_alt = max(alternative_scores, key=alternative_scores.get)

            # Only override if the alternative also has high model probability

            if best_alt in probabilities and probabilities[best_alt] > 0.1:

                adjusted_class = best_alt

                adjusted_confidence = probabilities[best_alt]



    return PredictionResult(

        image_path=img_path,

        predicted_class=predicted_class,

        confidence=confidence,

        probabilities=probabilities,

        rule_validated=len(flags) == 0,

        rule_flags=flags,

        adjusted_class=adjusted_class,

        adjusted_confidence=adjusted_confidence,

        pattern_details=pattern_details,

    )





# ============================================================

# BATCH POST-PROCESSING

# ============================================================



def postprocess_batch(image_paths: List[str],

                      predictions: np.ndarray,

                      disease_names: List[str],

                      strict_mode: bool = False,

                      log_path: Optional[str] = None) -> List[PredictionResult]:

    """

    Post-process a batch of predictions.



    Args:

        image_paths: list of image file paths

        predictions: model output probabilities (N, num_classes)

        disease_names: list of class names

        strict_mode: whether to adjust predictions

        log_path: path to save violation log



    Returns:

        list of PredictionResult

    """

    results = []

    violations = []



    for i, (path, probs) in enumerate(zip(image_paths, predictions)):

        pred_idx = int(np.argmax(probs))

        pred_class = disease_names[pred_idx]

        confidence = float(probs[pred_idx])

        prob_dict = {disease_names[j]: float(probs[j]) for j in range(len(disease_names))}



        result = validate_prediction(

            img_path=path,

            predicted_class=pred_class,

            confidence=confidence,

            probabilities=prob_dict,

            strict_mode=strict_mode

        )

        results.append(result)



        if result.rule_flags:

            violations.append(result)



    # Summary

    total = len(results)

    validated = sum(1 for r in results if r.rule_validated)

    flagged = total - validated



    print(f"\n{'='*60}")

    print(f"  POST-PROCESSING SUMMARY")

    print(f"{'='*60}")

    print(f"  Total predictions: {total}")

    print(f"  Rule-validated:    {validated} ({validated/total:.1%})")

    print(f"  Flagged:           {flagged} ({flagged/total:.1%})")



    if strict_mode:

        adjusted = sum(1 for r in results if r.adjusted_class is not None)

        print(f"  Adjusted:          {adjusted}")



    # Log violations

    if log_path and violations:

        log_data = []

        for v in violations:

            log_entry = {

                'image': v.image_path,

                'predicted': v.predicted_class,

                'confidence': v.confidence,

                'flags': v.rule_flags,

                'adjusted_to': v.adjusted_class,

            }

            log_data.append(log_entry)



        with open(log_path, 'w') as f:

            json.dump(log_data, f, indent=2)

        print(f"\n📝 Violation log saved to {log_path}")



    return results





# ============================================================

# HYBRID PREDICTION (Model + Rules)

# ============================================================



def hybrid_predict(img_path: str, model, disease_names: List[str],

                   preprocess_fn, img_size: int = 299,

                   rule_weight: float = 0.2) -> PredictionResult:

    """

    Hybrid prediction combining model output with rule-based analysis.



    The final confidence is:

        final = (1 - rule_weight) * model_prob + rule_weight * rule_conf



    Args:

        img_path: path to image

        model: trained Keras model

        disease_names: list of class names

        preprocess_fn: preprocessing function

        img_size: input image size

        rule_weight: weight for rule-based confidence (0-1)



    Returns:

        PredictionResult with hybrid prediction

    """

    from tensorflow.keras.utils import load_img, img_to_array



    # Model prediction

    img = load_img(img_path, target_size=(img_size, img_size))

    x = img_to_array(img)

    x = np.expand_dims(x, axis=0).astype(np.float32)

    x = preprocess_fn(x)



    probs = model.predict(x, verbose=0)[0]



    # Rule-based analysis
    img_array_data = np.fromfile(img_path, np.uint8)
    img_cv = cv2.imdecode(img_array_data, cv2.IMREAD_COLOR)

    img_cv = cv2.resize(img_cv, (img_size, img_size))



    rule_scores = {}

    for cls_name, rule_info in VALIDATION_RULES.items():

        result = rule_info['detector'](img_cv)

        rule_scores[cls_name] = result.confidence if result.detected else 0.0



    # Hybrid scoring

    hybrid_probs = {}

    for i, name in enumerate(disease_names):

        model_prob = float(probs[i])

        rule_conf = rule_scores.get(name, 0.0)

        hybrid_probs[name] = (1 - rule_weight) * model_prob + rule_weight * rule_conf



    # Normalize

    total = sum(hybrid_probs.values())

    if total > 0:

        hybrid_probs = {k: v / total for k, v in hybrid_probs.items()}



    hybrid_pred = max(hybrid_probs, key=hybrid_probs.get)

    hybrid_conf = hybrid_probs[hybrid_pred]



    # Original model prediction

    pred_idx = int(np.argmax(probs))

    model_pred = disease_names[pred_idx]

    model_conf = float(probs[pred_idx])



    # Validate

    result = validate_prediction(

        img_path=img_path,

        predicted_class=hybrid_pred,

        confidence=hybrid_conf,

        probabilities=hybrid_probs

    )



    # Add model vs hybrid comparison

    if model_pred != hybrid_pred:

        result.rule_flags.append(

            f"HYBRID OVERRIDE: Model predicted '{model_pred}' ({model_conf:.2%}), "

            f"but hybrid scoring selected '{hybrid_pred}' ({hybrid_conf:.2%})"

        )



    return result





# ============================================================

# VIOLATION ANALYSIS & REPORTING

# ============================================================



def analyze_violations(results: List[PredictionResult],

                       save_dir: Optional[str] = None) -> Dict:

    """

    Analyze patterns in rule violations to identify systematic issues.



    Returns summary statistics.

    """

    violations = [r for r in results if not r.rule_validated]

    if not violations:

        print("✅ No violations found!")

        return {}



    # Group by predicted class

    by_class = {}

    for v in violations:

        cls = v.predicted_class

        if cls not in by_class:

            by_class[cls] = []

        by_class[cls].append(v)



    # Group by violation type

    by_type = {'RULE VIOLATION': [], 'WEAK PATTERN': [], 'ALTERNATIVE': []}

    for v in violations:

        for flag in v.rule_flags:

            for vtype in by_type:

                if flag.startswith(vtype):

                    by_type[vtype].append(v)

                    break



    summary = {

        'total_violations': len(violations),

        'by_class': {cls: len(lst) for cls, lst in by_class.items()},

        'by_type': {t: len(lst) for t, lst in by_type.items()},

        'avg_confidence_violated': np.mean([v.confidence for v in violations]),

        'avg_confidence_validated': np.mean(

            [r.confidence for r in results if r.rule_validated]

        ) if any(r.rule_validated for r in results) else 0.0,

    }



    print(f"\n📊 Violation Analysis:")

    print(f"   Total violations: {summary['total_violations']}")

    print(f"   By class: {summary['by_class']}")

    print(f"   By type: {summary['by_type']}")

    print(f"   Avg confidence (violated): {summary['avg_confidence_violated']:.3f}")

    print(f"   Avg confidence (validated): {summary['avg_confidence_validated']:.3f}")



    if save_dir:

        report_path = os.path.join(save_dir, 'violation_report.json')

        with open(report_path, 'w') as f:

            json.dump(summary, f, indent=2)

        print(f"\n📝 Report saved to {report_path}")



    return summary

