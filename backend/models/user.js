const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["customer", "productManager", "salesManager"],
    required: true,
    default: "customer",
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  taxID: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  wishlist: {
    items: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
      },
    ],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
