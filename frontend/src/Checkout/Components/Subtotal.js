import React, { useContext, useState } from "react";
import styles from "./Subtotal.module.css";

import CurrencyFormat from "react-currency-format";
import { CartContext } from "../../shared/contexts/cart-context";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../shared/contexts/user-context";
import ErrorModal from "../../shared/components/UIComponents/ErrorModal";

const Subtotal = (props) => {
  const [isError, setIsError] = useState(false);
  const [isNotFilled, setIsNotFilled] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const navigate = useNavigate();
  const cartCtx = useContext(CartContext);
  const userCtx = useContext(UserContext);

  const isFormInvalid = !cardName || !cardNumber || !cvv || !expiryDate;

  const addOrderHandler = async () => {
    setFormSubmitted(true);

    if (isFormInvalid) {
      setIsNotFilled(true);
    } else {
      if (userCtx.isLoggedIn) {
        const enteredData = {
          items: props.books,
          totalAmount: props.totalAmount,
        };

        const token = localStorage.getItem("token");

        cartCtx.updateCartItemCount(0);
        const response = await fetch(
          "http://localhost:5000/shop/order/add-order",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(enteredData),
          }
        );

        const data = await response.json();
        navigate(`/invoice/${data.orderId}`);
      } else {
        setIsError(true);
      }
    }
  };

  const closeModalHandler = () => {
    setIsError(false);
    navigate("/auth/signin");
  };

  const closePurchaseModalHandler = () => {
    setIsNotFilled(false);
  };

  return (
    <>
      <ErrorModal
        show={isError}
        onClose={closeModalHandler}
        title="About Your Purchase"
        message="You need to login first to proceed."
      />
      <ErrorModal
        show={isNotFilled}
        onClose={closePurchaseModalHandler}
        title="About Your Purchase"
        message="You need to fill the card information to proceed."
      />
      <div className={styles.subtotal}>
        {formSubmitted && isFormInvalid && (
          <p className={styles.error_message}>Please fill in all the fields</p>
        )}
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
          display
          displayType={"text"}
          thousandSeparator={true}
          prefix={"$"}
        />
        <div className={styles.card_element_container}>
          <input
            type="text"
            placeholder="Name on Card"
            className={styles.mock_card_input}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Card number"
            className={styles.mock_card_input}
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <input
            type="text"
            placeholder="CVV"
            className={styles.mock_card_input}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />
          <input
            type="text"
            placeholder="MM/YY"
            className={styles.mock_card_input}
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        <button className={styles.btn} onClick={addOrderHandler}>
          Proceed to checkout
        </button>
      </div>
    </>
  );
};

export default Subtotal;
