const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    movies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movies",
      },
    ],
    series: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Series",
      },
    ],
    view: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Section", sectionSchema);
