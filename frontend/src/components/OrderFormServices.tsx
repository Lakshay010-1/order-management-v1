import React, { useRef, useState } from "react";
import styles from "./styles/OrderFormServices.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 as uuidv4 } from "uuid";
import type { NewOrder_a } from "../types/Order";
import { compareDates } from "../utils/compareDates";

export default function OrderFormServies({
  fields,
  order,
  handleOrderChange,
  handleOrderServicesChange,
  orderServices,
  fieldError,
  formatDate,
}: {
  fields: Array<any>;
  fieldError: boolean;
  order: NewOrder_a;
  handleOrderChange: (val: any) => void;
  handleOrderServicesChange: (value: any) => void;
  orderServices: Array<any>;
  formatDate: (val: any) => string;
}) {
  const addDataInitialState = {
    id: -1,
    description: "",
    date: "",
  };

  const [addData, setAddData] = useState(addDataInitialState);
  const [error, setError] = useState(false);
  const [doubleClickDelId, setDoubleClickDelId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearSelections() {
    setAddData(addDataInitialState);
  }

  return (
    <div className={styles.container}>
      <div className={styles.totalServicesP}>
        <p>Total Services</p>
        <input
          type="number"
          min={0}
          style={
            fieldError && !order.total_services
              ? {
                  border: "1px solid red",
                }
              : {}
          }
          className={styles.valueOne}
          value={!order.total_services ? 0 : order.total_services}
          onChange={(e) =>
            handleOrderChange((prev) => {
              return { ...prev, total_services: e.target.value };
            })
          }
        />
      </div>
      <div
        // style={{
        //   gridTemplateRows: `repeat(${orderServices.length + 1},1fr)`,
        // }}
        className={styles.servicesDetails}
      >
        <p className="keyOne"> S.No.</p>
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
        <p>~</p>
        {fields.map((field, fieldIdx) => {
          const { type, name, key } = field;

          const val = addData[key];

          const updatedValue =
            type == "date" ? compareDates(order["po_date"], val) : val;

          const minimumValue =
            type == "date" ? formatDate(order["po_date"]) : 0;
          const min =
            type == "date" || type == "number" ? { min: minimumValue } : {};

          addData[key] = updatedValue;

          return (
            <input
              style={{
                border: field.required && error ? "1px solid red" : "",
              }}
              {...min}
              key={fieldIdx + key}
              placeholder={name}
              value={updatedValue}
              type={type}
              onChange={(e) =>
                setAddData((prev) => {
                  return { ...prev, [key]: e.target.value };
                })
              }
            />
          );
        })}
        <button
          className={`${styles.actionBtn} ${styles.green}`}
          onClick={() => {
            if (!addData.date) {
              setError(true);
              return;
            }
            setError(false);
            handleOrderServicesChange((prev) => {
              const updatedorderServices = [
                ...prev,
                { ...addData, id: uuidv4() },
              ];
              clearSelections();
              return updatedorderServices;
            });
          }}
        >
          <AddIcon />
        </button>

        {orderServices.map((oService, oServiceIdx) => {
          return (
            <React.Fragment key={oServiceIdx}>
              <p>{oServiceIdx + 1}</p>
              {fields.map((field, fieldIdx) => {
                const { key, type, name } = field;
                const value = oService[key];
                const updatedValue =
                  type == "date"
                    ? compareDates(order["po_date"], value)
                    : value;

                const minimumValue =
                  type == "date" ? formatDate(order["po_date"]) : 0;

                const min =
                  type == "date" || type == "number"
                    ? { min: minimumValue }
                    : {};

                // oService[key] = updatedValue;

                return (
                  <input
                    {...min}
                    style={
                      updatedValue != value
                        ? {
                            border: "1px solid red",
                          }
                        : {}
                    }
                    key={fieldIdx + key}
                    type={type}
                    value={updatedValue != value ? value : updatedValue}
                    className={styles.valueOne}
                    onChange={(e) =>
                      handleOrderServicesChange((prev) => {
                        return prev.map((p) => {
                          if (p.id == oService.id) {
                            return { ...p, [key]: e.target.value };
                          }
                          return p;
                        });
                      })
                    }
                  />
                );
              })}

              <button
                className={`${styles.actionBtn} ${doubleClickDelId == oService.id ? styles.blackRed : styles.red}`}
                onClick={() => {
                  if (doubleClickDelId == oService.id) {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    setDoubleClickDelId(null);
                    handleOrderServicesChange((prev) => {
                      return prev.filter((p) => p.id !== oService.id);
                    });
                  } else {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setDoubleClickDelId(oService.id);

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
        {/* {fields.map((field, fieldIdx) => {
        const { name, type, key } = field;
        const updatedKey = key == "service" ? "service_id" : key;
        const updatedVal =
          updatedKey == "date"
            ? addData[updatedKey].toISOString().split("T")[0]
            : addData[updatedKey];
        return type == "select" ? (
          <BasicSelect
            options={servicesOptions}
            selectedOption={selectedServiceOption}
            handleOptionChange={handleServiceOptionChange}
          />
        ) : (
          <input
            type={type}
            value={addData[updatedKey]}
            onChange={(e) =>
              setAddData((prev) => {
                return { ...prev, [updatedKey]: e.target.value };
              })
            }
          />
        );
      })} */}
      </div>
    </div>
  );
}
