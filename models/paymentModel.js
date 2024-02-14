const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "item_type",
    },
    item_type: {
      type: String,
      required: true,
      enum: ["Series", "Movies"],
    },
    price: {
      type: Number,
    },
    payment_id: {
      type: String,
    },
    paymentType: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    expirationDate: {
      type: Date,
      default: undefined,
    },
    validViews: {
      type: Number,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", paymentSchema);
