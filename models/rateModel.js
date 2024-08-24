const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema(
  {
    currency: {
      type: String,
      enum: ["USD", "NGN", "CAD", "GBP", "EUR"],
      required: true,
      unique: true
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rate", rateSchema);