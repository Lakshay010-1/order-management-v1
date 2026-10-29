import React, { useState } from "react";
import styles from "./styles/OrderFormPaymentTCs.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

export default function OrderFormPaymentTCs({
  po_type_id,
  fields,
  orderPaymentTCs,
  handleOrderPaymentTCsChange,
}: {
  po_type_id: number;
  fields: Array<any>;
  orderPaymentTCs: Array<any>;
  handleOrderPaymentTCsChange: (val: any) => void;
}) {
  const addDataInitialState = { fulfilled: false, term: "" };
  const [error, setError] = useState(false);
  const [addData, setAddData] = useState(addDataInitialState);

  function clearSelections() {
    setAddData(addDataInitialState);
  }

  return (
    <div
      className={styles.container}
      style={{ height: po_type_id == 1 ? "19rem" : "" }}
    >
      <div
        style={{
          gridTemplateRows: `repeat(${orderPaymentTCs.length + 1},1fr)`,
        }}
        className={styles.paymentstcsDetails}
      >
        {fields.map((field, fieldIdx) => (
          <p className="keyOne" key={fieldIdx}>
            {field.name}
            <span className="text-red-600">{field?.required && "*"}</span>
          </p>
        ))}
        <button
          className={`${styles.actionBtn} ${styles.red}`}
          onClick={() => clearSelections()}
        >
          <CancelIcon />
        </button>
        {fields.map((field, fieldIdx) => {
          const { type, name, key } = field;
          return (
            <input
              style={
                error && field?.required
                  ? {
                      border: "1px solid red",
                    }
                  : {}
              }
              className={styles.valueOne}
              key={fieldIdx + type}
              placeholder={name}
              value={addData[key]}
              checked={addData[key]}
              type={type}
              onChange={(e) =>
                setAddData((prev) => {
                  return {
                    ...prev,
                    [key]: key == "fulfilled" ? !prev[key] : e.target.value,
                  };
                })
              }
            />
          );
        })}
        <button
          className={`${styles.actionBtn} ${styles.green}`}
          onClick={() => {
            const { term } = addData;
            if (!term) {
              setError(true);
              return;
            }
            setError(false);
            handleOrderPaymentTCsChange((prev) => {
              const updatedOrderItems = [
                ...prev,
                { id: crypto.randomUUID(), ...addData },
              ];
              clearSelections();
              return updatedOrderItems;
            });
          }}
        >
          <AddIcon />
        </button>
        {orderPaymentTCs.map((oPayTC, oPayTCIdx) => {
          return (
            <React.Fragment key={oPayTCIdx}>
              {fields.map((field, fieldIdx) => {
                const { key, type } = field;
                const value = oPayTC[key];
                return (
                  <input
                    key={fieldIdx + "input"}
                    type={type}
                    value={value}
                    checked={value}
                    className={styles.valueOne}
                    onChange={(e) =>
                      handleOrderPaymentTCsChange((prev) => {
                        return prev.map((p) => {
                          if (p.id == oPayTC.id) {
                            return {
                              ...p,
                              [key]:
                                key == "fulfilled"
                                  ? !p.fulfilled
                                  : e.target.value,
                            };
                          }
                          return p;
                        });
                      })
                    }
                  />
                );
              })}
              <button
                className={`${styles.actionBtn} ${styles.red} ${styles.border1}`}
                onClick={() =>
                  handleOrderPaymentTCsChange((prev) => {
                    return prev.filter((p) => p.id !== oPayTC.id);
                  })
                }
              >
                <DeleteIcon />
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
