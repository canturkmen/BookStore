import React from "react";
import "./AdminComments.css";

const AdminOrderWidget = ({ orders, onOrderStatusChange }) => {
  const updateOrderStatusHandler = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      console.log(orderId);
      const response = await fetch(
        `http://localhost:5000/shop/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
  
      // Update the order status in the state, e.g., using onOrderStatusChange callback
      onOrderStatusChange(orderId, newStatus);
    } catch (err) {
      console.log("Error updating order status:", err);
    }
  };
  const deleteOrderHandler = async (orderId, newStatus) => {
  
  };

  return (
    <table className="comment-table">
      {console.log(orders)}
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Items</th>
          <th>Total Amount</th>
          <th>Order Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders &&
          orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userId.username}</td>
              <td>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.bookId._id}>
                      {item.bookId.title} (Quantity: {item.quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <td>${order.totalAmount.toFixed(2)}</td>
              </td>
              <td>
                <td>{order.orderStatus}</td>
              </td>
              <td>
                <button value={order.orderStatus}>.    .</button>
                <button 
                  className="accept-comment-btn"
                  onClick={(event) => deleteOrderHandler(event)}>
                    Request Refund
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdminOrderWidget;
