const User = require("../models/User");

exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const cafeId = req.params.cafeId;

    const alreadyExists =
      user.favorites.includes(cafeId);

    if (alreadyExists) {
      user.favorites =
        user.favorites.filter(
          id => id.toString() !== cafeId
        );

      await user.save();

      return res.json({
        message: "Removed from favorites",
      });
    }

    user.favorites.push(cafeId);

    await user.save();

    res.json({
      message: "Added to favorites",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id
    ).populate("favorites");

    res.json(user.favorites);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};