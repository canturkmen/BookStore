import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CancelIcon from "@mui/icons-material/Cancel";

import styles from "./BookDetail.module.css";

import Card from "../../shared/components/UIComponents/Card";
import { CartContext } from "../../shared/contexts/cart-context";
import Comments from "../../comments/Comments";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { WishlistContext } from "../../shared/contexts/wishlist-context";

const BookDetailPage = (props) => {
  const bookId = useParams().bookId;
  const [book, setBook] = useState({});
  const [isWishlistError, setIsWishlistError] = useState(false);
  const [isCartError, setIsCartError] = useState(false);

  const { updateCartItemCount } = useContext(CartContext);
  const { updateWishlistItemCount } = useContext(WishlistContext);

  useEffect(() => {
    const getBook = async () => {
      const response = await fetch("http://localhost:5000/shop/book/" + bookId);
      const data = await response.json();
      setBook(data.book);
    };

    getBook();
  }, [bookId]);

  const addItemHandler = async (event) => {
    event.stopPropagation();
    if (book.number > 0) {
      const item = {
        itemId: book._id,
        title: book.title,
        description: book.description,
        price: book.price,
        rating: book.rating,
        imageUrl: book.imageUrl,
        author: book.author,
        publisher: book.distributor,
      };

      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/shop/cart/add-item", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      updateCartItemCount((prevCount) => prevCount + 1);
    } else {
      setIsCartError(true);
    }
  };

  const addWishlistItemHandler = async (event) => {
    event.stopPropagation();

    const item = {
      itemId: book._id,
      title: book.title,
      description: book.description,
      price: book.price,
      rating: book.rating,
      imageUrl: book.imageUrl,
      author: book.author,
      publisher: book.distributor,
    };

    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/shop/wishlist/add-item",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      }
    );

    const data = await response.json();
    if (data.isError === "True") {
      setIsWishlistError(true);
    } else {
      updateWishlistItemCount((prevCount) => prevCount + 1);
    }
  };

  const closeWishlistModalHandler = () => {
    setIsWishlistError(false);
  };

  const closeCartModalHandler = () => {
    setIsCartError(false);
  };

  return (
    <>
      <ErrorModal
        show={isWishlistError}
        onClose={closeWishlistModalHandler}
        title="Already in Wishlist"
        message="This item is already in the wishlist."
      />
      <ErrorModal
        show={isCartError}
        onClose={closeCartModalHandler}
        title="Out of Stock"
        message="This item is currently out of stock."
      />
      <div className={styles.book_detail}>
        <Card className={styles.book_detail__body}>
          <div className={styles.book_detail__image}>
            <img src={book.imageUrl} alt={book.title} />
          </div>
          <div className={styles.book_detail_info_body}>
            <div className={styles.book_detail__info}>
              <p className={styles.book_detail__title}>{book.title}</p>
              <div className={styles.book_detail__author_publisher}>
                <p>{book.author}</p>
                <hr></hr>
                <p>{book.distributor}</p>
              </div>
              <div className={styles.book_detail__rating}>
                <p>
                  {Array(book.rating)
                    .fill()
                    .map((_, i) => (
                      <StarIcon
                        className={styles.book_detail__rating_design}
                        key={i}
                      />
                    ))}
                </p>
              </div>
              <p className={styles.book_detail__description}>
                {book.description}
                <hr />
              </p>
              <p className={styles.book_detail__language}>
                <strong>Language: </strong> {book.language}
              </p>
              <p className={styles.book_detail__publication_year}>
                <strong>Publication Year: </strong> {book.publication_year}
              </p>
              <p className={styles.book_detail__page_number}>
                <strong>Total Page: </strong> {book.page_number}
              </p>
              <p className={styles.book_detail__number}>
                <strong>In Stock: </strong> {book.number}
              </p>
              <p className={styles.book_detail__number}>
                <strong>Sold: </strong> {book.sold}
              </p>
            </div>
            <div className={styles.actions}>
              <button onClick={addItemHandler}>Add To Cart</button>
              <button onClick={addWishlistItemHandler}>Add To Wishlist</button>
            </div>
          </div>
          <div className={styles.price_info}>
            {book.discount > 0 ? (
              <p className={styles.book_detail__price}>
                <span className={styles.original_price}>
                  {book.originalPrice.toFixed(2)}
                </span>
                <span className={styles.book_detail__price_new}>
                  ${((book.originalPrice * (100 - book.discount)) / 100).toFixed(2)}
                </span>
                <hr />
              </p>
            ) : (
              <p className={styles.book_detail__price}>
                ${book.price}
                <hr />
              </p>
            )}
            <p className={styles.book_detail__language}>
              <strong>Warranty: </strong> {book.warranty} Years
            </p>
          </div>
        </Card>
        <Card className={styles.comments_body}>
          <Comments bookId={bookId} />
        </Card>
      </div>
    </>
  );
};

export default BookDetailPage;
