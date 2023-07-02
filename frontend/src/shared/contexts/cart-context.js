import React, { createContext, useContext, useState } from "react";
import { UserContext } from "./user-context";

export const CartContext = createContext();

export const CartProvider = (props) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const isLoggedIn = useContext(UserContext).isLoggedIn;

  const updateCartItemCount = (newCount) => {
    setCartItemCount(newCount);
  };

  const updateCartItems = async (action, itemId) => {
    if (localStorage.getItem("is_logged_in") === "true") {
      console.log("Update Online")
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/shop/cart/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId }),
        }
      );
      const data = await response.json();
    } else {
      console.log("Update Local")
      const storedGuestCart = localStorage.getItem("guestCart");
      const guestCart =
        storedGuestCart !== null
          ? JSON.parse(storedGuestCart)
          : { items: [], totalAmount: 0 };

      const response = await fetch(`http://localhost:5000/shop/book/${itemId}`);
      const bookData = await response.json();
      console.log(bookData);
      let itemIndex = guestCart.items.findIndex(
        (cartItem) => cartItem.bookId === itemId
      );
      if (itemIndex === -1) {
        guestCart.items.push({
          bookId: itemId.itemId,
          quantity: 0,
        });

        itemIndex = guestCart.items.length - 1;
      }
      const insertedItem = guestCart.items[itemIndex];

      switch (action) {
        case "add-item":
          insertedItem.quantity += 1;
          guestCart.totalAmount += bookData.book.price;
          break;
        case "remove-item":
          if (insertedItem.quantity > 1) {
            insertedItem.quantity -= 1;
            guestCart.totalAmount -= bookData.book.price;
          } else {
            const itemIndex = guestCart.items.findIndex(
              (item) => item.bookId === itemId
            );
            guestCart.items.splice(itemIndex, 1);
          }
          break;
        case "remove-all-item":
          guestCart.totalAmount -= bookData.book.price * insertedItem.quantity;
          guestCart.items.splice(itemIndex, 1);
          break;

        default:
          console.error("Invalid action type:", action);
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }
  };

  const mergeGuestCartWithUser = async () => {
    const storedGuestCart = localStorage.getItem("guestCart");
      const guestCart =
        storedGuestCart !== null
          ? JSON.parse(storedGuestCart)
          : { items: [], totalAmount: 0 };
    for (const item of guestCart.items) {
      await addItem(item.bookId);
    }
    localStorage.removeItem("guestCart");
  };

  const addItem = async (itemId) => {
    await updateCartItems("add-item", itemId);
    updateCartItemCount((prevCartItemCount) => prevCartItemCount + 1);
  };

  const removeItem = async (itemId) => {
    await updateCartItems("remove-item", itemId);
    updateCartItemCount((prevCartItemCount) => prevCartItemCount - 1);
  };

  const removeAllItem = async (itemId) => {
    await updateCartItems("remove-all-item", itemId);
    updateCartItemCount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        updateCartItemCount,
        addItem,
        removeItem,
        removeAllItem,
        mergeGuestCartWithUser,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};
