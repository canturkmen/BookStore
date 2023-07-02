const User = require("../models/user");
const Book = require("../models/book");
const Review = require("../models/review");
const Order = require("../models/order");

const PDFDocument = require("pdfkit");
const sgMail = require("@sendgrid/mail");

exports.getReviews = async (req, res, next) => {
  try {
    const customers = await User.find({ role: "customer" });
    const customerIds = customers.map((customer) => customer._id);

    const reviews = await Review.find({
      user: { $in: customerIds },
      isDisabled: true,
      isRejected: false,
      comment: { $ne: "" },
    })
      .populate("user", ["username", "email"])
      .populate("book", ["title", "description", "imageUrl"]);

    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch the comments." });
  }
};

exports.getCategoryNames = async (req, res, next) => {
  try {
    const categories = await Book.distinct("category");
    res.json(categories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch the category names" });
  }
};

exports.addBook = async (req, res, next) => {
  console.log(req.body);
  console.log(req.body.author);

  const title = req.body.title;
  const description = req.body.description;
  const author = req.body.author;
  const distributor = req.body.distributor;
  const category = req.body.category;
  const imageUrl = req.body.imageUrl;
  const warranty = req.body.warranty;
  const price = req.body.price;
  const number = req.body.stock;
  const page_number = req.body.page_number;
  const publication_year = req.body.publication_year;
  const language = req.body.language;
  const rating = req.body.rating;

  try {
    let book = new Book({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      category: category,
      publication_year: publication_year,
      author: author,
      rating: rating,
      warranty: warranty,
      distributor: distributor,
      language: language,
      page_number: page_number,
      number: number,
      originalPrice: price,
    });

    await book.save();
    res.status(201).json({ message: "Successfully Created Book!" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Error occured while saving the book in the server" });
  }
};

exports.getStockBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error occured while fetching the books from the server",
    });
  }
};

exports.incrementStock = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    book.number++;
    const newBook = await book.save();
    res.status(200).json(newBook);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error occured while incrementing the stocks in the server",
    });
  }
};

exports.decrementStock = async (req, res, next) => {
  try {
    const bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    book.number--;
    const newBook = await book.save();
    res.status(200).json(newBook);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error occured while decrementing the stocks in the server",
    });
  }
};

exports.acceptReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.commentId);
    review.isDisabled = false;
    await review.save();
    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch the comments." });
  }
};

exports.rejectReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.commentId);
    review.isRejected = true;
    await review.save();
    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch the comments." });
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

exports.applyDiscount = async (req, res, next) => {
  try {
    const { bookId, discount } = req.body;

    if (typeof discount !== "number" || discount < 0 || discount > 100) {
      return res.status(400).json({ message: "Invalid discount value." });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { discount },
      { new: true } // This option returns the updated document
    );

    updatedBook.price = ((100 - discount) / 100) * updatedBook.originalPrice;
    await updatedBook.save();

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    const pdfDoc = new PDFDocument();
    let buffers = [];
    pdfDoc.on("data", buffers.push.bind(buffers));
    pdfDoc.on("end", () => {});

    pdfDoc.fontSize(14).text("Book Information").moveDown();
    pdfDoc
      .text(`Title: ${updatedBook.title}`)
      .text(`Author: ${updatedBook.author}`)
      .text(`Category: ${updatedBook.category}`)
      .text(`Distributor: ${updatedBook.distributor}`)
      .text(`Rating: ${updatedBook.rating}`)
      .text(`In Stock: ${updatedBook.number}`)
      .text(`Language: ${updatedBook.language}`)
      .text(`Discount: ${updatedBook.discount}`)
      .text(`New Price: ${updatedBook.price}`)
      .text(`Old Price: ${updatedBook.originalPrice}`)
      .moveDown(2);
    pdfDoc.end();

    await new Promise((resolve) => {
      pdfDoc.on("end", resolve);
    });

    const pdfBuffer = Buffer.concat(buffers);
    const pdfBase64 = pdfBuffer.toString("base64");

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const users = await User.find({ "wishlist.items.bookId": updatedBook._id });
    users.forEach(async (user) => {
      const msg = {
        to: user.email,
        from: "turkmenc844@gmail.com",
        subject: "A Book In Your Wishlist Just Got a Discount",
        html: `<p>Hello ${user.username},</p>
        <p>A Book In Your Wishlist Just Got a Discount. Please find the attached information for your reference.</p>
        <p>Regards,</p>
        <p>Book Shop</p>`,
        attachments: [
          {
            content: pdfBase64,
            filename: `discount-${updatedBook._id}.pdf`,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      };
      await sgMail.send(msg);
    });

    res
      .status(200)
      .json({ message: "Discount applied successfully.", updatedBook });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while applying the discount." });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.bookId");

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const { orderStatus } = req.body;

    // Find the order and update its status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json({ order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

exports.getInvoicesByDateRange = async (req, res, next) => {
  const { startDate, endDate } = req.params;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate("userId")
      .populate("items.bookId");

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Fetching Invoices Failed" });
  }
};

exports.getProfitPerBook = async (req, res, next) => {
  try {
    const books = await Book.find({});
    let profits = [];
    books.forEach((book) => {
      let profit = book.price * book.sold;
      profits.push({ title: book.title, profit: profit });
    });
    res.json(profits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSoldBook = async (req, res, next) => {
  try {
    const books = await Book.find({});
    let sold = [];
    books.forEach((book) => {
      sold.push({ title: book.title, sold: book.sold });
    });
    res.status(200).json(sold);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfitByDate = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate("items.bookId");
    let profits = [];
    orders.forEach((order) => {
      let profit = 0;
      profit = order.totalAmount;
      profits.push({ date: order.createdAt, profit: profit });
    });
    res.json(profits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.bookId");

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRefunds = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.bookId")
      .populate("userId");

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveRefund = async (req, res, next) => {
  const orderId = req.body.orderId;
  const itemId = req.body.itemId;

  try {
    const order = await Order.findById(orderId).populate('userId');
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.refundStatus !== "sent") {
      return res
        .status(400)
        .json({ message: "Item is not eligible for refund approval" });
    }

    const book = await Book.findById(item.bookId);
    if (book) {
      book.number += 1;
      book.sold = book.sold > 0 ? book.sold - 1 : 0;
      await book.save();
    }

    item.refundStatus = "refunded";
    await order.save();

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: order.userId.email, // user email
      from: "turkmenc844@gmail.com", // your email
      subject: "Refund Approved",
      text: "Your refund has been approved.",
      html: "<strong>Your refund has been approved.</strong>",
    };

    sgMail
      .send(msg)
      .then(() => console.log("Email sent"))
      .catch((error) => console.error(error));

    res.status(200).json({ message: "Refund approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rejectRefund = async (req, res, next) => {
  const orderId = req.body.orderId;
  const itemId = req.body.itemId;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.refundStatus !== "sent") {
      return res
        .status(400)
        .json({ message: "Item is not eligible for refund approval" });
    }

    item.refundStatus = "rejected";
    await order.save();

    res.status(200).json({ message: "Refund rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params; // get the book id from the request parameters
    await Book.findByIdAndDelete(bookId); // delete the book with the provided id
    res.status(200).json({ message: "Book deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changeOriginalPrice = async (req, res, next) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.body.bookId,
      {
        originalPrice: req.body.newOriginalPrice,
      },
      { new: true }
    );

    updatedBook.price =
      ((100 - updatedBook.discount) / 100) * updatedBook.originalPrice;
    await updatedBook.save();

    if (!updatedBook) {
      console.log("No book found with the given ID");
      res.status(404).json({ message: "Book Not Found" });
    }

    res
      .status(201)
      .json({ message: "Original Price Changed!", updatedBook: updatedBook });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error while changing the original price" });
  }
};

exports.getProfitLossData = async (req, res, next) => {
  try {
    const orders = await Order.find();
    
    const profitLossData = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().slice(0, 10); // format date as 'yyyy-mm-dd'

      if (!profitLossData[date]) {
        profitLossData[date] = 0;
      }

      order.items.forEach(item => {
        const potentialProfit = item.originalPrice * item.quantity;
        const actualIncome = item.currentPrice * item.quantity;
        const diff = potentialProfit - actualIncome;

        profitLossData[date] += diff;
      });
    });

    const formattedData = Object.entries(profitLossData).map(([date, profitOrLoss]) => ({
      date,
      profitOrLoss,
    }));

    res.json(formattedData);
  } catch (err) {
    next(err);
  }
};