const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const predictionRoutes = require("./routes/prediction");
const historyRoutes = require("./routes/history");
const profileRoutes = require("./routes/profile");
const weatherRoutes = require("./routes/weather");
const assistantRoutes = require("./routes/assistant");
const cityRoutes = require("./routes/city");

app.use("/api/auth", authRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/assistant", assistantRoutes);
app.use("/api/city", cityRoutes);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harishkota0308_db_user:Harish12@opticrop.eo1zooh.mongodb.net/?appName=Opticrop";
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
