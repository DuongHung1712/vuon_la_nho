import os
# Suppress TensorFlow warnings and info messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=info, 2=warning, 3=error
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import os
# Suppress TensorFlow warnings and info messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=info, 2=warning, 3=error
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

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

# Disease labels mapping - 5 classes theo thứ tự của model
DISEASE_LABELS = {
    0: "Blackrot",
    1: "Downey Mildew",
    2: "Esca",
    3: "Healthy",
    4: "LeafBlight"
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

    " Downey Mildew": """ SƯƠNG MAI (Downy Mildew — Plasmopara viticola)

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

 Black Rot rất khó kiểm soát khi đã bùng phát — phòng ngừa và vệ sinh vườn là then chốt tuyệt đối"""
}


def preprocess_image(image_path, target_size=(299, 299)):
    """Preprocess image for Xception model prediction"""
    try:
        img = Image.open(image_path)
        img = img.convert('RGB')
        img = img.resize(target_size)
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        # Apply Xception preprocessing
        img_array = preprocess_input(img_array)
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def predict_disease(image_path, model_path):
    """Predict disease from image"""
    try:
        # Validate model file
        if os.path.getsize(model_path) < 1024:  # Less than 1KB is suspicious
            raise Exception(f"Model file appears to be corrupted or incomplete (size: {os.path.getsize(model_path)} bytes)")
        
        # Load model with error handling - try multiple methods
        import tensorflow as tf
        model = None
        load_errors = []
        
        print(f"[DEBUG] Attempting to load model with TensorFlow {tf.__version__}", file=sys.stderr)
        
        # Method 1: Load with compile=False (fastest, works for most cases)
        try:
            model = keras.models.load_model(model_path, compile=False)
            print(f"[DEBUG] Model loaded successfully (compile=False)", file=sys.stderr)
        except Exception as e:
            load_errors.append(f"compile=False: {str(e)[:100]}")
        
        # Method 2: Try loading with safe_mode=False (TensorFlow 2.16+)
        if model is None:
            try:
                model = keras.models.load_model(model_path, safe_mode=False)
                print(f"[DEBUG] Model loaded successfully (safe_mode=False)", file=sys.stderr)
            except Exception as e:
                load_errors.append(f"safe_mode=False: {str(e)[:100]}")
        
        # Method 3: Standard load_model (last resort)
        if model is None:
            try:
                model = keras.models.load_model(model_path)
                print(f"[DEBUG] Model loaded successfully (standard)", file=sys.stderr)
            except Exception as e:
                load_errors.append(f"standard: {str(e)[:100]}")
        
        if model is None:
            tf_version = tf.__version__
            error_summary = " || ".join(load_errors)
            raise Exception(f"Model load failed with TensorFlow {tf_version}. Yêu cầu TensorFlow >= 2.16.1. Errors: {error_summary}")
        
        # Preprocess image
        img_array = preprocess_image(image_path)
        
        # Make prediction
        predictions = model.predict(img_array, verbose=0)
        predicted_class = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class] * 100)
        
        # Get disease name and treatment
        if confidence < 70:
            disease_name = "Không xác định được"
            treatment = "Độ tin cậy quá thấp. Vui lòng chụp ảnh rõ hơn hoặc tham khảo chuyên gia."
        else:
            disease_name = DISEASE_LABELS.get(predicted_class, "Không xác định")
            treatment = TREATMENTS.get(disease_name, "Vui lòng tham khảo chuyên gia.")
        
        result = {
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "treatment": treatment
        }
        
        return result
    
    except Exception as e:
        raise Exception(f"Error in prediction: {str(e)}")

if __name__ == "__main__":
    try:
        if len(sys.argv) < 3:
            raise Exception("Missing arguments: image_path and model_path required")
        
        image_path = sys.argv[1]
        model_path = sys.argv[2]
        
        # Validate inputs
        if not os.path.exists(image_path):
            raise Exception(f"Image file not found: {image_path}")
        
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
