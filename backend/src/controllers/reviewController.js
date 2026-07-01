const Review = require("../models/Review");
const Cafe = require("../models/cafe");

exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const cafe = await Cafe.findById(
      req.params.cafeId
    );

    if (!cafe) {
      return res.status(404).json({
        message: "Cafe not found",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      cafe: cafe._id,
      rating,
      comment,
    });

    const reviews = await Review.find({
      cafe: cafe._id,
    });

    cafe.numReviews = reviews.length;

    cafe.rating =
      reviews.reduce(
        (acc, item) => acc + item.rating,
        0
      ) / reviews.length;

    await cafe.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getCafeReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      cafe: req.params.cafeId,
    })
      .populate("user", "name")
      .sort("-createdAt");

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};