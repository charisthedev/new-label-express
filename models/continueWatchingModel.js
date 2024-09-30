const mongoose = require("mongoose");

const ContinueWatchingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  item_type: {
    type: String,
    required: true,
    enum: ["Episodes", "Movies", "Lesson"],
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "item_type",
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ContinueWatching", ContinueWatchingSchema);
