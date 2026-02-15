# Disease Detection ML Module

## Cài đặt

1. Cài đặt Python dependencies:
```bash
cd ml
pip install -r requirements.txt
```

2. Đặt file model `xception_best.keras` vào thư mục này

## Cấu hình

### Cập nhật Disease Labels

Mở file `predict.py` và cập nhật `DISEASE_LABELS` theo các class trong model của bạn:

```python
DISEASE_LABELS = {
    0: "Tên bệnh 1",
    1: "Tên bệnh 2",
    # ...
}
```

### Cập nhật Treatments

Cập nhật `TREATMENTS` với các khuyến nghị xử lý tương ứng:

```python
TREATMENTS = {
    "Tên bệnh 1": "Cách xử lý...",
    # ...
}
```

### Image Size

Nếu model của bạn sử dụng kích thước ảnh khác 224x224, cập nhật `target_size` trong hàm `preprocess_image`:

```python
img_array = preprocess_image(image_path, target_size=(299, 299))  # Ví dụ cho Xception
```

## Test API

```bash
curl -X POST http://localhost:4000/api/disease-detection/detect \
  -F "image=@path/to/leaf.jpg"
```

## Response Format

```json
{
  "success": true,
  "disease": "Đốm lá vi khuẩn",
  "confidence": 95.5,
  "treatment": "Loại bỏ lá bị nhiễm..."
}
```
