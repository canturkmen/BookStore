const Book = require("../models/book");
const User = require("../models/user");
const Review = require("../models/review");
const Order = require("../models/order");

const PDFDocument = require("pdfkit");
const sgMail = require("@sendgrid/mail");

function calculateScore(book) {
  const soldWeight = 0.5;
  const ratingWeight = 0.3;
  const reviewsWeight = 0.2;

  const soldScore = book.sold * soldWeight;
  const ratingScore = book.rating * ratingWeight;
  const reviewsScore = book.reviews.length * reviewsWeight;

  return soldScore + ratingScore + reviewsScore;
}

exports.postAddBook = async (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const author = req.body.author;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const category = req.body.category;
  const rating = req.body.rating;
  const number = req.body.number;
  const distributor = req.body.distributor;
  const page_number = req.body.page_number;
  const publication_year = req.body.publication_year;
  const warranty = req.body.warranty;
  const language = req.body.language;

  try {
    const book = new Book({
      title: title,
      description: description,
      author: author,
      price: price,
      imageUrl: imageUrl,
      category: category,
      number: number,
      rating: rating,
      distributor: distributor,
      page_number: page_number,
      publication_year: publication_year,
      warranty: warranty,
      language: language,
    });

    await book.save();
    res.status(201).json({ message: "Book Created!" });
  } catch (err) {
    console.log(err);
  }
};

exports.getCategoryCounts = async (req, res, next) => {
  try {
    const categories = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    const capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const categoryCounts = categories.map((category) => ({
      name: capitalizeFirstLetter(category._id),
      count: category.count,
    }));

    res.status(200).json({ categoryCounts: categoryCounts });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "An error occurred while fetching category counts." });
  }
};

exports.searchBook = async (req, res, next) => {
  if (req.body.option === "description") {
    Book.find({ description: req.body.data })
      .then((books) => {
        res.status(200).json({ books: books });
      })
      .catch((err) => console.log(err));
  } else if (req.body.option === "author") {
    Book.find({ author: req.body.data })
      .then((books) => {
        res.status(200).json({ books: books });
      })
      .catch((err) => console.log(err));
  } else if (req.body.option === "title") {
    Book.find({ title: req.body.data })
      .then((books) => {
        res.status(200).json({ books: books });
      })
      .catch((err) => console.log(err));
  }
};

exports.getIndex = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json({ books: books });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getBook = (req, res, next) => {
  const bookId = req.params.bookId;
  Book.findById(bookId)
    .then((book) => {
      res.status(200).json({ book: book });
    })
    .catch((err) => console.log(err));
};

exports.getCategorizedBooks = async (req, res, next) => {
  const categoryId = req.query.category;
  const sortingOption = req.query.sorting;
  const authors = req.query.author ? [].concat(req.query.author) : [];
  const publishers = req.query.publisher ? [].concat(req.query.publisher) : [];
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  try {
    let filter = { category: categoryId };

    if (authors.length > 0) {
      filter.author = { $in: authors };
    }

    if (publishers.length > 0) {
      filter.distributor = { $in: publishers };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sort =
      sortingOption === "descending" || sortingOption === "ascending"
        ? { price: sortingOption }
        : undefined;

    const books = await Book.find(filter).sort(sort);
    res.status(200).json({ books: books });
  } catch (err) {
    console.log(err);
  }
};

exports.getAllBooks = async (req, res, next) => {
  const search = req.query.search;
  const sortingOption = req.query.sorting;
  const newlyAdded = req.query.newlyAdded === "true";

  const authors = req.query.author ? [].concat(req.query.author) : [];
  const publishers = req.query.publisher ? [].concat(req.query.publisher) : [];
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  try {
    let filter = {};

    if (authors.length > 0) {
      filter.author = { $in: authors };
    }

    if (publishers.length > 0) {
      filter.distributor = { $in: publishers };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    let sort;
    if (sortingOption === "ascending" || sortingOption === "descending") {
      sort = { price: sortingOption };
    } else if (sortingOption === "popularity") {
      sort = { sold: -1 }; // Sort by the number of sold copies in descending order
    } else if (newlyAdded) {
      sort = { createdAt: -1 };
    }

    let books = [];
    if (newlyAdded) {
      // If newlyAdded is true, limit the results to the latest 20 books
      books = await Book.find(filter).sort(sort);
    } else {
      books = await Book.find(filter).sort(sort);
    }
    res.status(200).json({ books: books });
  } catch (err) {
    console.log(err);
  }
};

exports.getBookComments = async (req, res, next) => {
  const bookId = req.params.bookCommentId;
  let reviewData = [];

  const book = await Book.findById(bookId).populate({
    path: "reviews",
  });

  if (book.reviews) {
    for (const reviewIndex in book.reviews) {
      const review = book.reviews[reviewIndex];

      if (review.isDisabled && review.rating === 0) {
        continue;
      }

      const user = await User.findById(review.user).select(
        review.isDisabled ? "-comment" : ""
      );
      const reviewDataItem = {
        ...review._doc,
        user,
      };

      console.log(reviewDataItem);

      reviewData.push(reviewDataItem);
    }
    return res.status(200).json({ reviews: reviewData });
  }

  res.status(200).json({ reviews: [] });
};

exports.addBookComment = async (req, res, next) => {
  const review = new Review({
    rating: req.body.rating,
    comment: req.body.comment,
    user: req.userId,
    book: req.params.bookCommentId,
    isDisabled: false,
  });

  if (
    (review.comment !== "" && review.rating !== 0) ||
    (review.comment !== "" && review.rating === 0)
  ) {
    review.isDisabled = true;
  }

  try {
    await review.save();
    const book = await Book.findById(req.params.bookCommentId);
    book.reviews.push(review);
    await book.save();

    const user = await review.populate("user");

    if (review.comment === "" && review.rating !== 0) {
      return res.status(201).json({
        review: review,
        user: user,
        isHere: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addCartItem = async (req, res, next) => {
  const bookId = req.body.itemId;
  try {
    const book = await Book.findById(bookId);
    const user = await User.findById(req.userId);

    console.log(book);

    const updatedTotalAmount = user.cart.totalAmount + book.price;
    const cartProductIndex = user.cart.items.findIndex((cartItem) => {
      return cartItem.bookId.toString() === book._id.toString();
    });

    let newQuantity = 1;
    let updatedCartItems = [...user.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = user.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        bookId: book._id,
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
      totalAmount: updatedTotalAmount,
    };

    user.cart = updatedCart;
    await user.save();

    res.status(201).json({
      message: "Cart Item Added",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const book = await Book.findById(req.body.itemId);

    const updatedTotalAmount = user.cart.totalAmount - book.price;
    const existingRemoveCartItemIndex = user.cart.items.findIndex(
      (cartItem) => {
        return cartItem.bookId.toString() === book._id.toString();
      }
    );

    const existingRemoveItem = user.cart.items[existingRemoveCartItemIndex];

    let updatedRemoveItems;

    if (existingRemoveItem.quantity === 1) {
      console.log("Here");
      updatedRemoveItems = user.cart.items.filter(
        (cartItem) => cartItem.bookId.toString() !== book._id.toString()
      );
    } else {
      let updatedRemoveItem = {
        ...existingRemoveItem,
        quantity: existingRemoveItem.quantity - 1,
      };

      updatedRemoveItems = [...user.cart.items];
      updatedRemoveItems[existingRemoveCartItemIndex] = updatedRemoveItem;
    }

    const updatedCart = {
      items: updatedRemoveItems,
      totalAmount: updatedTotalAmount,
    };

    user.cart = updatedCart;
    await user.save();

    res.status(201).json({
      message: "Cart Item Added",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.removeAllCartItem = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const book = await Book.findById(req.body.itemId);

  const existingRemoveCartItemIndex = user.cart.items.findIndex((cartItem) => {
    return cartItem.bookId.toString() === book._id.toString();
  });

  const existingRemoveItem = user.cart.items[existingRemoveCartItemIndex];
  const updatedTotalAmount =
    user.cart.totalAmount - existingRemoveItem.quantity * book.price;

  const updatedCartItems = user.cart.items.filter((cartItem) => {
    return cartItem.bookId.toString() !== book._id.toString();
  });

  user.cart = {
    items: updatedCartItems,
    totalAmount: updatedTotalAmount,
  };

  await user.save();
};

exports.getItemCount = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const cartItemCount = user.cart.items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );
  res.status(200).json({ cartItemCount: cartItemCount });
};

exports.getWishlistItemCount = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const wishlistItemCount = user.wishlist.items.reduce(
    (acc, item) => acc + 1,
    0
  );
  res.status(200).json({ wishlistItemCount: wishlistItemCount });
};

exports.getCartItems = async (req, res, next) => {
  const user = await User.findById(req.userId).populate("cart.items.bookId");
  const cartItems = user.cart.items.map((item) => {
    return {
      id: item.bookId._id,
      title: item.bookId.title,
      author: item.bookId.author,
      publisher: item.bookId.publisher,
      imageUrl: item.bookId.imageUrl,
      price: item.bookId.price,
      rating: item.bookId.rating,
      amount: item.quantity,
      discount: item.bookId.discount,
      number: item.bookId.number,
      sold: item.bookId.sold,
      originalPrice: item.bookId.originalPrice,
    };
  });

  res.json({ cartItems: cartItems, totalAmount: user.cart.totalAmount });
};

exports.getWishlistItems = async (req, res, next) => {
  const user = await User.findById(req.userId).populate(
    "wishlist.items.bookId"
  );
  const wishlistItems = user.wishlist.items.map((item) => {
    return {
      id: item.bookId.id,
      title: item.bookId.title,
      author: item.bookId.author,
      publisher: item.bookId.distributor,
      imageUrl: item.bookId.imageUrl,
      price: item.bookId.price,
      rating: item.bookId.rating,
      number: item.bookId.number,
      sold: item.bookId.sold,
      discount: item.bookId.discount,
    };
  });

  res.json({
    wishlistItems: wishlistItems,
    totalAmount: user.wishlist.totalAmount,
  });
};

exports.removeWishlistItems = async (req, res, next) => {
  try {
    const { itemId } = req.body;
    const userId = req.userId; // Assuming you have set the userId in the request object after validating the token

    const book = await Book.findById(itemId);
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find the index of the book in the user's wishlist
    const wishlistItemIndex = user.wishlist.items.findIndex(
      (item) => item.bookId.toString() === itemId
    );

    if (wishlistItemIndex === -1) {
      return res
        .status(400)
        .json({ message: "Book not found in the wishlist." });
    }

    // Remove the book from the wishlist
    user.wishlist.items.splice(wishlistItemIndex, 1);
    await user.save();

    res.status(200).json({ message: "Book removed from wishlist." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while removing the book from the wishlist.",
    });
  }
};

exports.addOrder = async (req, res, next) => {
  const items = req.body.items;
  const totalAmount = req.body.totalAmount;

  const updatedItems = items.map((item) => {
    return {
      bookId: item.id,
      quantity: item.amount,
      currentPrice: item.price,
      originalPrice: item.originalPrice
    };
  });

  const order = new Order({
    items: updatedItems,
    totalAmount: totalAmount,
    userId: req.userId,
  });

  async function updateBookInventory(bookId, quantity) {
    const book = await Book.findById(bookId);
    book.number -= quantity;
    book.sold += quantity;
    await book.save();
  }

  try {
    await order.save();

    const user = await User.findById(req.userId);
    user.cart = {
      items: [],
      totalAmount: 0,
    };

    await user.save();

    for (const item of updatedItems) {
      await updateBookInventory(item.bookId, item.quantity);
    }

    const pdfDoc = new PDFDocument();
    let buffers = [];
    pdfDoc.on("data", buffers.push.bind(buffers));
    pdfDoc.on("end", () => {});

    pdfDoc.fontSize(26).text("Invoice", { align: "center" });
    pdfDoc.fontSize(14).text("Client Information").moveDown();
    pdfDoc
      .text(`Name: ${user.username}`)
      .text(`Email: ${user.email}`)
      .text(`Address: ${user.address}`);

    pdfDoc.text("----------------");

    const populatedOrder = await Order.findById(order._id).populate(
      "items.bookId"
    );
    const items = populatedOrder.items.map(({ bookId, quantity }) => ({
      title: bookId.title,
      quantity,
      price: bookId.price,
      author: bookId.author,
    }));

    items.forEach((item) => {
      pdfDoc
        .fontSize(14)
        .text(
          item.title +
            " - " +
            item.author +
            " - " +
            item.quantity +
            " x " +
            " $ " +
            item.price
        )
        .moveDown();
    });

    pdfDoc.text("----------------");

    pdfDoc
      .moveDown()
      .text(`Total Price: $${order.totalAmount}`, { align: "left" });

    pdfDoc.end();

    await new Promise((resolve) => {
      pdfDoc.on("end", resolve);
    });

    const pdfBuffer = Buffer.concat(buffers);
    const pdfBase64 = pdfBuffer.toString("base64");

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: user.email,
      from: "turkmenc844@gmail.com",
      subject: "Your Book Store Order Invoice",
      html: `<p>Hello ${user.username},</p>
      <p>Thank you for your order. Please find the attached invoice for your reference.</p>
      <p>Regards,</p>
      <p>Book Shop</p>`,
      attachments: [
        {
          content: pdfBase64,
          filename: `invoice-${order._id}.pdf`,
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };
    await sgMail.send(msg);

    res.status(201).json({ orderId: order._id });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId).populate("items.bookId userId");
    res.status(200).json({ order: order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNewlyAddedBooks = async (req, res, next) => {
  try {
    // Fetch the latest 20 books, sorted by createdAt in descending order
    const newlyAddedBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .exec();

    res.json({ newlyAddedBooks });
  } catch (err) {
    console.log(err);
  }
};

exports.getTopRatedBooks = async (req, res, next) => {
  try {
    const topRatedBooks = await Book.find()
      .sort({ rating: -1 })
      .limit(20)
      .exec();

    res.json({ topRatedBooks });
  } catch (err) {
    console.log(err);
  }
};

exports.getBestSellerBooks = async (req, res, next) => {
  try {
    const books = await Book.find().populate("reviews");
    const sortedBooks = books.sort((a, b) => {
      const scoreA = calculateScore(a);
      const scoreB = calculateScore(b);

      return scoreB - scoreA;
    });

    const bestSellers = sortedBooks.slice(0, 20);
    res.status(200).json({ bestSellers });
  } catch (err) {
    console.log(err);
  }
};

exports.addWishlistItem = async (req, res, next) => {
  const bookId = req.body.itemId;
  try {
    const book = await Book.findById(bookId);
    const user = await User.findById(req.userId);

    const wishlistProductIndex = user.wishlist.items.findIndex(
      (wishlistItem) => {
        console.log(wishlistItem.bookId.toString());
        console.log(bookId);
        return wishlistItem.bookId.toString() === bookId;
      }
    );

    if (wishlistProductIndex != -1) {
      return res.status(400).json({ isError: "True" });
    }

    user.wishlist.items.push({ bookId });
    await user.save();

    res.status(201).json({ isError: "False" });
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId: userId,
    })
      .populate({
        path: "items.bookId",
        model: "Book",
      })
      .populate("userId", "username");

    const user = await User.findById(req.userId);

    res.status(200).json({ orders, user: user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const bookId = req.body.bookId;
    const orderId = req.body.orderId;

    // Find the order and update its status
    const result = await Order.findOneAndUpdate(
      { _id: orderId, "items._id": bookId },
      { $set: { "items.$.refundStatus": "sent" } },
      { new: true } // This option returns the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "No matching order found to update." });
    }

    res
      .status(200)
      .json({ message: "Order status updated successfully.", order: result });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update order status.", error: err.message });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    res.status(200).json({ order: deletedOrder });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

exports.getUserDetailedInfo = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .populate("cart.items.bookId")
      .populate("wishlist.items.bookId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
