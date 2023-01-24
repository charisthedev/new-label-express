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
    status: {
      type: String,
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
