const express = require("express");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.post("/add-book", shopController.postAddBook);

router.post("/search", shopController.searchBook);

router.get("/book/:bookId", shopController.getBook);

router.get("/book/comments/:bookCommentId", shopController.getBookComments);

router.post(
  "/book/comments/add-comment/:bookCommentId",
  isAuth,
  shopController.addBookComment
);

router.get("/filter", shopController.getCategorizedBooks);

router.get("/filter-all", shopController.getAllBooks);

router.get("/category-counts", shopController.getCategoryCounts);

router.post("/cart/add-item", isAuth, shopController.addCartItem);

router.post("/cart/remove-item", isAuth, shopController.removeCartItem);

router.post("/cart/remove-all-item", isAuth, shopController.removeAllCartItem);

router.get("/cart/item-count", isAuth, shopController.getItemCount);

router.get("/cart/items", isAuth, shopController.getCartItems);

router.get("/wishlist/item-count", isAuth, shopController.getWishlistItemCount);

router.get("/wishlist/items", isAuth, shopController.getWishlistItems);

router.post("/wishlist/add-item", isAuth, shopController.addWishlistItem);

router.post(
  "/wishlist/remove-all-item",
  isAuth,
  shopController.removeWishlistItems
);

router.post("/order/add-order", isAuth, shopController.addOrder);

router.get("/order/get-order/:orderId", isAuth, shopController.getOrder);

router.get("/newly-added-books", shopController.getNewlyAddedBooks);

router.get("/top-rated-books", shopController.getTopRatedBooks);

router.get("/best-seller-books", shopController.getBestSellerBooks);

router.patch("/update-orders", isAuth, shopController.updateOrder);

router.get("/orders/items", isAuth, shopController.getOrders);

router.delete("/orders/:orderId", isAuth, shopController.deleteOrder);

router.get("/detailed-user", isAuth, shopController.getUserDetailedInfo);

module.exports = router;
