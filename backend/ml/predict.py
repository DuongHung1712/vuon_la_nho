import os
import base64
# Suppress TensorFlow warnings and info messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=info, 2=warning, 3=error
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import io
import sys
import json
import numpy as np

# Log versions for debugging
try:
    import tensorflow as tf
    print(f"[DEBUG] Python: {sys.version.split()[0]}, TensorFlow: {tf.__version__}", file=sys.stderr)
except Exception as e:
    print(f"[DEBUG] Version check failed: {e}", file=sys.stderr)

from tensorflow import keras
from tensorflow.keras.applications.xception import preprocess_input
from PIL import Image
import models

SUPPORTED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
SUPPORTED_IMAGE_FORMATS = {"JPEG", "PNG"}
MIN_IMAGE_DIMENSION = 32
MODEL_IMAGE_SIZE = (299, 299)

# Disease labels mapping - 6 classes theo thứ tự của model
DISEASE_LABELS = {
    0: "Blackrot",
    1: "Downy Mildew",
    2: "Esca",
    3: "Healthy",
    4: "LeafBlight",
    5: "Leaf Roll"
}

# Treatment recommendations
TREATMENTS = {
    "Healthy": """ CÂY NHO KHỎE MẠNH

Không phát hiện dấu hiệu bệnh. Duy trì chăm sóc tốt để phòng ngừa:

• Tưới gốc, tránh ướt lá; giữ độ ẩm đất 60–70%
• Tỉa tán thông thoáng, bỏ lá già/lá sát đất
• Bón NPK cân đối + bổ sung Ca, B (quan trọng cho nho)
• Phun đồng phòng ngừa (Bordeaux 0.5–1%) trước mùa mưa
• Kiểm tra lá và thân mỗi tuần — phát hiện sớm là yếu tố then chốt""",

    "Downy Mildew": """ SƯƠNG MAI (Downy Mildew — Plasmopara viticola)

NHẬN BIẾT: Đốm dầu màu vàng nhạt mặt trên lá; lớp nấm trắng xốp đặc trưng ở mặt dưới lá; lá rụng sớm, quả non thối.

NGUYÊN NHÂN: Oomycete Plasmopara viticola — lây qua nước mưa/sương; bùng phát mạnh khi ẩm độ >85%, nhiệt độ 18–25°C.

ĐIỀU TRỊ:
• Cắt bỏ và tiêu hủy lá bệnh ngay lập tức
• Thuốc nội hấp: Metalaxyl-M + Mancozeb (Ridomil Gold) — phun 2–3 lần, cách 7 ngày
• Nếu kháng Metalaxyl: đổi sang Cymoxanil 50% WP hoặc Dimethomorph 50% WP
• Thuốc bảo vệ bề mặt: Copper hydroxide (Kocide 46.1 WG) — phun sau mưa
• Luân phiên hoạt chất để tránh kháng thuốc

PHÒNG NGỪA:
• Tỉa tán thông thoáng (giảm thời gian lá ướt — yếu tố quyết định)
• Tưới nhỏ giọt; phun Bordeaux 0.5% định kỳ đầu mùa mưa
• Không bón thừa đạm

 Bệnh lây rất nhanh — xử lý ngay khi thấy đốm đầu tiên""",

    "Esca": """ BỆNH GỖ ESCA (Esca complex — Phaeomoniella chlamydospora, Phaeoacremonium spp., Fomitiporia mediterranea)

NHẬN BIẾT: Đốm hổ vàng-nâu giữa lá (tiger stripe), mô lá khô cháy. Gỗ thân cắt ngang có vết nâu/đen. Cây có thể héo đột ngột toàn bộ (apoplexy).

NGUYÊN NHÂN: Phức hợp nấm gỗ xâm nhập qua vết cắt tỉa — sống lâu năm trong mô dẫn truyền, không có thuốc chữa triệt để.

ĐIỀU TRỊ:
• Cắt bỏ phần gỗ bệnh đến tận mô trắng sạch; khử dụng cụ bằng ethanol 70% sau mỗi nhát cắt
• Bôi ngay vết cắt: hồ Bordeaux đặc hoặc thuốc bịt vết thương chuyên dụng
• Tiêm thân (trunk injection): Propiconazole — áp dụng giai đoạn bệnh còn khu trú
• Tưới gốc Trichoderma spp. (≥10⁶ CFU/g) + Bacillus subtilis — hỗ trợ sinh học
• Cây nhiễm nặng: nhổ bỏ, đốt tại chỗ, không làm compost

PHÒNG NGỪA (quan trọng hơn điều trị):
• Cắt tỉa đúng mùa khô; bôi vết cắt ngay lập tức
• Khử trùng kéo/cưa giữa các cây
• Tránh stress nước (tưới đều, phủ mulch gốc)

 Không thể chữa hoàn toàn — phòng bệnh từ khâu cắt tỉa là then chốt""",

    "LeafBlight": """
    CHÁY LÁ (Leaf Blight — Alternaria alternata / Cercospora vitis)

NHẬN BIẾT: Đốm nâu viền vàng rõ, có vòng đồng tâm (Alternaria) hoặc đốm góc cạnh nhỏ (Cercospora). Lá khô cháy từ mép vào, rụng hàng loạt.

NGUYÊN NHÂN: Nấm bào tử phân tán qua gió và nước mưa; bùng phát khi nhiệt độ 25–30°C, ẩm độ cao, cây thiếu kali/canxi.

ĐIỀU TRỊ:
• Thu gom và tiêu hủy toàn bộ lá bệnh (nguồn bào tử chính)
• Luân phiên 3 nhóm thuốc (phun 5–7 ngày/lần, ≥3 đợt liên tiếp):
  - Nhóm Triazole: Difenoconazole 25% EC (0.5 ml/L) hoặc Tebuconazole
  - Nhóm Strobilurin: Azoxystrobin 25% SC (0.8 ml/L)
  - Nhóm Copper: Copper oxychloride 85% WP (2.5 g/L)
• Bổ sung K₂SO₄ + CaCl₂ 0.3% qua lá — tăng sức đề kháng tế bào

PHÒNG NGỪA:
• Tưới gốc, không phun lên lá; tưới sáng để lá khô nhanh
• Bón cân đối đạm-kali; tránh thừa đạm
• Vệ sinh dụng cụ bằng cồn 70% hoặc Javel 1%

 Bệnh tái phát nếu không xử lý dứt điểm — cần liên tục 3–4 tuần""",

    "Blackrot": """ THỐI ĐEN (Black Rot — Guignardia bidwellii)

NHẬN BIẾT: Đốm nâu viền đen trên lá, có chấm đen nhỏ (pycnidia) ở tâm. Quả non nhiễm chuyển nâu rồi đen hoàn toàn, khô thành "xác ướp" bám trên cành — đây là nguồn bệnh nguy hiểm nhất.

NGUYÊN NHÂN: Nấm Guignardia bidwellii — bào tử tồn tại qua đông trong xác quả/lá; lây qua mưa; dễ bùng phát giai đoạn quả non sau mưa (nhiệt độ 20–28°C).

ĐIỀU TRỊ:
• Vệ sinh nguồn bệnh TRƯỚC TIÊN: thu gom và đốt toàn bộ xác quả ướp, lá bệnh, tàn dư vụ cũ
• Giai đoạn trước/sau hoa (quan trọng nhất):
  - Myclobutanil 10% WP (0.5 g/L) hoặc Tebuconazole 25% EC (1 ml/L)
  - Mancozeb 80% WP (2 g/L) — bảo vệ khi thời tiết mưa nhiều
• Phun định kỳ 7–10 ngày/lần từ khi ra hoa đến quả non; luân phiên hoạt chất
• Captan 50% WP thay thế khi quả đã lớn

PHÒNG NGỪA:
• Dọn sạch vườn cuối vụ — loại bỏ xác ướp quả là bước số 1
• Tỉa tán thông thoáng; không để ẩm đọng trong tán
• Phun Bordeaux 1% phòng ngừa trước mùa mưa

 Black Rot rất khó kiểm soát khi đã bùng phát — phòng ngừa và vệ sinh vườn là then chốt tuyệt đối""",

    "Leaf Roll": """ XOĂN LÁ (Leaf Roll)

NHẬN BIẾT: Lá cuộn mép xuống (hoặc cong bất thường), phiến lá dày/cứng hơn, màu lá nhạt dần hoặc loang vàng-đỏ tùy giống; sinh trưởng chậm.

NGUYÊN NHÂN THƯỜNG GẶP: stress nước, mất cân đối dinh dưỡng (đặc biệt K, Mg), tổn thương rễ, hoặc nhiễm virus liên quan nhóm grapevine leafroll.

HƯỚNG XỬ LÝ:
• Điều chỉnh tưới ổn định, tránh khô hạn rồi tưới dồn đột ngột
• Kiểm tra và bổ sung dinh dưỡng cân đối (ưu tiên K, Mg, Ca-B theo kết quả đất/lá)
• Tỉa cành thông thoáng, giảm tải quả nếu cây suy
• Theo dõi côn trùng chích hút (rệp sáp, bọ phấn), quản lý sớm để hạn chế nguy cơ lây truyền virus
• Nếu biểu hiện kéo dài nhiều vụ: lấy mẫu xét nghiệm virus để xác định nguyên nhân chính xác

Lưu ý: Cần theo dõi liên tục 2-4 tuần sau khi điều chỉnh chăm sóc để đánh giá đáp ứng của cây."""
}


def preprocess_image(image_path, target_size=(299, 299)):
    """Preprocess image for Xception model prediction"""
    try:
        from tensorflow.keras.utils import load_img, img_to_array
        
        # Consistent with Keras dataset logic
        img = load_img(image_path, target_size=target_size)
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0).astype(np.float32)
        
        # Apply Xception preprocessing
        img_array = preprocess_input(img_array)
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def validate_image_input(image_path):
    """Validate the uploaded image before passing it to the model."""
    if not os.path.exists(image_path):
        raise Exception(f"Image file not found: {image_path}")

    if not os.path.isfile(image_path):
        raise Exception("Input image path is not a file")

    file_extension = os.path.splitext(image_path)[1].lower()
    if file_extension not in SUPPORTED_IMAGE_EXTENSIONS:
        allowed_extensions = ", ".join(sorted(SUPPORTED_IMAGE_EXTENSIONS))
        raise Exception(
            f"Invalid image extension '{file_extension or '[none]'}'. Allowed formats: {allowed_extensions}"
        )

    if os.path.getsize(image_path) == 0:
        raise Exception("Image file is empty")

    try:
        with Image.open(image_path) as img:
            img.verify()
    except Exception as e:
        raise Exception(f"Invalid image file. The file cannot be decoded as an image: {str(e)}")

    try:
        with Image.open(image_path) as img:
            image_format = (img.format or "").upper()
            if image_format not in SUPPORTED_IMAGE_FORMATS:
                allowed_formats = ", ".join(sorted(SUPPORTED_IMAGE_FORMATS))
                raise Exception(
                    f"Unsupported image format '{image_format or 'UNKNOWN'}'. Allowed formats: {allowed_formats}"
                )

            width, height = img.size
            if width < MIN_IMAGE_DIMENSION or height < MIN_IMAGE_DIMENSION:
                raise Exception(
                    f"Image is too small ({width}x{height}). Minimum size is "
                    f"{MIN_IMAGE_DIMENSION}x{MIN_IMAGE_DIMENSION}"
                )

            if width == 0 or height == 0:
                raise Exception("Image has invalid dimensions")

            # Xception preprocessing expects a standard 3-channel RGB image.
            if img.mode not in {"RGB", "RGBA", "L"}:
                raise Exception(
                    f"Unsupported image mode '{img.mode}'. Expected RGB-compatible image"
                )
    except Exception as e:
        if str(e).startswith("Unsupported") or "Image is too small" in str(e) or "invalid dimensions" in str(e):
            raise
        raise Exception(f"Image validation failed: {str(e)}")

def reject_non_leaf_image(img_cv):
    """Reject obvious non-leaf images before sending them to the classifier."""
    import cv2

    resized = cv2.resize(img_cv, MODEL_IMAGE_SIZE)
    hsv = cv2.cvtColor(resized, cv2.COLOR_BGR2HSV)

    green_mask = cv2.inRange(hsv, np.array([25, 25, 25]), np.array([95, 255, 255]))
    yellow_brown_mask = cv2.inRange(hsv, np.array([8, 35, 30]), np.array([35, 255, 255]))
    foliage_mask = cv2.bitwise_or(green_mask, yellow_brown_mask)

    kernel = np.ones((5, 5), np.uint8)
    foliage_mask = cv2.morphologyEx(foliage_mask, cv2.MORPH_OPEN, kernel)
    foliage_mask = cv2.morphologyEx(foliage_mask, cv2.MORPH_CLOSE, kernel)

    total_pixels = float(MODEL_IMAGE_SIZE[0] * MODEL_IMAGE_SIZE[1])
    foliage_ratio = float(np.sum(foliage_mask > 0) / total_pixels)
    green_ratio = float(np.sum(green_mask > 0) / total_pixels)

    skin_mask = cv2.inRange(hsv, np.array([0, 20, 60]), np.array([25, 200, 255]))
    skin_ratio = float(np.sum(skin_mask > 0) / total_pixels)

    contours, _ = cv2.findContours(foliage_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    largest_component_ratio = 0.0
    if contours:
        largest_component_ratio = max(cv2.contourArea(contour) for contour in contours) / total_pixels

    center_crop = foliage_mask[75:224, 75:224]
    center_foliage_ratio = float(np.sum(center_crop > 0) / float(center_crop.size))

    print(
        "[DEBUG] leaf-check "
        f"foliage={foliage_ratio:.3f} green={green_ratio:.3f} "
        f"skin={skin_ratio:.3f} largest={largest_component_ratio:.3f} "
        f"center={center_foliage_ratio:.3f}",
        file=sys.stderr,
    )

    invalid_leaf_image = (
        foliage_ratio < 0.12 or
        largest_component_ratio < 0.05 or
        (foliage_ratio < 0.22 and center_foliage_ratio < 0.12) or
        (foliage_ratio < 0.28 and skin_ratio > 0.18 and green_ratio < 0.08)
    )

    if invalid_leaf_image:
        return {
            "disease": "Không phải lá nho hợp lệ",
            "confidence": 0.0,
            "treatment": (
                "Hệ thống nhận diện đây không phải là ảnh lá nho hợp lệ. Vui lòng chụp lại ảnh với các lưu ý sau:\n"
                "1. Chụp ảnh lá nho rõ ràng, cận cảnh.\n"
                "2. Đảm bảo lá nho chiếm phần lớn khung hình.\n"
                "3. Tránh chụp ảnh người hoặc vật cản."
            ),
        }

    return None

def get_last_conv_layer(model):
    """Find the deepest convolution-like layer for Grad-CAM."""
    for layer in reversed(model.layers):
        if isinstance(layer, keras.Model):
            nested_layer = get_last_conv_layer(layer)
            if nested_layer is not None:
                return nested_layer

        tensor_shape = getattr(getattr(layer, "output", None), "shape", None)
        if tensor_shape is not None and len(tensor_shape) == 4:
            return layer

    return None

def generate_focus_map(model, img_array, img_cv, pred_idx):
    """Generate a Grad-CAM overlay as a base64 data URL."""
    import cv2
    import tensorflow as tf

    base_model = model.get_layer("xception") if "xception" in [layer.name for layer in model.layers] else model
    last_conv_layer = get_last_conv_layer(base_model)
    if last_conv_layer is None:
        raise Exception("Could not find a convolutional layer for Grad-CAM")

    base_output_tensor = base_model.output[0] if isinstance(base_model.output, list) else base_model.output
    feature_extractor = keras.models.Model(
        inputs=base_model.inputs,
        outputs=[last_conv_layer.output, base_output_tensor],
    )

    gap_layer = model.get_layer("gap")
    head_bn_layer = model.get_layer("head_bn")
    head_dropout_layer = model.get_layer("head_dropout")
    prediction_layer = model.get_layer("predictions")

    input_tensor = tf.convert_to_tensor(img_array)

    with tf.GradientTape() as tape:
        conv_outputs, base_outputs = feature_extractor(input_tensor, training=False)
        x = gap_layer(base_outputs, training=False)
        x = head_bn_layer(x, training=False)
        x = head_dropout_layer(x, training=False)
        predictions = prediction_layer(x, training=False)
        class_channel = predictions[:, pred_idx]

    grads = tape.gradient(class_channel, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    conv_outputs = conv_outputs[0]

    heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
    heatmap = tf.maximum(heatmap, 0)

    max_value = tf.reduce_max(heatmap)
    if float(max_value.numpy()) == 0.0:
        heatmap = tf.math.abs(tf.reduce_sum(conv_outputs * pooled_grads, axis=-1))
        max_value = tf.reduce_max(heatmap)
        if float(max_value.numpy()) == 0.0:
            return None

    heatmap = heatmap / max_value
    heatmap = heatmap.numpy()

    original_height, original_width = img_cv.shape[:2]
    heatmap = cv2.resize(heatmap, (original_width, original_height))
    heatmap_uint8 = np.uint8(255 * heatmap)
    colored_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(img_cv, 0.55, colored_heatmap, 0.45, 0)
    overlay_rgb = cv2.cvtColor(overlay, cv2.COLOR_BGR2RGB)

    image_buffer = io.BytesIO()
    Image.fromarray(overlay_rgb).save(image_buffer, format="PNG")
    encoded_image = base64.b64encode(image_buffer.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{encoded_image}"

def predict_disease(image_path, model_path):
    """Predict disease from image using model only."""
    try:
        validate_image_input(image_path)

        # Validate model file
        if os.path.getsize(model_path) < 1024:  # Less than 1KB is suspicious
            raise Exception(f"Model file appears to be corrupted or incomplete (size: {os.path.getsize(model_path)} bytes)")
        
        # Load model with error handling - try multiple methods
        import tensorflow as tf
        model = None
        load_errors = []
        
        print(f"Attempting to load model with TensorFlow {tf.__version__}", file=sys.stderr)
        
        # Set up custom objects
        custom_objs = {'CBAM': models.CBAM}

        # Method 1: Load with compile=False (fastest, works for most cases)
        try:
            model = keras.models.load_model(model_path, custom_objects=custom_objs, compile=False)
            print(f"Model loaded successfully (compile=False)", file=sys.stderr)
        except Exception as e:
            load_errors.append(f"compile=False: {str(e)[:100]}")
        
        # Method 2: Try loading with safe_mode=False (TensorFlow 2.16+)
        if model is None:
            try:
                model = keras.models.load_model(model_path, custom_objects=custom_objs, safe_mode=False)
                print(f"Model loaded successfully (safe_mode=False)", file=sys.stderr)
            except Exception as e:
                load_errors.append(f"safe_mode=False: {str(e)[:100]}")
        
        # Method 3: Standard load_model (last resort)
        if model is None:
            try:
                model = keras.models.load_model(model_path, custom_objects=custom_objs)
                print(f"[DEBUG] Model loaded successfully (standard)", file=sys.stderr)
            except Exception as e:
                load_errors.append(f"standard: {str(e)[:100]}")
        
        if model is None:
            tf_version = tf.__version__
            error_summary = " || ".join(load_errors)
            raise Exception(f"Model load failed with TensorFlow {tf_version}. Yêu cầu TensorFlow >= 2.16.1. Errors: {error_summary}")
        
        # Preprocess image
        img_array = preprocess_image(image_path)
        
        # OOD CHECK: Is this a grape leaf?
        import cv2
        
        # Sửa lỗi cv2.imread không đọc được đường dẫn tiếng Việt trên Windows
        img_array_data = np.fromfile(image_path, np.uint8)
        img_cv = cv2.imdecode(img_array_data, cv2.IMREAD_COLOR)
        
        if img_cv is None:
            return {
                "disease": "Lỗi định dạng ảnh",
                "confidence": 0.0,
                "treatment": "Hệ thống không thể mở được ảnh này. Vui lòng thử lại bằng một ảnh chuẩn (JPG, PNG).",
            }
        invalid_leaf_result = reject_non_leaf_image(img_cv)
        if invalid_leaf_result is not None:
            return invalid_leaf_result

        # Model prediction (pure model, no rule-based hybrid)
        probs = model.predict(img_array, verbose=0)[0]
        pred_idx = int(np.argmax(probs))
        confidence = float(probs[pred_idx]) * 100
        predicted_class_name = DISEASE_LABELS[pred_idx]
        try:
            focus_map = generate_focus_map(model, img_array, img_cv, pred_idx)
        except Exception as focus_map_error:
            print(f"[DEBUG] Focus map generation failed: {focus_map_error}", file=sys.stderr)
            focus_map = None
        
        # Confidence threshold check
        if confidence < 30:
            disease_name = "Không xác định được"
            treatment = "Độ tin cậy quá thấp (dưới 30%). Vui lòng chụp ảnh rõ lề lá, đủ sáng hoặc tham khảo chuyên gia."
            confidence = 0.0
        else:
            disease_name = predicted_class_name
            treatment = TREATMENTS.get(disease_name, "Vui lòng tham khảo chuyên gia.")
            
        # Output result
        result = {
            "disease": str(disease_name),
            "confidence": round(float(confidence), 2),
            "treatment": str(treatment),
            "focusMap": focus_map,
        }
        
        return result
    
    except Exception as e:
        raise Exception(f"{str(e)}")

if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            raise Exception("Missing arguments: image_path and model_path required")
        
        image_path = sys.argv[1]
        model_path = sys.argv[2]
        
        # Validate inputs
        validate_image_input(image_path)
        
        if not os.path.exists(model_path):
            raise Exception(f"Model file not found: {model_path}")
        
        result = predict_disease(image_path, model_path)
        print(json.dumps(result))
        
    except Exception as e:
        error_message = str(e) if str(e) else "Unknown error occurred in Python script"
        error_result = {
            "error": error_message,
            "disease": "Lỗi xử lý",
            "confidence": 0,
            "treatment": "Vui lòng thử lại với ảnh khác."
        }
        print(json.dumps(error_result))
        sys.exit(1)
