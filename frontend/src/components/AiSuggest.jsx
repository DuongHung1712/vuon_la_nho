import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { CloudUpload, X, Loader2, Sparkles, CheckCircle } from "lucide-react";

import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MIN_IMAGE_DIMENSION = 32;

const AiSuggest = () => {
  const { backendUrl } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
  };

  const getImageDimensions = (file) =>
    new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new window.Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        reject(new Error("invalid-image"));
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    });

  const validateImageFile = async (file) => {
    if (!file) {
      throw new Error("Vui lòng chọn ảnh trước khi phân tích.");
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      throw new Error("Chỉ hỗ trợ ảnh JPG, JPEG hoặc PNG.");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error("Định dạng ảnh không hợp lệ. Vui lòng chọn ảnh JPG hoặc PNG.");
    }

    if (file.size === 0) {
      throw new Error("Ảnh đang rỗng hoặc bị lỗi. Vui lòng chọn ảnh khác.");
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error("Ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.");
    }

    const { width, height } = await getImageDimensions(file);
    if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
      throw new Error(
        `Ảnh quá nhỏ. Kích thước tối thiểu là ${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}px.`,
      );
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      await validateImageFile(file);
      setResult(null);
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      resetForm();
      e.target.value = "";
      toast.error(error.message || "Ảnh không hợp lệ. Vui lòng chọn ảnh khác.");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch(`${backendUrl}/api/disease-detection/detect`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${res.status}`);
      }

      setResult(data);
      toast.success("Phân tích thành công!");
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error(error.message || "Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="ai-suggest" className="mx-auto max-w-4xl px-4 py-8">
      <div className="py-8 text-center text-3xl">
        <Title text1="AI" text2="nhận diện bệnh trên lá cây" />
        <p className="m-auto w-3/4 text-xs text-gray-600 sm:text-sm md:text-base">
          Tải lên ảnh lá cây để AI phân tích và chẩn đoán bệnh
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              Tải ảnh lá cây
            </label>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors hover:border-primary-400">
              {!previewUrl ? (
                <div>
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="inline-block cursor-pointer rounded-md bg-primary-400 px-4 py-2 text-white transition-colors hover:bg-primary-500"
                    >
                      Chọn ảnh
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, JPEG (tối đa 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="mx-auto max-h-80 rounded-lg"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {previewUrl && !result && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-400 py-3 font-medium text-white transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Phân tích bệnh
                </>
              )}
            </button>
          )}

          {result && (
            <div className="space-y-4 rounded-lg bg-white p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <CheckCircle className="h-6 w-6 text-primary-400" />
                Kết quả phân tích
              </h3>

              <div className="space-y-4 rounded-lg bg-white p-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Bệnh được phát hiện:
                  </span>
                  <p className="mt-1 text-lg font-bold text-red-600">
                    {result.disease || "Không xác định"}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Độ tin cậy:
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary-400 transition-all"
                        style={{ width: `${result.confidence || 0}%` }}
                      />
                    </div>
                    <span className="font-semibold text-primary-400">
                      {result.confidence || 0}%
                    </span>
                  </div>
                </div>

                {result.treatment && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Cách xử lý:
                    </span>
                    <p className="mt-1 whitespace-pre-line text-gray-700">
                      {result.treatment}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Vùng AI tập trung phân tích:
                  </span>
                  {result.focusMap ? (
                    <>
                      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <img
                          src={result.focusMap}
                          alt="AI focus map"
                          className="mx-auto max-h-96 rounded-lg"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Vùng màu nóng cho thấy khu vực model chú ý nhiều hơn khi đưa ra kết quả.
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      Chưa tạo được bản đồ vùng chú ý cho ảnh này.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={resetForm}
                className="w-full rounded-md bg-gray-600 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                Phân tích ảnh khác
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSuggest;
