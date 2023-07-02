import { useContext, useState } from "react";
import styles from "./BookItem.module.css";
import StarIcon from "@mui/icons-material/Star";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../shared/contexts/cart-context";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { UserContext } from "../../shared/contexts/user-context";

const BookItem = (props) => {
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);

  const { updateCartItemCount } = useContext(CartContext);
  const isLoggedIn = useContext(UserContext).isLoggedIn;

  const addItemHandler = async (event) => {
    event.stopPropagation();

    if (props.number > 0) {
      const item = {
        itemId: props.id,
        title: props.title,
        description: props.description,
        price: props.price,
        rating: props.rating,
        imageUrl: props.imageUrl,
        author: props.author,
        publisher: props.distributor,
      };

      if (!isLoggedIn) {
        const storedGuestCart = localStorage.getItem("guestCart");
        const guestCart =
          storedGuestCart !== null
            ? JSON.parse(storedGuestCart)
            : { items: [], totalAmount: 0 };

        let itemIndex = guestCart.items.findIndex(
          (cartItem) => cartItem.bookId === item.itemId
        );

        if (itemIndex === -1) {
          guestCart.items.push({
            bookId: item.itemId,
            quantity: 0,
          });

          itemIndex = guestCart.items.length - 1;
        }
        const insertedItem = guestCart.items[itemIndex];
        insertedItem.quantity += 1;
        guestCart.totalAmount += item.price;
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
        updateCartItemCount((prevCount) => prevCount + 1);
      } else {
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
      }
    } else {
      setIsError(true);
    }
  };

  const closeModalHandler = () => {
    setIsError(false);
  };

  const discountedPrice =
    props.originalPrice - (props.originalPrice * props.discount) / 100;
  const hasDiscount = props.discount > 0;

  return (
    <>
      <ErrorModal
        show={isError}
        onClose={closeModalHandler}
        title="Out of Stock"
        message="This item is currently out of stock."
      />
      <div
        className={styles.product}
        onClick={() => navigate(`/book/${props.id}`)}
      >
        <div className={styles.product__info}>
          <p className={styles.product__info_title}>{props.title}</p>
          <p className={styles.product__info_author}>{props.author}</p>
          <p className={styles.product__info_price}>
            {hasDiscount ? (
              <>
                <span className={styles.original_price}>
                  <small>$</small>
                  <strong>{props.originalPrice}</strong>
                </span>
                
                <LocalOfferIcon style={{'color': 'red', fontSize: "18px"}}/>
                
                <span className={styles.discounted_price}>
                  <small>$</small>
                  <strong>{discountedPrice.toFixed(2)}</strong>
                </span>
              </>
            ) : (
              <>
                <small>$</small>
                <strong>{props.price}</strong>
              </>
            )}
          </p>
        </div>
        <div className={styles.product__info}>
          <p className={styles.product__info_stock}>In Stock: {props.number}</p>
          <p className={styles.product__info_stock}>Sold: {props.sold}</p>
        </div>
        <div className={styles.product__rating}>
          {Array(props.rating)
            .fill()
            .map((_, i) => (
              <StarIcon key={i} />
            ))}
        </div>
        <img
          className={styles.product__image}
          src={props.imageUrl}
          alt={props.title}
        />
        <button
          onClick={(event) => addItemHandler(event)}
          className={styles.book_action__btn}
          disabled={isError}
        >
          <i className="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </>
  );
};

export default BookItem;
