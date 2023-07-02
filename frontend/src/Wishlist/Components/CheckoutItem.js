import { useContext, useState } from "react";
import styles from "./CheckoutItem.module.css";
import StarIcon from "@mui/icons-material/Star";
import Card from "../../shared/components/UIComponents/Card";
import { WishlistContext } from "../../shared/contexts/wishlist-context";
import { CartContext } from "../../shared/contexts/cart-context";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";
import { useNavigate } from "react-router-dom";

const WishlistItem = (props) => {
  const [isError, setIsError] = useState(false);
  const { updateCartItemCount } = useContext(CartContext);
  const { removeAllItem } = useContext(WishlistContext);
  const navigate = useNavigate();

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
      setIsError(true);
    }
  };

  const removeItemHandler = () => {
    removeAllItem(props.id);
    navigate("/wishlist");
  };

  const closeModalHandler = () => {
    setIsError(false);
  };

  return (
    <>
      <ErrorModal
        show={isError}
        onClose={closeModalHandler}
        title="Out of Stock"
        message="This item is out of stock."
      />
      <Card className={styles.checkout__card}>
        <li className={styles.checkout__item}>
          <div className={styles.checkout__imageBox}>
            <img
              className={styles.checkout__image}
              src={props.imageUrl}
              alt={props.title}
            />
          </div>
          <div className={styles.checkout__product_info}>
            <p className={styles.checkout__product_title}>{props.title}</p>
            <p className={styles.checkout__product_author}>{props.author}</p>
            <p className={styles.checkout__product_distributor}>
              {props.publisher}
            </p>
            {Array(props.rating)
              .fill()
              .map((_, i) => (
                <StarIcon />
              ))}
          </div>
          <div className={styles.checkout__product_price}>
            <p>
              <small>$</small>
              <strong>
                {props.price}
              </strong>
            </p>
            <button onClick={addItemHandler}>Add to cart</button>
            <button onClick={removeItemHandler}>Remove Item</button>
          </div>
        </li>
      </Card>
    </>
  );
};

export default WishlistItem;
