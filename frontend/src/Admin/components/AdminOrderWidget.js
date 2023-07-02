import React from "react";
import "./AdminComments.css";

const AdminOrderWidget = ({ orders, onOrderStatusChange }) => {
  const updateOrderStatusHandler = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/product-manager/orders/${orderId}`,
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

      onOrderStatusChange(orderId, newStatus);
    } catch (err) {
      console.log("Error updating order status:", err);
    }
  };

  return (
    <table className="comment-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Items</th>
          <th>Total Amount</th>
          <th>Stock</th>
          <th>Order Status</th>
          <th>Address</th>
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
                  {order.items.map((item) =>
                    item.bookId ? (
                      <li key={item.bookId._id}>
                        {item.bookId.title} (Quantity: {item.quantity})
                      </li>
                    ) : (
                      <li>This item was deleted.</li>
                    )
                  )}
                </ul>
              </td>
              <td>${order.totalAmount.toFixed(2)}</td>
              <td>
                <ul>
                  {order.items.map((item) =>
                    item.bookId ? (
                      <li key={item.bookId._id}>
                        {item.bookId.number}
                      </li>
                    ) : (
                      <li>This item was deleted.</li>
                    )
                  )}
                </ul>
              </td>
              <td>{order.orderStatus}</td>
              <td className="highlight">{order.userId.address}</td>
              <td>
                <select
                  value={order.orderStatus}
                  className="select"
                  onChange={(e) =>
                    updateOrderStatusHandler(order._id, e.target.value)
                  }
                >
                  <option value="Processing">Processing</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default AdminOrderWidget;
