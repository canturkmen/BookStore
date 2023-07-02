import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState({});

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const OrdersContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `;

  const OrderCard = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    width: 60%;
    background-color: #fafafa;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    animation: ${fadeIn} 0.3s ease-out;
  `;

  const Title = styled.h2`
    color: #444;
    margin-bottom: 20px;
  `;

  const ItemContainer = styled.div`
    display: flex;
    justify-content: space-between;
    background: #f0f0f0;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
  `;

  const ItemDetails = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const Button = styled.button`
    background-color: #e0f7fa;
    border: none;
    color: #00897b;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #b2ebf2;
    }
  `;

  const StatusContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 20px;
  `;

  const RefundedContainer = styled.div`
    width: 150px;
    display: flex;
    flex-direction: column;
  `;

  const Status = styled.p`
    color: ${(props) =>
      props.status === "Processing" ? "#f57c00" : "#4caf50"};
    font-weight: bold;
  `;

  const RefundContainer = styled.div`
    display: flex;
    justify-content: flex-end;
  `;

  const RefundedText = styled.p`
    color: #4caf50;
    font-weight: bold;
  `;

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:5000/shop/orders/items", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      // Handle error
      return;
    }

    const data = await response.json();
    setOrders(data.orders);
    setUser(data.user);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRequest = async (bookId, orderId, refundStatus) => {
    const token = localStorage.getItem("token");
    const data = {
      bookId: bookId,
      orderId: orderId,
      refundStatus: refundStatus,
    };

    const response = await fetch("http://localhost:5000/shop/update-orders", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Handle error
      return;
    }

    fetchOrders();
  };

  const isOrderOlderThanAMonth = (date) => {
    const orderDate = new Date(date);
    const currentDate = new Date();
    const differenceInMonths =
      currentDate.getMonth() -
      orderDate.getMonth() +
      12 * (currentDate.getFullYear() - orderDate.getFullYear());
    return differenceInMonths > 1;
  };

  const HighlightedText = styled.p`
    color: black; // Or any other color you prefer
    font-weight: bold;
  `;

  return (
    <OrdersContainer>
      {orders.map((order) => (
        <OrderCard key={order._id}>
          <StatusContainer>
            <Title>Order ID: {order._id}</Title>
            <Status status={order.orderStatus}>
              Status: {order.orderStatus}
            </Status>
          </StatusContainer>
          <p>Date: {order.createdAt}</p>
          <p>User Name: {user.username || "Not available"}</p>
          <HighlightedText>
            Address: {user.address || "Not available"}
          </HighlightedText>
          <p>Email: {user.email || "Not available"}</p>
          <p>Tax ID: {user.taxID || "Not available"}</p>
          {order.items.map((item) => (
            <ItemContainer key={item._id}>
              <ItemDetails>
                {item.bookId?.title ? (
                  <div>
                    <h3>{item.bookId?.title || "Title Not Available"}</h3>
                    <p>Quantity: {item.quantity || "Not Available"}</p>
                    <p>Price: {item.currentPrice || "Not Available"}</p>
                  </div>
                ) : (
                  <div>
                    <h3>This book was deleted</h3>
                    <p>Quantity: {item.quantity || "Not Available"}</p>
                    <p>This book price was deleted</p>
                  </div>
                )}
              </ItemDetails>
              <RefundContainer>
                {item.refundStatus === "sent" && (
                  <RefundedText>Refund Request Sent</RefundedText>
                )}
                {item.refundStatus === "refunded" && (
                  <RefundedContainer>
                    <RefundedText>Refunded</RefundedText>
                    <p>Returned: {item.currentPrice}</p>
                  </RefundedContainer>
                )}
                {item.refundStatus === "rejected" && (
                  <RefundedText>Rejected</RefundedText>
                )}
                {item.refundStatus === "not" && (
                  <>
                    {!isOrderOlderThanAMonth(order.createdAt) && (
                      <Button
                        disabled={isOrderOlderThanAMonth(order.createdAt)}
                        onClick={() => {
                          handleRequest(item._id, order._id, "sent");
                        }}
                      >
                        Request Refund
                      </Button>
                    )}
                    {isOrderOlderThanAMonth(order.createdAt) && (
                      <p style={{ color: "red" }}>
                        Refunds are only available for orders made within the
                        last month.
                      </p>
                    )}
                  </>
                )}
              </RefundContainer>
            </ItemContainer>
          ))}
        </OrderCard>
      ))}
    </OrdersContainer>
  );
};

export default OrdersPage;
