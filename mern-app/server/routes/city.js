const express = require("express");
const router = express.Router();
const axios = require("axios");

// @route   GET api/city/city-suggest
// @desc    Suggest city for autocomplete
router.get("/city-suggest", async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.json([]);
  }

  const url = "https://nominatim.openstreetmap.org/search";

  const params = {
    q: query.trim(),
    format: "json",
    addressdetails: 1,
    limit: 10,
    countrycodes: "in"
  };

  try {
    const response = await axios.get(url, {
      params,
      headers: { "User-Agent": "OptiCropApp/1.0" }
    });
    const data = response.data;

    const results = data.map((item) => {
      const address = item.address || {};
      const village = address.village;
      const town = address.town;
      const city = address.city;
      const state = address.state || "";
      const country = address.country || "";

      const name = village || town || city || item.display_name;

      return {
        name: `${name}, ${state}, ${country}`,
        lat: item.lat,
        lon: item.lon
      };
    });

    res.json(results);
  } catch (err) {
    console.error("City API failed:", err.message);
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

module.exports = router;
