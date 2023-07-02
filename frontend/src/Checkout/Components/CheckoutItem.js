import { useContext, useState } from "react";
import styles from "./CheckoutItem.module.css";
import StarIcon from "@mui/icons-material/Star";
import Card from "../../shared/components/UIComponents/Card";
import { CartContext } from "../../shared/contexts/cart-context";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

const CheckoutItem = (props) => {
  const [isError, setIsError] = useState(false);
  const cartCtx = useContext(CartContext);
  const totalAmount = props.price * props.amount;

  const addItemHandler = () => {
    const updatedNumber = props.number - 1;
    console.log(updatedNumber);
    if (updatedNumber > 0) {
      cartCtx.addItem(props.id);
    } else {
      setIsError(true);
    }
  };

  const removeItemHandler = () => {
    cartCtx.removeItem(props.id);
  };

  const removeAllItemHandler = () => {
    cartCtx.removeAllItem(props.id);
  };

  const onCloseModalHandler = () => {
    setIsError(false);
  };

  return (
    <Card className={styles.checkout__card}>
      <ErrorModal
        show={isError}
        title="You Can't Add More"
        message="There isn't enough number of stock"
        onClose={onCloseModalHandler}
      />
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
        <div className={styles.checkout__product_actions}>
          <button onClick={addItemHandler}>+</button>
          <p className={styles.checkout__par_between_buttons}>{props.amount}</p>
          <button onClick={removeItemHandler}>-</button>
        </div>
        <div className={styles.checkout__product_price}>
          <p>
            <small>$</small>
            <strong>{parseFloat(totalAmount.toFixed(2))}</strong>
          </p>
          <button>Add to wishlist</button>
          <button onClick={removeAllItemHandler}>Remove Item</button>
        </div>
      </li>
    </Card>
  );
};

export default CheckoutItem;
