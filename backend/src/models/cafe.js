const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        images: [String],

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },

        image: {
            type: String,
            default: "",
        },

        rating: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        amenities: [String],

        openingHours: {
            type: String,
        }

    },
    {
        timestamps: true,
    }
);

cafeSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Cafe", cafeSchema);