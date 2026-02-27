const { number, required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
