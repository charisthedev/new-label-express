const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    free: {
      type: Boolean,
    },
    description: {
      type: String,
    },
    year: {
      type: String,
    },
    donation: {
      type: Boolean,
    },
    donate: {
      type: Number,
    },
    trailer: {
      type: String,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    discount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
      },
    ],
    casts: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "Series",
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    seasons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seasons",
      },
    ],
    expirationSpan: {
      type: Number,
    },
    validViews: {
      type: Number,
    },
    acquired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Series", seriesSchema);
