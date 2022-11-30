const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    episode_id: {
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
    duration: {
      type: Number,
      required: true,
    },
    publication_date: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    banner: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Episodes", episodeSchema);
