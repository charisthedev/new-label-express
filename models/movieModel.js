const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
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
    discount: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discount",
      },
    ],
    description: {
      type: String,
      required: true,
    },
    casts: [
      {
        type: String,
      },
    ],
    year: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    trailer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    duration: {
      type: String,
    },
    donation: {
      type: Boolean,
    },
    donate: {
      type: Number,
    },
    free: {
      type: Boolean,
      default: false,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    type: {
      type: String,
      default: "Movies",
    },
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    acquired: {
      type: Number,
      default: 0,
    },
    expirationSpan: {
      type: Number,
    },
    validViews: {
      type: Number,
    },
    emails: {
      type: [String],
      validate: {
        validator: function(v) {
          return v.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        },
        message: props => `${props.value} contains an invalid email!`
      },
      default:[]
    },
    course: {
      type: Boolean,
      default:false
    },
    certificate: {
      type: Boolean,
      default:false
    }
  },
  {
    timestamps: true, //important
  }
);

module.exports = mongoose.model("Movies", movieSchema);
