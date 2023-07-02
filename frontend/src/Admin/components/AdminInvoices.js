import React, { useState, useEffect, useCallback } from "react";
import Invoice from "./Invoice";
import styles from "./AdminInvoices.module.css";
import SideBar from "./SideBar";

const AdminInvoice = () => {
  const [orders, setOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/admin/sales-manager/invoices/${startDate}/${endDate}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  }, [startDate, endDate]);

  return (
    <div className={styles.list}>
      <SideBar />
      <div className={styles.list_container}>
        <div className={styles.invoice_list}>
          <div className={styles.invoice_list__header}>
            <div className={styles.date_picker}>
              <label htmlFor="start-date">Start Date:</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label htmlFor="end-date">End Date:</label>
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <button className={styles.search_button} onClick={fetchOrders}>
              Search
            </button>
          </div>
          <div>
            {orders.map((order) => (
              <Invoice key={order?._id ?? "not-available"} order={order} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoice;
