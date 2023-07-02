import React, { useContext } from "react";
import styles from "./Subtotal.module.css";

import CurrencyFormat from "react-currency-format";
import { WishlistContext } from "../../shared/contexts/wishlist-context";
import { useNavigate } from "react-router-dom";

const Subtotal = (props) => {
  const navigate = useNavigate();
  const cartCtx = useContext(WishlistContext);

  const addOrderHandler = async () => {
    const enteredData = {
      items: props.books,
      totalAmount: props.totalAmount,
    };

    const token = localStorage.getItem("token");

    cartCtx.updateCartItemCount(0);
    const response = await fetch("http://localhost:5000/shop/order/add-order", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(enteredData),
    });

    const data = await response.json();
    navigate(`/invoice/${data.orderId}`);
  };

  return (
    <div className={styles.subtotal}>
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({props.cartItemCount} items): <strong>{value}</strong>
            </p>
            <small className={styles.subtotal__gift}>
              <input type="Checkbox" />
              This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={parseFloat(props.totalAmount.toFixed(2))}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <button className={styles.btn} onClick={addOrderHandler}>
        Proceed to checkout
      </button>
    </div>
  );
};

export default Subtotal;
