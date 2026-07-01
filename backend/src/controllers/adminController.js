const User = require("../models/User");
const Cafe = require("../models/cafe");
const Review = require("../models/Review");

exports.getStats = async (req, res) => {
  try {
    const totalUsers =
      await User.countDocuments();

    const totalCafes =
      await Cafe.countDocuments();

    const totalReviews =
      await Review.countDocuments();

    const topCafes = await Cafe.find()
      .sort({ rating: -1 })
      .limit(5);

    const mostReviewed = await Cafe.find()
      .sort({ numReviews: -1 })
      .limit(5);

    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalCafes,
      totalReviews,
      topCafes,
      mostReviewed,
      latestUsers,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};