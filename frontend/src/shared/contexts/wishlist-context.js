import React, { createContext, useState } from "react";

export const WishlistContext = createContext("default value");

export const WishlistProvider = (props) => {
  const [wishlistItemCount, setWishlistItemCount] = useState(0);

  const updateWishlistItemCount = (newCount) => {
    setWishlistItemCount(newCount);
  };

  const updateWishlistItems = async (action, itemId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/shop/wishlist/${action}`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });
    const data = await response.json();
  };

  const addItem = async (itemId) => {
    await updateWishlistItems("add-item", itemId);
    updateWishlistItemCount((prevWishlistItemCount) => prevWishlistItemCount + 1);
  };

  const removeItem = async (itemId) => {
    await updateWishlistItems("remove-item", itemId);
    updateWishlistItemCount((prevWishlistItemCount) => prevWishlistItemCount - 1);
  };

  const removeAllItem = async (itemId) => {
    await updateWishlistItems("remove-all-item", itemId);
    updateWishlistItemCount(0);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItemCount,
        updateWishlistItemCount,
        addItem,
        removeItem,
        removeAllItem,
      }}
    >
      {props.children}
    </WishlistContext.Provider>
  );
};
