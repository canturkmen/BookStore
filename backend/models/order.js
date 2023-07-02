const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        bookId: {
          type: Object,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        currentPrice: {
          type: Number,
          required: true
        },
        originalPrice: {
          type: Number,
          required: true,
          default: 0
        },
        refundStatus: {
          type: String,
          enum: ["sent", "refunded", "not", "rejected"],
          required: true,
          default: "not",
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
