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
from tensorflow import keras
from tensorflow.keras.applications.xception import preprocess_input
from PIL import Image

# Disease labels mapping - 4 classes theo model của bạn
DISEASE_LABELS = {
    0: "Downey Mildew",
    1: "Esca",
    2: "Healthy",
    3: "LeafBlight"
}

# Treatment recommendations
TREATMENTS = {
    "Healthy": """CÂY KHỎE MẠNH - DUY TRÌ SỨC KHỎE TỐI ƯU

ĐÁNH GIÁ:
Cây sinh trưởng bình thường, không có dấu hiệu bệnh hại.

CHƯƠNG TRÌNH CHĂM SÓC DUY TRÌ:

• Tưới nước: Duy trì độ ẩm đất ổn định, tưới sáng sớm hoặc chiều mát. Tránh úng nước.

• Ánh sáng: Đảm bảo 6-8 giờ ánh sáng gián tiếp mỗi ngày, điều chỉnh theo nhu cầu từng loài.

• Dinh dưỡng: Bón phân cân đối NPK (10-10-10) mỗi 2-3 tuần trong mùa sinh trưởng.

• Kiểm tra định kỳ: Quan sát lá, thân, rễ hàng tuần để phát hiện sớm dấu hiệu bất thường.

DẤU HIỆU CẦN THEO DÕI:
Vàng lá, héo, đốm lạ, sâu bệnh. Xử lý ngay khi phát hiện.""",

    "Downey Mildew": """BỆNH SƯƠNG MAI (Downy Mildew - Plasmopara viticola)

TRIỆU CHỨNG:
Đốm vàng nhạt trên mặt lá, lớp bột trắng xám ở mặt dưới lá, lá héo và rụng sớm.

NGUYÊN NHÂN:
Nấm bắt buộc ký sinh, phát triển mạnh trong môi trường ẩm (độ ẩm >85%), nhiệt độ 18-25°C, tưới nước vào lá.

PHƯƠNG PHÁP ĐIỀU TRỊ:

1. Cơ học:
   • Loại bỏ và tiêu hủy tất cả lá bị nhiễm (đốt hoặc chôn sâu)
   • Cắt tỉa cành chồng chéo để tăng thông gió
   • Thu gom và xử lý lá rụng hàng ngày

2. Hóa học:
   • Phun thuốc bảo vệ: Mancozeb 80% WP (2g/lít), Metalaxyl-M 67.5% (1.5ml/lít)
   • Thuốc toàn thân: Fosetyl-aluminum 80% WP (2.5g/lít)
   • Phun cách 7-10 ngày, luân phiên hoạt chất để tránh kháng thuốc
   • Thời điểm: Sáng sớm hoặc chiều mát, tránh trời mưa

3. Sinh học:
   • Trichoderma harzianum: Ức chế nấm bệnh
   • Bacillus subtilis: Kích thích miễn dịch thực vật

PHÒNG NGỪA:

• Tưới nhỏ giọt, tránh làm ướt lá

• Khoảng cách trồng 30-50cm, tăng tuần hoàn không khí

• Tránh bón đạm thừa (lá mềm dễ nhiễm)

• Xử lý phòng ngừa bằng đồng oxychloride 0.3% trước mùa mưa

LƯU Ý:
Bệnh lây lan nhanh qua giọt nước. Cách ly cây bệnh ngay lập tức.""",

    "Esca": """BỆNH ESCA (Bệnh Nấm Gỗ - Phaeomoniella chlamydospora)

TRIỆU CHỨNG:
Đốm nâu đỏ giữa lá, viền vàng, mô chết lan rộng. Thân có vết nứt, gỗ bị mục từ trong ra. Cây héo đột ngột (apoplexia).

NGUYÊN NHÂN:
Phức hợp nấm xâm nhập qua vết thương (cắt tỉa, sâu đục thân), phát triển trong mô dẫn gây tắc nghẽn mạch dẫn. Stress nước, nhiệt độ cao (>30°C) làm bệnh bùng phát.

PHƯƠNG PHÁP ĐIỀU TRỊ:

1. Phẫu thuật cây:
   • Cắt bỏ toàn bộ phần gỗ bị nhiễm, sâu vào 5-10cm phần khỏe
   • Khử trùng dụng cụ bằng ethanol 70% sau mỗi lần cắt
   • Bôi sát khuẩn vết cắt: Bordeaux mixture (đồng sunfat + vôi sống)
   • Thực hiện vào trời khô ráo, tránh lây nhiễm

2. Hóa học:
   • Thuốc toàn thân: Propiconazole 25% EC (1ml/lít)
   • Thoa lên thân: Tebuconazole 430% SC + DMSO
   • Tưới đất: Triazole-based fungicides mỗi 2 tuần
   • Lưu ý: Hiệu quả hạn chế do nấm sâu trong mô gỗ

3. Miễn dịch thực vật:
   • Bón Trichoderma spp. vào gốc (10^6-10^7 bào tử/g)
   • Phun K2HPO4 0.5% kích thích kháng bệnh
   • Bón Silicon tăng cứng thành tế bào

PHÒNG NGỪA:

• Cắt tỉa đúng thời điểm (mùa khô), tránh vết thương lớn

• Bôi sáp bảo vệ ngay sau khi cắt tỉa

• Tránh stress nước: Tưới đều đặn, mulch gốc cây

• Không trồng ở đất úng, cải tạo thoát nước tốt

• Kiểm tra thường xuyên, phát hiện sớm giai đoạn đầu

LƯU Ý NGHIÊM TRỌNG:
Không thể chữa khỏi hoàn toàn. Cây nhiễm nặng nên loại bỏ để tránh lây lan. Đốt toàn bộ phần bị nhiễm, không dùng làm phân compost.""",

    "LeafBlight": """BỆNH CHÁY LÁ (Leaf Blight - Alternaria alternata / Cercospora spp.)

TRIỆU CHỨNG:
Đốm nâu tròn hoặc bất định, viền vàng rõ rệt, trung tâm có vòng đồng tâm. Lá chuyển vàng toàn bộ, khô cháy từ mép vào, rụng sớm. Ảnh hưởng nghiêm trọng đến quang hợp.

NGUYÊN NHÂN:
Nấm gây bệnh lá thuộc nhóm Alternaria, Cercospora. Lây lan qua gió, mưa, dụng cụ. Điều kiện thuận lợi: Nhiệt độ 25-30°C, độ ẩm cao, cây yếu thiếu dinh dưỡng (đặc biệt Kali, Canxi).

PHƯƠNG PHÁP ĐIỀU TRỊ:

1. Kiểm soát nguồn bệnh:
   • Loại bỏ và tiêu hủy hoàn toàn lá bệnh (không để rơi vãi)
   • Thu gom xác lá từ 2 tuần trước, giảm bào tử trong môi trường
   • Cách ly cây bệnh, tránh tiếp xúc với cây khỏe

2. Hóa học - Luân phiên hoạt chất:
   • Nhóm Chlorothalonil: 75% WP (2g/lít) - Bảo vệ rộng
   • Nhóm Copper: Copper oxychloride 85% WP (2.5g/lít) - Sát khuẩn
   • Nhóm Triazole: Difenoconazole 25% EC (0.5ml/lít) - Toàn thân
   • Nhóm Strobilurin: Azoxystrobin 25% SC (0.8ml/lít) - Điều trị sâu
   • Lịch phun: 5-7 ngày/lần, luân phiên 3 nhóm, ít nhất 4 đợt

3. Sinh học:
   • Bacillus amyloliquefaciens: Ức chế nấm, kích thích miễn dịch
   • Pseudomonas fluorescens: Cạnh tranh dinh dưỡng với nấm bệnh
   • Trichoderma viride: Phân hủy bào tử nấm trong đất

4. Phục hồi sức khỏe cây:
   • Bón phân lá NPK 20-20-20 + Vi lượng (Zn, Mn, B)
   • Tăng Kali: K2SO4 10g/cây/tháng - Tăng miễn dịch
   • Phun Canxi Clorid 0.5% - Tăng cứng thành tế bào

PHÒNG NGỪA:

• Tưới nhỏ giọt, tránh ướt lá. Tưới sáng sớm để lá khô nhanh

• Trồng không quá dày, khoảng cách tối thiểu 40cm

• Bón phân cân đối, tránh thừa Đạm (lá mềm dễ nhiễm)

• Xử lý phòng ngừa: Phun đồng Bordeaux 1% mỗi 2 tuần mùa mưa

• Vệ sinh công cụ bằng Javel 10% sau mỗi lần sử dụng

LƯU Ý:
Bệnh tái phát nếu không xử lý triệt để. Cần kết hợp nhiều biện pháp liên tục 4-6 tuần. Theo dõi sát sau điều trị."""
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
        # Load model
        model = keras.models.load_model(model_path)
        
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
