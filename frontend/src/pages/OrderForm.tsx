import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles/OrderForm.module.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function InputField(name, value, onChangeFn, type) {
  if (type == "text" || type == "number") {
    return (
      <input
        className={styles.formInput}
        type={type}
        name={name}
        onChange={onChangeFn}
        value={type == "number" ? Number(value) : value}
      />
    );
  } else if (type == "textarea") {
    return (
      <textarea
        className={styles.formInput}
        name={name}
        onChange={onChangeFn}
        value={value}
      />
    );
  } else if (type == "date") {
    return (
      <input
        className={styles.formInput}
        type="date"
        name={name}
        onChange={onChangeFn}
        value={value}
      />
    );
  } else if (type == "select-status") {
    return (
      <select name={name} value={value} onChange={onChangeFn}>
        <option id={styles.bgLightRed} value="Pending">
          Pending
        </option>
        <option id={styles.bgLightYellow} value="In Progress">
          In Progress
        </option>
        <option id={styles.bgLightGreen} value="Complete">
          Complete
        </option>
      </select>
    );
  }
}

function labelField(labelText) {
  return <h2 className={styles.formLabel}>{labelText}</h2>;
}

function FormRow(name, value, inputChangeFn, inputType) {
  return (
    <>
      {labelField(name)}
      {InputField(name, value, inputChangeFn, inputType)}
    </>
  );
}

export default function OrderForm(props) {
  const { id: orderId } = useParams();
  const order = props.orders.filter((o) => o["Order Number"] == orderId)[0];
  delete order["S.No."];
  const [orderDetails, setOrderDetails] = useState(order);
  const navigate = useNavigate();

  function handleInputChange(e) {
    setOrderDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  function handleFormSubmit(e) {
    e.preventDefault();
  }

  function handleBackBtnClick() {
    navigate("/dashboard");
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.backButton} onClick={() => handleBackBtnClick()}>
          <ArrowBackIcon />
        </div>
        <h1 className={styles.title}>
          Order Details ( Id: {orderDetails["Order Number"]} )
        </h1>
      </div>
      <form className={styles.orderForm} onSubmit={(e) => handleFormSubmit(e)}>
        {/* <h2>Party Name:</h2>
        <h2>Items:</h2>
        <h2>Payment:</h2>
        <h2>Payment Date:</h2>
        <h2>Hardware:</h2>
        <h2>Hardware Dispatch Date:</h2>
        <h2>Software Approx. Date:</h2>
        <h2>Software Install Date:</h2>
        <h2>Status: </h2> */}
        <div className={styles.formRows}>
          {Object.entries(order).map(([key, value]) => {
            if (key == "Order Number") {
              return;
            }
            let type = "text";
            if (key == "Payment") {
              type = "number";
            } else if (
              key == "Payment Date" ||
              key == "Hardware Dispatch Date" ||
              key == "Software Approx Date" ||
              key == "Software Install Date"
            ) {
              type = "date";
            } else if (key == "Status") {
              type = "select-status";
            }

            return FormRow(key, orderDetails[key], handleInputChange, type);
          })}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
