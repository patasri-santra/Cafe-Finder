const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const cafeRoutes = require("./routes/cafeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");


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

module.exports = app;
