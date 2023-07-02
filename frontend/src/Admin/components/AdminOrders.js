import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import "./AdminComments.css";
import AdminOrderWidget from "./AdminOrderWidget";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/admin/product-manager/orders",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        const data = await response.json();
        console.log(data.orders);
        setOrders(data.orders);
      } catch (err) {
        console.log("Error fetching comments:", err);
      }
    };

    fetchComments();
  }, []);

  const handleOrderChange = (orderId, newStatus) => {
    const updatedOrders = [...orders];
    const updatedOrderIndex = updatedOrders.findIndex(
      (order) => order._id === orderId
    );
    updatedOrders[updatedOrderIndex].orderStatus = newStatus;
    setOrders(updatedOrders);
  };

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <NavBar />
        <AdminOrderWidget
          orders={orders}
          onOrderStatusChange={handleOrderChange}
        />
      </div>
    </div>
  );
};

export default AdminOrders;
