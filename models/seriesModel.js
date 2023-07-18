const mongoose = require("mongoose");

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
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
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    seasons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seasons",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Series", seriesSchema);
