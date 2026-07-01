const express = require("express");

const protect =
  require("../middleware/authMiddleware");

const {
  toggleFavorite,
  getFavorites,
} = require(
  "../controllers/favoriteController"
);

const router = express.Router();

router.post(
  "/:cafeId",
  protect,
  toggleFavorite
);

router.get(
  "/",
  protect,
  getFavorites
);

module.exports = router;