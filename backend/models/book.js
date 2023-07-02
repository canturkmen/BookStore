const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  imageUrl: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  publication_year: {
    type: Number,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
  rating: {
    type: Number,
    require: true,
  },
  warranty: {
    type: Number,
    require: true,
  },
  distributor: {
    type: String,
    require: true,
  },
  language: {
    type: String,
    require: true,
  },
  page_number: {
    type: Number,
    requrie: true,
  },
  number: {
    type: Number,
    require: true,
  },
  sold: {
    type: Number,
    require: true,
    default: 0
  },
  discount: {
    type: Number,
    require: true,
    default: 0
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  originalPrice: {
    type: Number,
    require: true,
    default: 0
  }
}, {timestamps: true});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
