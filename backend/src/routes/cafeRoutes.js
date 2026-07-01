const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  createCafe,
  getAllCafes,
  getCafeById,
  updateCafe,
  deleteCafe,
  getNearbyCafes
} = require("../controllers/cafeController");

const router = express.Router();

router.post("/", createCafe);

router.get("/", getAllCafes);

router.get("/nearby", getNearbyCafes);

router.get("/:id", getCafeById);

router.put("/:id", updateCafe);

router.delete("/:id", deleteCafe);

router.post(
  "/",
  protect,
  admin,
  createCafe
);

router.put(
  "/:id",
  protect,
  admin,
  updateCafe
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCafe
);

module.exports = router;