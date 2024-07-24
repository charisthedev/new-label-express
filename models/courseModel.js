const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    casts: [
      {
        type: String,
      },
    ],
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
    image: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
    },
    type: {
      type: String,
      default: "Course",
    },
    genre: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    lessons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lesson",
        },
      ],
    donation: {
      type: Boolean,
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
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
