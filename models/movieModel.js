const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    movie_id: {
      type: String,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    discountedPrice: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    trailer: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
    },
    donation: {
      type: Boolean,
    },
    donate: {
      type: Number,
    },
    free: {
      type: Boolean,
      default: false,
    },
    video: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Movies",
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    acquired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, //important
  }
);

module.exports = mongoose.model("Movies", movieSchema);
