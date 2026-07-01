const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cafeRoutes = require("./routes/cafeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");

const cron = require("node-cron");
const axios = require("axios");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cafes", cafeRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites",favoriteRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin",adminRoutes);

app.get("/", (req, res) => {
  res.send("Cafe Finder API Running");
});

cron.schedule("*/14 * * * *", async () => {
  try {
    const res = await axios.get("https://cafe-finder-mkor.onrender.com/api/health");
    console.log("Health check:", res.data);
  } catch (err) {
    console.error("Health check failed:", err.message);
  }
});
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Cafe Finder backend is alive" });
});

module.exports = app;
