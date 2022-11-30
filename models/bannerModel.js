const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  movies: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movies'
  }],
  seasons: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Seasons'
      }
  ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Banner", bannerSchema);
