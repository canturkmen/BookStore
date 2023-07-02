import React from "react";
import ReactDOM from "react-dom";
import styles from "./ErrorModal.module.css";
import Backdrop from "./Backdrop";

const ErrorModal = (props) => {
  return (
    <>
      {props.show &&
        ReactDOM.createPortal(
          <div className={styles.modal}>
            <div className={styles.modal__content}>
              <h2>{props.title}</h2>
              <p>{props.message}</p>
              <button onClick={props.onClose}>Close</button>
            </div>
          </div>,
          document.getElementById("overlays")
        )}
    </>
  );
};

export default ErrorModal;
