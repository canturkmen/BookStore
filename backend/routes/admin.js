const express = require("express");
const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/product-manager/comments", isAuth, adminController.getReviews);

router.get(
  "/product-manager/get-category-names",
  isAuth,
  adminController.getCategoryNames
);

router.post("/product-manager/add-book", isAuth, adminController.addBook);

router.get(
  "/product-manager/get-stock-books",
  isAuth,
  adminController.getStockBooks
);

router.get(
  "/product-manager/increment-stock/:bookId",
  isAuth,
  adminController.incrementStock
);

router.get(
  "/product-manager/decrement-stock/:bookId",
  isAuth,
  adminController.decrementStock
);

router.patch(
  "/product-manager/orders/:orderId",
  isAuth,
  adminController.updateOrder
);

router.get("/product-manager/orders", isAuth, adminController.getOrders);

router.get(
  "/product-manager/comments/:commentId",
  isAuth,
  adminController.acceptReview
);

router.get(
  "/product-manager/comments/reject/:commentId",
  isAuth,
  adminController.rejectReview
);

router.get("/sales-manager/getProducts", isAuth, adminController.getProducts);

router.post(
  "/sales-manager/apply-discount",
  isAuth,
  adminController.applyDiscount
);

router.get(
  "/sales-manager/invoices/:startDate/:endDate",
  isAuth,
  adminController.getInvoicesByDateRange
);

router.get(
  "/sales-manager/profit-per-book",
  isAuth,
  adminController.getProfitPerBook
);

router.get("/product-manager/invoices", isAuth, adminController.getInvoices);

router.get("/sales-manager/books-sold", isAuth, adminController.getSoldBook);

router.get(
  "/sales-manager/profit-by-date",
  isAuth,
  adminController.getProfitByDate
);

router.get("/product-manager/invoices", isAuth, adminController.getInvoices);

router.get("/sales-manager/refunds", isAuth, adminController.getRefunds);

router.post(
  "/sales-manager/approve-refund",
  isAuth,
  adminController.approveRefund
);

router.post(
  "/sales-manager/reject-refund",
  isAuth,
  adminController.rejectRefund
);

router.get(
  "/product-manager/delete-book/:bookId",
  isAuth,
  adminController.deleteBook
);

router.post("/sales-manager/change-original-price", isAuth, adminController.changeOriginalPrice)

router.get("/sales-manager/profit-loss", isAuth, adminController.getProfitLossData);

module.exports = router;
