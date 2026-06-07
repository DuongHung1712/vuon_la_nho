import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  CheckCircle,
  CloudUpload,
  Loader2,
  Sparkles,
  X,
} from "lucide-react";

import { diseaseApi } from "../services/api";
import Title from "./Title";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MIN_IMAGE_DIMENSION = 32;

const diseaseKeyMap = {
  Healthy: "healthy",
  "Downy Mildew": "downyMildew",
  Esca: "esca",
  LeafBlight: "leafBlight",
  Blackrot: "blackrot",
  "Leaf Roll": "leafRoll",
  "Không phải lá nho hợp lệ": "invalidLeaf",
  "Lỗi định dạng ảnh": "invalidImage",
  "Không xác định được": "unknown",
  "Lỗi xử lý": "processingError",
};

const treatmentKeyMap = {
  Healthy: "healthy",
  "Downy Mildew": "downyMildew",
  Esca: "esca",
  LeafBlight: "leafBlight",
  Blackrot: "blackrot",
  "Leaf Roll": "leafRoll",
  "Không phải lá nho hợp lệ": "invalidLeaf",
  "Lỗi định dạng ảnh": "invalidImage",
  "Không xác định được": "unknown",
  "Lỗi xử lý": "processingError",
};

const apiMessageKeyMap = {
  "No image uploaded": "missingImage",
  "Chỉ hỗ trợ ảnh JPG hoặc PNG.": "unsupportedType",
  "Ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.": "oversize",
  "Tải ảnh lên không thành công. Vui lòng thử lại.": "uploadFailed",
  "Ảnh không hợp lệ.": "invalidImage",
  "Request timeout - Image processing took too long": "timeout",
  "Python runtime not available. Please ensure Python is installed.":
    "runtimeUnavailable",
};

const AiSuggest = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const requestControllerRef = useRef(null);
  const previewObjectUrlRef = useRef(null);

  const clearPreviewObjectUrl = () => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
  };

  const resetForm = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    clearPreviewObjectUrl();
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      requestControllerRef.current?.abort();
      clearPreviewObjectUrl();
    };
  }, []);

  const translateApiMessage = (message) => {
    const messageKey = apiMessageKeyMap[message];
    if (!messageKey) {
      return message;
    }

    return t(`aiSuggest.messages.${messageKey}`);
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
        reject(new Error(t("aiSuggest.messages.invalidImage")));
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    });

  const validateImageFile = async (file) => {
    if (!file) {
      throw new Error(t("aiSuggest.messages.selectImage"));
    }

    const extension = `.${file.name.split(".").pop()?.toLowerCase() || ""}`;
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      throw new Error(t("aiSuggest.messages.unsupportedType"));
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(t("aiSuggest.messages.invalidFormat"));
    }

    if (file.size === 0) {
      throw new Error(t("aiSuggest.messages.emptyImage"));
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(t("aiSuggest.messages.oversize"));
    }

    const { width, height } = await getImageDimensions(file);
    if (width < MIN_IMAGE_DIMENSION || height < MIN_IMAGE_DIMENSION) {
      throw new Error(
        t("aiSuggest.messages.tooSmall", {
          size: `${MIN_IMAGE_DIMENSION}x${MIN_IMAGE_DIMENSION}`,
        }),
      );
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      await validateImageFile(file);
      requestControllerRef.current?.abort();
      clearPreviewObjectUrl();

      const objectUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = objectUrl;

      setResult(null);
      setSelectedImage(file);
      setPreviewUrl(objectUrl);
    } catch (error) {
      resetForm();
      toast.error(error.message || t("aiSuggest.messages.invalidImage"));
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage || loading) {
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);

    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const response = await diseaseApi.detect(formData, {
        signal: controller.signal,
      });
      const data = response.data;

      if (!data.success) {
        throw new Error(
          translateApiMessage(data.message) || t("aiSuggest.messages.analyzeFailed"),
        );
      }

      setResult(data);
      toast.success(t("aiSuggest.messages.success"));
    } catch (error) {
      if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
        return;
      }

      console.error("Error analyzing image:", error);
      const errorMessage = translateApiMessage(
        error.response?.data?.message || error.message,
      );
      toast.error(errorMessage || t("aiSuggest.messages.serverUnavailable"));
    } finally {
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
      setLoading(false);
    }
  };

  const resultDisplay = useMemo(() => {
    if (!result) {
      return null;
    }

    const diseaseKey = diseaseKeyMap[result.disease];
    const treatmentKey = treatmentKeyMap[result.disease];

    return {
      disease: diseaseKey
        ? t(`aiSuggest.diseases.${diseaseKey}`)
        : result.disease || t("aiSuggest.diseases.unknown"),
      treatment: treatmentKey
        ? t(`aiSuggest.treatments.${treatmentKey}`)
        : result.treatment,
    };
  }, [result, t]);

  return (
    <div id="ai-suggest" className="mx-auto max-w-4xl px-4 py-8 sm:py-10">
      <div className="py-6 text-center sm:py-8">
        <div className="text-2xl sm:text-3xl">
          <Title text1="AI" text2={t("aiSuggest.title")} />
        </div>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
          {t("aiSuggest.description")}
        </p>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-md sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-sm font-semibold text-gray-700">
              {t("aiSuggest.uploadLabel")}
            </label>
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-5 text-center transition-colors hover:border-primary-400 sm:p-6">
              {!previewUrl ? (
                <div>
                  <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload"
                      className="inline-block cursor-pointer rounded-md bg-primary-400 px-4 py-2 text-white transition-colors hover:bg-primary-500"
                    >
                      {t("aiSuggest.selectImage")}
                    </label>
                    <input
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      onChange={handleImageChange}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("aiSuggest.fileHint")}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt={t("aiSuggest.previewAlt")}
                    className="mx-auto max-h-80 w-full max-w-full rounded-lg object-contain"
                  />
                  <button
                    type="button"
                    onClick={resetForm}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                    aria-label={t("aiSuggest.reset")}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {previewUrl && !result && (
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-400 py-3 font-medium text-white transition-colors hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("aiSuggest.analyzing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  {t("aiSuggest.analyze")}
                </>
              )}
            </button>
          )}

          {result && resultDisplay && (
            <div className="space-y-4 rounded-lg bg-white p-2 sm:p-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 sm:text-xl">
                <CheckCircle className="h-6 w-6 text-primary-400" />
                {t("aiSuggest.resultTitle")}
              </h3>

              <div className="space-y-4 rounded-lg bg-white p-3 sm:p-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">
                    {t("aiSuggest.detectedDisease")}
                  </span>
                  <p className="mt-1 text-lg font-bold text-red-600">
                    {resultDisplay.disease}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    {t("aiSuggest.confidence")}
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

                {resultDisplay.treatment && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      {t("aiSuggest.treatmentLabel")}
                    </span>
                    <p className="mt-1 whitespace-pre-line text-gray-700">
                      {resultDisplay.treatment}
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-600">
                    {t("aiSuggest.focusMapLabel")}
                  </span>
                  {result.focusMap ? (
                    <>
                      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-3">
                        <img
                          src={result.focusMap}
                          alt={t("aiSuggest.focusMapAlt")}
                          className="mx-auto max-h-96 w-full rounded-lg object-contain"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {t("aiSuggest.focusMapHint")}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      {t("aiSuggest.focusMapUnavailable")}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-md bg-gray-600 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                {t("aiSuggest.reset")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiSuggest;
