import React, { useEffect, useState } from "react";
import "./UserPage.css"; // Import the CSS file

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/shop/detailed-user",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return <p className="loading">Loading user...</p>;
  }

  if (error) {
    return <p className="loading">Error: {error}</p>;
  }

  return (
    <div className="container">
      <h1 className="title">User Profile</h1>
      <p className="details">Username: {user.username}</p>
      <p className="details">Email: {user.email}</p>
      <p className="details">Role: {user.role}</p>
      <p className="details">Admin: {user.isAdmin ? "Yes" : "No"}</p>
      <p className="details">Tax ID: {user.taxID}</p>
      <p className="details">Address: {user.address}</p>
      <h2 className="title">Cart</h2>
      <ul className="list">
        {user.cart.items.map((item, index) => (
          <li key={index} className="list-item">
            Book Title: {item.bookId.title} - Quantity: {item.quantity}
          </li>
        ))}
      </ul>
      <p className="details">Total Amount: {user.cart.totalAmount}</p>
      <h2 className="title">Wishlist</h2>
      <div className="wishlist-container">
        {user.wishlist.items.map((item, index) => (
          <p key={index} className="wishlist-item">
            Book Title: {item.bookId.title}
          </p>
        ))}
      </div>
    </div>
  );
}

export default UserProfile;
