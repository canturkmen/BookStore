import { useEffect, useReducer, useState } from "react";
import styles from "./ViewProducts.module.css";
import "./AdminComments.css";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const initialState = {
  books: [],
  discounts: {},
  newOriginalPrices: {}, // added this line
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_BOOKS":
      return { ...state, books: action.books };
    case "SET_DISCOUNT":
      return {
        ...state,
        discounts: { ...state.discounts, [action.bookId]: action.discount },
      };
    case "SET_NEW_ORIGINAL_PRICE": // added this case
      return {
        ...state,
        newOriginalPrices: {
          ...state.newOriginalPrices,
          [action.bookId]: action.newOriginalPrice,
        },
      };
    default:
      return state;
  }
};

const ViewProducts = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getProducts();
  }, []);

  const applyDiscountHandler = async (bookId) => {
    const discount = state.discounts[bookId];
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/admin/sales-manager/apply-discount",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, discount }),
      }
    );
    const data = await response.json();

    const updatedBooks = state.books.map((book) => {
      if (book._id === bookId) {
        return { ...book, ...data.updatedBook };
      }
      return book;
    });

    dispatch({ type: "SET_BOOKS", books: updatedBooks });
  };

  const changeOriginalPriceHandler = async (bookId) => {
    const newOriginalPrice = state.newOriginalPrices[bookId];
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/admin/sales-manager/change-original-price",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookId, newOriginalPrice }),
      }
    );
    const data = await response.json();

    const updatedBooks = state.books.map((book) => {
      if (book._id === bookId) {
        return { ...book, ...data.updatedBook };
      }
      return book;
    });

    dispatch({ type: "SET_BOOKS", books: updatedBooks });
  };

  const getProducts = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:5000/admin/sales-manager/getProducts",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await response.json();
    dispatch({ type: "SET_BOOKS", books: data });
  };

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <NavBar />
        <ul className={styles.bookList}>
          {state.books.map((book) => (
            <li key={book._id} className={styles.bookItem}>
              <img
                src={book.imageUrl}
                alt={book.title}
                className={styles.bookImage}
              />
              <div className={styles.infos}>
                <p className={styles.bookDetails}>
                  <strong>Title:</strong> {book.title}
                </p>
                <p className={styles.bookDetails}>
                  <strong>Author:</strong> {book.author}
                </p>
                <p className={styles.bookDetails}>
                  <strong>Original Price:</strong> ${book.originalPrice}
                </p>
                <p className={styles.bookDetails}>
                  <strong>Current Discount:</strong> {book.discount}%
                </p>
                <p className={styles.bookDetails}>
                  <strong>Discounted Price:</strong> ${book.price}
                </p>
                <p className={styles.bookDetails}>
                  <strong>Sold:</strong> {book.sold}
                </p>
              </div>
              <div className={styles.actions}>
                <label>Change Original Price</label>
                <input
                  placeholder="Change Original Price"
                  className={styles.discountInput}
                  onChange={(e) => {
                    const newOriginalPrice = parseFloat(e.target.value);
                    if (!isNaN(newOriginalPrice)) {
                      dispatch({
                        type: "SET_NEW_ORIGINAL_PRICE",
                        bookId: book._id,
                        newOriginalPrice,
                      });
                    }
                  }}
                />
                <button onClick={() => changeOriginalPriceHandler(book._id)}>
                  Change Price
                </button>
                <label>Discount</label>
                <input
                  placeholder="Apply Discount"
                  className={styles.discountInput}
                  onChange={(e) => {
                    const discount = parseFloat(e.target.value);
                    if (!isNaN(discount)) {
                      dispatch({
                        type: "SET_DISCOUNT",
                        bookId: book._id,
                        discount,
                      });
                    }
                  }}
                />
                <button onClick={() => applyDiscountHandler(book._id)}>
                  Apply
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewProducts;
