import fs from "fs";
import path from "path";
import multer from "multer";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.resolve(__dirname, "../uploads/disease-detection");
fs.mkdirSync(uploadDirectory, { recursive: true });

const allowedMimeTypes = new Set(["image/jpeg", "image/png"]);
const mimeTypeToExtension = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const originalExtension = path.extname(file.originalname || "").toLowerCase();
    const extension =
      originalExtension && [".jpg", ".jpeg", ".png"].includes(originalExtension)
        ? originalExtension
        : mimeTypeToExtension[file.mimetype] || ".jpg";

    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    callback(new Error("Chỉ hỗ trợ ảnh JPG hoặc PNG."));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
  },
});

export default upload;
