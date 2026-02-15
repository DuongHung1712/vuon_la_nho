import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disease detection using Python model
const detectDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const imagePath = req.file.path;
        const pythonScriptPath = path.join(__dirname, '../ml/predict.py');
        const modelPath = path.join(__dirname, '../ml/xception_best.keras');

        // Check if model exists
        if (!fs.existsSync(modelPath)) {
            return res.status(500).json({ 
                success: false, 
                message: "Model file not found" 
            });
        }

        // Call Python script to make prediction
        const python = spawn('python', [pythonScriptPath, imagePath, modelPath]);

        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            // Clean up uploaded file
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }

            if (code !== 0) {
                console.error('Python Error:', errorString);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error processing image",
                    error: errorString 
                });
            }

            try {
                const result = JSON.parse(dataString);
                res.json({ 
                    success: true, 
                    disease: result.disease,
                    confidence: result.confidence,
                    treatment: result.treatment
                });
            } catch (error) {
                console.error('Parse Error:', error);
                res.status(500).json({ 
                    success: false, 
                    message: "Error parsing prediction result" 
                });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { detectDisease };
