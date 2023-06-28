const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    movies: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movies",
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Banner", bannerSchema);
