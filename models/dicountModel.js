const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    percentage: {
      type: Number,
    },
    code: {
      type: String,
    },
    active: {
      type: Boolean,
      default: false
    },
    usage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);
module.exports = Discount;
