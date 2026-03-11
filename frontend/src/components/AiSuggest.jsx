import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import { CloudUpload, X, Loader2, Sparkles, CheckCircle } from "lucide-react";
import Title from "./Title";
const AiSuggest = () => {
  const { backendUrl } = useContext(ShopContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch(backendUrl + "/api/disease-detection/detect", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setResult(data);
        toast.success("Phân tích thành công!");
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi phân tích");
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Không thể kết nối đến server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <div id="aisuggest" className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center py-8 text-3xl">
        <Title text1={"AI"} text2={"nhận diện bệnh trên lá cây"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Tải lên ảnh lá cây để AI phân tích và chẩn đoán bệnh
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Tải ảnh lá cây
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
              {!previewUrl ? (
                <div>
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-primary-400 text-white px-4 py-2 rounded-md hover:bg-primary-500 transition-colors inline-block"
                    >
                      Chọn ảnh
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, JPEG (tối đa 10MB)
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-80 mx-auto rounded-lg"
                  />
                  <button
                    onClick={resetForm}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analyze Button */}
          {previewUrl && !result && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-primary-400 text-white py-3 rounded-md font-medium hover:bg-primary-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
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

          {/* Result Section */}
          {result && (
            <div className="bg-white rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-primary-400" />
                Kết quả phân tích
              </h3>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Bệnh được phát hiện:
                  </span>
                  <p className="text-lg font-bold text-red-600 mt-1">
                    {result.disease || "Không xác định"}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    Độ tin cậy:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-400 h-2 rounded-full transition-all"
                        style={{ width: `${result.confidence || 0}%` }}
                      ></div>
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
                    <p className="text-gray-700 mt-1 whitespace-pre-line">
                      {result.treatment}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={resetForm}
                className="w-full bg-gray-600 text-white py-2 rounded-md font-medium hover:bg-gray-700 transition-colors"
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
