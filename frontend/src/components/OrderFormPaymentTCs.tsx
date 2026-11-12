import React, { useRef, useState } from "react";
import styles from "./styles/OrderFormPaymentTCs.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 as uuidV4 } from "uuid";

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
  const [doubleClickDelId, setDoubleClickDelId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          <p className={styles.keyOne} key={fieldIdx}>
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
          const attributes = {
            style:
              error && field?.required
                ? {
                    border: "1px solid red",
                  }
                : {},
            className: styles.valueOne,
            placeholder: name,
            value: addData[key],
            checked: addData[key],
            type,
            onChange: (e) =>
              setAddData((prev) => {
                return {
                  ...prev,
                  [key]: key == "fulfilled" ? !prev[key] : e.target.value,
                };
              }),
          };

          return <input key={fieldIdx + type} {...attributes} />;
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
              const updatedOrderItems = [...prev, { id: uuidV4(), ...addData }];
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
                const attributes = {
                  key: fieldIdx + "input",
                  type: type,
                  value: value,
                  checked: value,
                  className: styles.valueOne,
                  onChange: (e) =>
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
                    }),
                };
                return <input {...attributes} />;
              })}
              <button
                className={`${styles.actionBtn} ${doubleClickDelId == oPayTC.id ? styles.blackRed : styles.red}`}
                onClick={() => {
                  if (doubleClickDelId == oPayTC.id) {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    setDoubleClickDelId(null);
                    handleOrderPaymentTCsChange((prev) => {
                      return prev.filter((p) => p.id !== oPayTC.id);
                    });
                  } else {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setDoubleClickDelId(oPayTC.id);

                    timeoutRef.current = setTimeout(() => {
                      setDoubleClickDelId(null);
                      timeoutRef.current = null;
                    }, 1500);
                  }
                }}
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
