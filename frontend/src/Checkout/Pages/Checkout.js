import { useContext, useEffect, useState } from "react";
import CheckoutList from "../Components/CheckoutList";
import styles from "./Checkout.module.css";
import { CartContext } from "../../shared/contexts/cart-context";
import Subtotal from "../Components/Subtotal";
import { UserContext } from "../../shared/contexts/user-context";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartItemNumber, setCartItemNumber] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const { cartItemCount } = useContext(CartContext);
  const isLoggedIn = useContext(UserContext).isLoggedIn;

  useEffect(() => {
    console.log("Here");
    const fetchCartItems = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/shop/cart/items", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setCartItems(data.cartItems);
      setTotalAmount(data.totalAmount);
      setCartItemNumber(cartItemCount);
    };

    const fetchLocalCartItems = async () => {
      const storedGuestCart = localStorage.getItem("guestCart");
      if (storedGuestCart) {
        const guestCart = JSON.parse(storedGuestCart);

        const populatedCartItems = [];

        for (const item of guestCart.items) {
          const response = await fetch(
            `http://localhost:5000/shop/book/${item.bookId}`
          );
          const bookData = await response.json();

          populatedCartItems.push({
            ...bookData.book,
            id: bookData.book._id,
            amount: item.quantity,
          });
        }

        setCartItems(populatedCartItems);
        setTotalAmount(guestCart.totalAmount);
        setCartItemNumber(populatedCartItems.length);
      }
    };

    if (isLoggedIn) {
      fetchCartItems();
    } else {
      fetchLocalCartItems();
    }
  }, [cartItemCount]);

  return (
    <div className={styles.checkout}>
      {cartItemNumber > 0 ? (
        <div className={styles.checkout__checkout_product}>
          <div className={styles.checkout__info}>
            <p className={styles.checkout__p}>My Cart</p>
            <p className={styles.checkout__p2}>({cartItemNumber} Books)</p>
          </div>
          <div className={styles.checkout__product_container}>
            <CheckoutList books={cartItems} />
              <Subtotal
                books={cartItems}
                cartItemCount={cartItemCount}
                totalAmount={totalAmount}
              />
          </div>
        </div>
      ) : (
        <div className={styles.checkout__empty_cart}>
          <h2>Your cart is empty!</h2>
          <p>Continue shopping to proceed with checkout.</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
