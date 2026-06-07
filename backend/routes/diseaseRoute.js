import express from "express";
import multer from "multer";
import { detectDisease } from "../controllers/diseaseController.js";
import upload from "../middleware/multer.js";

const diseaseRouter = express.Router();

diseaseRouter.post("/detect", (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (!error) {
      detectDisease(req, res, next);
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        res.status(400).json({
          success: false,
          message: "Ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.",
        });
        return;
      }

      res.status(400).json({
        success: false,
        message: "Tải ảnh lên không thành công. Vui lòng thử lại.",
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: error.message || "Ảnh không hợp lệ.",
    });
  });
});

export default diseaseRouter;
