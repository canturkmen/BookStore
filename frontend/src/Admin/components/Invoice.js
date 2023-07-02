import React, { useRef } from "react";
import styles from "./Invoice.module.css";
import printStyles from "./InvoicePrint.module.css";
import html2pdf from "html2pdf.js";

const Invoice = ({ order }) => {
  const invoiceRef = useRef();

  const formatDate = (date) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${
      newDate.getMonth() + 1
    }/${newDate.getFullYear()}`;
  };

  const generatePrintableHTML = () => {
    const printableHTML = `
      <div class=${printStyles.invoice_print}>
        <h2>Invoice #${order?._id ?? "not-available"}</h2>
        <p>${formatDate(order?.createdAt ?? new Date())}</p>
        <h3>User Information</h3>
        <p>Name: ${order?.userId?.username ?? "not-available"}</p>
        <p>Email: ${order?.userId?.email ?? "not-available"}</p>
        <p>Tax ID: ${order?.userId?.taxID ?? "not-available"}</p>
        <p>Address: ${order?.userId?.address ?? "not-available"}</p>
        ${
          order?.items
            ? order.items
                .map(
                  (item, index) => `
                <div>
                  <span>${item?.bookId?.title ?? "This book was deleted from shop"}</span>
                  <span>$${item?.bookId?.price ?? "Price information is not available"} x ${
                    item?.quantity ?? 0
                  }</span>
                </div>
              `
                )
                .join("")
            : "No items available"
        }
        <p>Total: $${order?.totalAmount ?? 0}</p>
      </div>
    `;
    return printableHTML;
  };

  const downloadAsPDF = () => {
    const opt = {
      margin: 0,
      filename: `Invoice-${order?._id ?? "not-available"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    const printableHTML = generatePrintableHTML();
    html2pdf().set(opt).from(printableHTML).save();
  };

  return (
    <div className={styles.invoice} ref={invoiceRef}>
      <button className={styles.download_button} onClick={downloadAsPDF}>
        Download as PDF
      </button>
      <div className={styles.invoice__header}>
        <h2 className={styles.invoice__title}>
          Invoice #{order?._id ?? "not-available"}
        </h2>
        <span className={styles.invoice__date}>
          {formatDate(order?.createdAt ?? new Date())}
        </span>
      </div>
      <div className={styles.invoice__user}>
        <h3 className={styles.user__title}>User Information</h3>
        <p>Name: {order?.userId?.username ?? "not-available"}</p>
        <p>Email: {order?.userId?.email ?? "not-available"}</p>
        <p>Tax ID: {order?.userId?.taxID ?? "not-available"}</p>
        <p>Address: {order?.userId?.address ?? "not-available"}</p>
      </div>
      <div className={styles.invoice__items}>
        {order?.items?.map((item, index) => (
          <div key={index} className={styles.invoice__item}>
            <span>{item?.bookId?.title ?? "This book was deleted from shop"}</span>
            <span>
              ${item?.bookId?.price ?? "Price information is not available"} x {item?.quantity ?? 0}
            </span>
          </div>
        )) ?? "No items available"}
      </div>
      <div className={styles.invoice__total}>
        <span>Total</span>
        <span>${order?.totalAmount ?? 0}</span>
      </div>
    </div>
  );
};

export default Invoice;
