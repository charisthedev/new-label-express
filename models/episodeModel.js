const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
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
    trailer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      ngn: {
        type: Number,
        default: 0,
      },
      usd: {
        type: Number,
        default: 0,
      },
      cad:{
        type:Number,
        default:0
      },
      eur:{
        type:Number,
        default:0
      },
      gbp:{
        type:Number,
        default:0
      }
    },
    free: {
      type: Boolean,
      default: false,
    },
    banner: {
      type: String,
      required: true,
    },
    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seasons",
      required: true,
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
    expirationSpan: {
      type: Number,
    },
    validViews: {
      type: Number,
    },
    acquired: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: "Episodes",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Episodes", episodeSchema);
