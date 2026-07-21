const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { PythonShell } = require("python-shell");
const path = require("path");
const Prediction = require("../models/Prediction");

// @route   POST api/prediction/predict
// @desc    Predict crop
router.post("/predict", auth, async (req, res) => {
  const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

  if (
    N == null || P == null || K == null || 
    temperature == null || humidity == null || 
    ph == null || rainfall == null
  ) {
    return res.status(400).json({ msg: "Please enter all numeric values." });
  }

  const inputData = { N, P, K, temperature, humidity, ph, rainfall };
  const scriptPath = path.join(__dirname, "../services/python_predictor.py");

  let options = {
    mode: "text",
    pythonPath: process.env.NODE_ENV === 'production' ? 'python3' : 'python',
    pythonOptions: ["-u"], // get print results in real-time
    args: [JSON.stringify(inputData)]
  };

  PythonShell.run(scriptPath, options).then(async results => {
    try {
      const output = JSON.parse(results[0]);
      
      if (output.error) {
        return res.status(500).json({ msg: "Prediction error", details: output.error });
      }

      // Save prediction
      const predictionRecord = new Prediction({
        user_id: req.user.id,
        nitrogen: N,
        phosphorus: P,
        potassium: K,
        temperature,
        humidity,
        ph,
        rainfall,
        crop: output.crop,
        confidence: output.confidence
      });

      await predictionRecord.save();

      res.json({
        crop: output.crop,
        confidence: output.confidence,
        N, P, K, temperature, humidity, ph, rainfall
      });

    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error parsing prediction");
    }
  }).catch(err => {
    console.error(err);
    res.status(500).send("Server Error running prediction script");
  });
});

module.exports = router;
