const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");

// @route   GET api/history
// @desc    Get user prediction history
router.get("/", auth, async (req, res) => {
  try {
    const history = await Prediction.find({ user_id: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
