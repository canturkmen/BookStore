import { useContext, useEffect, useState } from "react";
import CheckoutList from "../Components/CheckoutList";
import styles from "./Wishlist.module.css";
import { WishlistContext } from "../../shared/contexts/wishlist-context";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistItemNumber, setWishlistItemNumber] = useState(0);

  const { wishlistItemCount } = useContext(WishlistContext);

  useEffect(() => {
    const fetchWishlistItems = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/shop/wishlist/items", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      setWishlistItems(data.wishlistItems);
      setWishlistItemNumber(wishlistItemCount);
    };

    fetchWishlistItems();
  }, [wishlistItemCount]);

  return (
    <div className={styles.checkout}>
      {wishlistItemNumber > 0 ? (
        <div className={styles.checkout__checkout_product}>
          <div className={styles.checkout__info}>
            <p className={styles.checkout__p}>My Wishlist</p>
            <p className={styles.checkout__p2}>({wishlistItemNumber} Books)</p>
          </div>
          <div className={styles.checkout__product_container}>
            <CheckoutList books={wishlistItems} />
          </div>
        </div>
      ) : (
        <div className={styles.checkout__empty_wishlist}>
          <h2>Your wishlist is empty!</h2>
          <p>You can go back and add items to your wishlist.</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
