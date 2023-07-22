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
    trailer: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    free: {
      type: Boolean,
      default: false,
    },
    expirationSpan: {
      type: Number,
    },
    validViews: {
      type: Number,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episodes",
      },
    ],
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
    acquired: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, //important
  }
);

module.exports = mongoose.model("Seasons", seasonSchema);
