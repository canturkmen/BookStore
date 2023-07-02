import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import styled, { keyframes } from "styled-components";

const StyledTable = styled.table`
  width: 80%;
  margin: 0 auto;
  border-collapse: collapse;
`;

const StyledHeader = styled.th`
  background-color: #555;
  color: white;
  padding: 10px;
  text-align: left;
`;

const StyledCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const StyledButton = styled.button`
  margin-bottom: 1rem;
`;

const AdminRefunds = () => {
  const [orders, setOrders] = useState([]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/admin/sales-manager/refunds",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      setOrders(data.orders);
    } catch (err) {
      console.log("Error fetching books:", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const acceptRefund = async (orderId, itemId) => {
    const token = localStorage.getItem("token");
    const data = {
      orderId: orderId,
      itemId: itemId,
    };
    const response = await fetch(
      "http://localhost:5000/admin/sales-manager/approve-refund",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    fetchBooks();
  };

  const rejectRefund = async (orderId, itemId) => {
    const token = localStorage.getItem("token");
    const data = {
      orderId: orderId,
      itemId: itemId,
    };

    const response = await fetch(
      "http://localhost:5000/admin/sales-manager/reject-refund",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    fetchBooks();
  };

  return (
    <div className="list">
      <SideBar />
      <div className="list-container">
        <NavBar />
        <StyledTable>
          <thead>
            <tr>
              <StyledHeader>Email</StyledHeader>
              <StyledHeader>Order ID</StyledHeader>
              <StyledHeader>Book Name</StyledHeader>
              <StyledHeader>Price</StyledHeader>
              <StyledHeader>Refund Status</StyledHeader>
              <StyledHeader>Update Status</StyledHeader>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) =>
                order.items
                  .filter((item) =>
                    ["sent", "refunded", "rejected"].includes(item.refundStatus)
                  )
                  .map((item) => (
                    <tr key={item._id}>
                      <StyledCell>{order.userId.email}</StyledCell>
                      <StyledCell>{order._id}</StyledCell>
                      <StyledCell>{item.bookId?.title ? item.bookId.title : "This item was deleted from store"}</StyledCell>
                      <StyledCell>{item?.currentPrice ? item.currentPrice : "This item was deleted from store"}</StyledCell>
                      <StyledCell>
                        {item.refundStatus.charAt(0).toUpperCase() +
                          item.refundStatus.slice(1)}
                      </StyledCell>
                      <StyledCell>
                        {item.refundStatus === "sent" ? (
                          <>
                            <StyledButton
                              onClick={() => acceptRefund(order._id, item._id)}
                            >
                              Approve
                            </StyledButton>
                            <StyledButton
                              onClick={() => rejectRefund(order._id, item._id)}
                            >
                              Reject
                            </StyledButton>
                          </>
                        ) : (
                          "NA"
                        )}
                      </StyledCell>
                    </tr>
                  ))
              )}
          </tbody>
        </StyledTable>
      </div>
    </div>
  );
};

export default AdminRefunds;
