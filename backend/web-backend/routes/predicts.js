// routes/predict.js
import express from 'express';
const router = express.Router();
import * as tf from '@tensorflow/tfjs';
import auth from '../middleware/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global model
let model = null;

(async () => {
  try {
    // Build absolute path to model.json
    const modelDir = path.join(__dirname, '..', 'tfjs_model');
    const modelJsonPath = path.join(modelDir, 'model.json');
    const modelUrl = `file:///${modelJsonPath.replace(/\\/g, '/')}`;

    console.log('Attempting to load model from:', modelUrl);

    model = await tf.loadLayersModel(modelUrl);

    console.log('ANN model loaded successfully!');
    console.log('Model summary:');
    model.summary();
  } catch (err) {
    console.error('Model load failed:', err.message);
    console.error('Full error:', err.stack);
  }
})();

// POST /api/predict/forecast
router.post('/forecast', auth, async (req, res) => {
  if (!model) {
    return res.status(503).json({ 
      message: 'Model is still loading or failed to load. Check server logs.' 
    });
  }

  let { production, season_encoded, period_encoded } = req.body;

  if (
    typeof production !== 'number' ||
    ![0, 1].includes(season_encoded) ||
    ![0, 1].includes(period_encoded)
  ) {
    return res.status(400).json({ 
      message: 'Invalid input: production (number), season_encoded (0/1), period_encoded (0/1)' 
    });
  }

  try {
    // Exact StandardScaler from notebook
    const mean = [37935.6565, 0.5, 0.17391304];
    const std = [9472.59833, 0.5, 0.379034691];

    // Scale inputs (production, season_encoded, period_encoded)
    const scaled = [
      (production - mean[0]) / std[0],
      (season_encoded - mean[1]) / std[1],
      (period_encoded - mean[2]) / std[2]
    ];

    console.log('Scaled input for prediction:', scaled);

    const input = tf.tensor2d([scaled], [1, 3]);
    const prediction = model.predict(input);
    const excess = prediction.dataSync()[0];

    tf.dispose([input, prediction]);

    res.json({
      success: true,
      predicted_excess: Number(excess.toFixed(2)),
      scaled_input_used: scaled,
      raw_input: { production, season_encoded, period_encoded },
      message: 'Prediction successful'
    });
  } catch (err) {
    console.error('Prediction error:', err);
    res.status(500).json({ message: 'Error during prediction' });
  }
});

export default router;