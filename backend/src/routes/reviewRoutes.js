const express = require("express");

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createReview,
  getCafeReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.post(
  "/:cafeId",
  protect,
  createReview
);

router.get(
  "/:cafeId",
  getCafeReviews
);

module.exports = router;