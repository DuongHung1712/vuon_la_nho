import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolvePythonRuntime = () => {
  const projectRoot = path.resolve(__dirname, "../..");
  const pythonFromEnv = process.env.PYTHON_PATH;

  const pythonCandidates = process.platform === "win32"
    ? [
        pythonFromEnv,
        path.join(projectRoot, ".venv", "Scripts", "python.exe"),
        path.join(projectRoot, "backend", ".venv", "Scripts", "python.exe"),
      ]
    : [
        pythonFromEnv,
        path.join(projectRoot, ".venv", "bin", "python"),
        path.join(projectRoot, "backend", ".venv", "bin", "python"),
      ];

  const resolvedPath = pythonCandidates.find(
    (candidate) => candidate && fs.existsSync(candidate),
  );

  if (resolvedPath) {
    return { command: resolvedPath, args: [] };
  }

  if (process.platform === "win32") {
    return { command: "py", args: ["-3"] };
  }

  return { command: "python3", args: [] };
};

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
    const modelPath = path.join(__dirname, "../ml/xception_cbam_best.keras");

    // Check if model exists
    if (!fs.existsSync(modelPath)) {
      return res.status(500).json({
        success: false,
        message: "Model file not found",
      });
    }

    // Call Python script to make prediction
    const pythonRuntime = resolvePythonRuntime();
    const python = spawn(pythonRuntime.command, [
      ...pythonRuntime.args,
      pythonScriptPath,
      imagePath,
      modelPath,
    ]);

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
      if (res.headersSent) return;
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

      if (res.headersSent) return;

      // Log stderr warnings (non-critical)
      if (errorString && errorString.trim()) {
        console.log("Python warnings:", errorString.substring(0, 200));
      }

      // Try to parse stdout data first (even if exit code is non-zero)
      try {
        if (!dataString || !dataString.trim()) {
          throw new Error("No output from Python script");
        }

        const result = JSON.parse(dataString);

        // Check if result contains an error field
        if (result.error !== undefined) {
          const errorMsg =
            result.error || "Unknown error occurred during image processing";
          const isMissingCv2 = /No module named ['\"]cv2['\"]/.test(errorMsg);
          console.error("Python prediction error:", errorMsg);
          console.error("Exit code:", code);
          console.error("Full result object:", JSON.stringify(result));

          return res.status(500).json({
            success: false,
            message: isMissingCv2
              ? "Missing Python dependency: cv2. Install backend/ml/requirements.txt in the Python runtime used by backend."
              : errorMsg || "Error processing image",
            error: result.error,
            details: {
              exitCode: code,
              pythonCommand: pythonRuntime.command,
              disease: result.disease,
              confidence: result.confidence,
            },
          });
        }

        // Success case
        res.json({
          success: true,
          disease: result.disease,
          confidence: result.confidence,
          treatment: result.treatment,
          focusMap: result.focusMap ?? null,
        });
      } catch (parseError) {
        console.error("Parse Error:", parseError.message);
        console.error("Python exit code:", code);
        console.error("Stdout:", dataString.substring(0, 200));
        console.error("Stderr:", errorString.substring(0, 200));

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message: "Error parsing prediction result",
            error: parseError.message,
            details: {
              stdout: dataString.substring(0, 100),
              stderr: errorString.substring(0, 100),
            },
          });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { detectDisease };
