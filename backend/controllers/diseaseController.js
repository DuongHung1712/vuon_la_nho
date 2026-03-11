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

      // Log stderr warnings (non-critical)
      if (errorString && errorString.trim()) {
        console.log(
          "Python warnings:",
          errorString.substring(0, 200),
        );
      }

      // Try to parse stdout data first (even if exit code is non-zero)
      try {
        if (!dataString || !dataString.trim()) {
          throw new Error("No output from Python script");
        }

        const result = JSON.parse(dataString);

        // Check if result contains an error field
        if (result.error !== undefined) {
          const errorMsg = result.error || "Unknown error occurred during image processing";
          console.error("Python prediction error:", errorMsg);
          console.error("Exit code:", code);
          console.error("Full result object:", JSON.stringify(result));
          
          return res.status(500).json({
            success: false,
            message: errorMsg || "Error processing image",
            error: result.error,
            details: {
              exitCode: code,
              disease: result.disease,
              confidence: result.confidence
            }
          });
        }

        // Success case
        res.json({
          success: true,
          disease: result.disease,
          confidence: result.confidence,
          treatment: result.treatment,
        });
      } catch (parseError) {
        console.error("Parse Error:", parseError.message);
        console.error("Python exit code:", code);
        console.error("Stdout:", dataString.substring(0, 200));
        console.error("Stderr:", errorString.substring(0, 200));
        
        return res.status(500).json({
          success: false,
          message: "Error parsing prediction result",
          error: parseError.message,
          details: {
            stdout: dataString.substring(0, 100),
            stderr: errorString.substring(0, 100),
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { detectDisease };
