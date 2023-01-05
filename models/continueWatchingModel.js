const mongoose = require("mongoose");

const ContinueWatchingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movies",
  },
  episodeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Episodes",
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("ContinueWatching", ContinueWatchingSchema);
