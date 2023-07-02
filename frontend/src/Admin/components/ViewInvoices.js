import React, { useEffect, useState } from "react";
//import Invoice from "./Invoice";
// import { useEffect, useReducer, useState } from "react";
import styles from "./ViewInvoices.module.css";
//import "./.css";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import Invoice from "./Invoice";

const ViewInvoices = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // Fetch the list of invoices from your backend API
    getInvoices();
  }, []);

  const getInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/admin/product-manager/invoices",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      ); // Update the API endpoint accordingly
      const data = await response.json();
      setInvoices(data.orders);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  return (
    <div className={styles.list}>
      <SideBar />
      <div className={styles.container}>
        <h1>Invoices</h1>
        {invoices &&
          invoices.map((order) => <Invoice key={order._id} order={order} />)}
      </div>
    </div>
  );

};

export default ViewInvoices;