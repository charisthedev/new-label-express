const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      default: undefined,
    },
    course:[
      {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Series",
       default:[]
      }
    ],
    wallet: {
      type: Number,
      default: 0,
    },
    cart: {
      type: Array,
      default: [],
    },
    active: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isDefaultPassword: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
