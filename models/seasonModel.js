const mongoose = require("mongoose");

const seasonSchema = new mongoose.Schema(
  {
    season_id: {
      type: String,
      unique: true,
      trim: true,
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
    trailer: {
      type: String,
      required: true,
    },
    donation: {
      tye: Boolean,
    },
    free: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
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
  },
  {
    timestamps: true, //important
  }
);

module.exports = mongoose.model("Seasons", seasonSchema);
