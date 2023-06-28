const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    year: {
      type: String,
    },
    trailer: {
      type: String,
    },
    number: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
    },
    banner: {
      type: String,
    },
    type: {
      type: String,
      default: "Seasons",
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episodes",
      },
    ],
    series_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
  },
  {
    timestamps: true, //important
  }
);

module.exports = mongoose.model("Seasons", seasonSchema);
