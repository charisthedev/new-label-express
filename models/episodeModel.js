const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    publication_date: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    season_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seasons",
      required: true,
    },
    series_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Episodes", episodeSchema);
