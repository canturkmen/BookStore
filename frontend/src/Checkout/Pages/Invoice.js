import React, { useState, useRef, useEffect } from "react";
import ClientDetails from "./components/ClientDetails";
import Dates from "./components/Dates";
import Footer from "./components/Footer";
import Header from "./components/Header";
import MainDetails from "./components/MainDetails";
import Notes from "./components/Notes";
import Table from "./components/Table";
import ReactToPrint from "react-to-print";
import TableForm from "./components/TableForm";
import "./Invoice.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useParams } from "react-router-dom";
//import { DonateButton } from "../buttons";

const Invoice = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [website, setWebsite] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [width] = useState(641);

  const [orderData, setOrderData] = useState({});
  const orderId = useParams().orderId;

  const componentRef = useRef();

  useEffect(() => {
    const getOrderData = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/shop/order/get-order/" + orderId,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      setOrderData(data.order);
    };

    getOrderData();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      <div className="invoice-header">
        <h1>Invoice</h1>
      </div>
      <div className="client-info">
        <h3>Client Information</h3>
        <p>Name: {orderData.userId?.username}</p>
        <p>Email: {orderData.userId?.email}</p>
        <p>Address: {orderData.userId?.address}</p>
        <p>Tax ID: {orderData.userId?.taxID}</p>
      </div>
      <div className="invoice-items">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {orderData.items && orderData.items.map((item) => (
              <tr key={item.id}>
                <td>{item.bookId.title}</td>
                <td>{item.quantity}</td>
                <td>{item.bookId.price}</td>
                <td>{item.bookId.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="invoice-total">
        <p>Total Price: ${orderData.totalAmount && parseFloat(orderData.totalAmount.toFixed(2))}</p>
      </div>
    </div>
  );
};

export default Invoice;
