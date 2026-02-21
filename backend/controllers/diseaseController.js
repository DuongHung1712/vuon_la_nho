import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disease detection using Python model
const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const pythonScriptPath = path.join(__dirname, "../ml/predict.py");
    const modelPath = path.join(__dirname, "../ml/xception_best.keras");

    // Check if model exists
    if (!fs.existsSync(modelPath)) {
      return res.status(500).json({
        success: false,
        message: "Model file not found",
      });
    }

    // Call Python script to make prediction
    const pythonCmd = process.platform === "win32" ? "python" : "python3";
    const python = spawn(pythonCmd, [pythonScriptPath, imagePath, modelPath]);

    let dataString = "";
    let errorString = "";

    const timeout = setTimeout(() => {
      python.kill();
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      return res.status(504).json({
        success: false,
        message: "Request timeout - Image processing took too long",
      });
    }, 60000);

    python.stdout.on("data", (data) => {
      dataString += data.toString();
    });

    python.stderr.on("data", (data) => {
      errorString += data.toString();
    });

    python.on("error", (error) => {
      clearTimeout(timeout);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      console.error("Python spawn error:", error);
      return res.status(500).json({
        success: false,
        message:
          "Python runtime not available. Please ensure Python is installed.",
        error: error.message,
      });
    });

    python.on("close", (code) => {
      clearTimeout(timeout);

      // Clean up uploaded file
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Only treat as error if exit code is non-zero
      if (code !== 0) {
        console.error("Python Error (exit code " + code + "):", errorString);
        return res.status(500).json({
          success: false,
          message: "Error processing image",
          error: errorString,
        });
      }

      if (errorString && errorString.trim()) {
        console.log(
          "Python warnings (non-critical):",
          errorString.substring(0, 200),
        );
      }

      try {
        const result = JSON.parse(dataString);
        res.json({
          success: true,
          disease: result.disease,
          confidence: result.confidence,
          treatment: result.treatment,
        });
      } catch (error) {
        console.error("Parse Error:", error);
        res.status(500).json({
          success: false,
          message: "Error parsing prediction result",
          data: dataString,
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { detectDisease };
