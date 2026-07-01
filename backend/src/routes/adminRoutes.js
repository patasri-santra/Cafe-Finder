const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const admin = require(
  "../middleware/adminMiddleware"
);

const {
  getStats,
} = require("../controllers/adminController");

const router = express.Router();

router.get(
  "/stats",
  protect,
  admin,
  getStats
);

module.exports = router;