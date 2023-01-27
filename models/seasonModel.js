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
    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
    discountedPrice: {
      type: Number,
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
