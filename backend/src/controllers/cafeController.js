const Cafe = require("../models/cafe");

exports.createCafe = async (req, res) => {
  try {
    const cafe = await Cafe.create(req.body);

    res.status(201).json(cafe);
  } catch (error) {
    res.status(error.name === "ValidationError" ? 400 : 500).json({
      message: error.message,
    });
  }
};


exports.getAllCafes = async (req, res) => {
  try {
    const {
      search,
      city,
      amenity,
      minRating,
    } = req.query;

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (city) {
      query.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (amenity) {
      query.amenities = amenity;
    }

    if (minRating) {
      query.rating = {
        $gte: Number(minRating),
      };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const cafes = await Cafe.find(query)
      .skip(skip)
      .limit(limit);

    res.json(cafes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getCafeById = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);

    if (!cafe) {
      return res.status(404).json({
        message: "Cafe not found",
      });
    }

    res.json(cafe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.updateCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!cafe) {
      return res.status(404).json({
        message: "Cafe not found",
      });
    }

    res.json(cafe);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


exports.deleteCafe = async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndDelete(
      req.params.id
    );

    if (!cafe) {
      return res.status(404).json({
        message: "Cafe not found",
      });
    }

    res.json({
      message: "Cafe deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



exports.getNearbyCafes = async (req, res) => {
  try {
    const { lng, lat, radius } = req.query;

    const cafes = await Cafe.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              Number(lng),
              Number(lat),
            ],
          },
          $maxDistance:
            Number(radius) || 5000,
        },
      },
    });

    res.json(cafes);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

