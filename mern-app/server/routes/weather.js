const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY || "6eb521ce7037c3e80b042cb5a5278b67"; // Kept default for simplicity as per Python code

// @route   GET api/weather
// @desc    Get weather for city
router.get("/", async (req, res) => {
  const cityQuery = req.query.city;
  if (!cityQuery) return res.status(400).json({ error: "City is required" });

  try {
    const city = cityQuery.split(",")[0].trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    res.json({
      city: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      weather: data.weather[0].description,
      wind_speed: data.wind.speed
    });
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        error: "Weather API failed",
        details: err.message,
        status_code: err.response.status
      });
    }
    return res.status(500).json({ error: "Weather API timeout or error. Try again." });
  }
});

module.exports = router;
