const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema(
  {
    rating: {
      type: Number,
      require: true,
      default: 0
    },
    comment: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Book",
    },
    isDisabled: {
      type: Boolean,
      require: true,
      default: true,
    },
    isRejected: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
