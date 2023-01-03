const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("activities", activitySchema);
