import React, { useRef, useState } from "react";
import styles from "./styles/OrderFormMaterials.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import BasicSelect from "./Select";
import { v4 as uuidV4 } from "uuid";
import type { NewOrder_a } from "../types/Order";
import { compareDates } from "../utils/compareDates";

const minimumDates: Record<string, { date: string }> = {
  purchase_date: { date: "order_date" },
  deliver_date: { date: "purchase_date" },
};

export default function OrderFormMaterials({
  order,
  fields,
  itemsOptions,
  orderMaterials,
  handleOrderMaterialsChange,
  formatDate,
}: {
  order: NewOrder_a;
  fields: Array<any>;
  itemsOptions: Array<{ id: number; value: string }>;
  orderMaterials: Array<any>;
  handleOrderMaterialsChange: (value: any) => void;
  formatDate: (val: any) => string;
}) {
  const addDataInitialState = {
    item_id: "",
    quantity: 0,
    order_date: new Date().toISOString().split("T")[0],
    purchase_date: "",
    deliver_date: "",
  };
  const selectedOptionInitialState = {
    id: "",
    value: "",
  };
  const [addData, setAddData] = useState(addDataInitialState);
  const [error, setError] = useState(false);
  const [doubleClickDelId, setDoubleClickDelId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedItemOption, setSelectedItemOption] = useState(
    selectedOptionInitialState,
  );

  function handleItemOptionChange(id: number) {
    setSelectedItemOption(itemsOptions.filter((i) => i.id === id)[0]);
    setAddData((prev) => {
      return { ...prev, item_id: id };
    });
  }

  function clearSelections() {
    setAddData(addDataInitialState);
    setSelectedItemOption(selectedOptionInitialState);
  }

  return (
    <div className={styles.container}>
      <div
        style={{
          gridTemplateRows: `repeat(${orderMaterials.length + 1},1fr)`,
        }}
        className={styles.materialsDetails}
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
          const val = addData[key];
          const minimumValue =
            type == "date"
              ? formatDate(
                  Object.hasOwn(minimumDates, key)
                    ? addData[minimumDates[key].date]
                    : order["po_date"],
                )
              : 0;
          const min =
            type == "date" || type == "number" ? { min: minimumValue } : {};

          const updatedValue =
            type == "date"
              ? Object.hasOwn(minimumDates, key)
                ? compareDates(addData[minimumDates[key].date], val)
                : compareDates(order["po_date"], val)
              : val;

          addData[key] = updatedValue;

          return key == "item_id" ? (
            <BasicSelect
              required={error}
              key={fieldIdx + type}
              options={itemsOptions}
              selectedOption={selectedItemOption}
              handleOptionChange={handleItemOptionChange}
            />
          ) : (
            <input
              style={
                error && field?.required
                  ? {
                      border: "1px solid red",
                    }
                  : {}
              }
              disabled={key == "deliver_date" && !addData["purchase_date"]}
              required={field?.required}
              key={fieldIdx + type}
              placeholder={name}
              value={updatedValue}
              type={type}
              {...min}
              onChange={(e) =>
                setAddData((prev) => {
                  return {
                    ...prev,
                    [key]:
                      type == "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  };
                })
              }
            />
          );
        })}
        <button
          className={`${styles.actionBtn} ${styles.green}`}
          onClick={() => {
            let isError = false;
            fields.forEach((field) => {
              if (field?.required && !addData[field.key]) {
                setError(() => true);
                isError = true;
                return;
              }
            });
            if (isError) {
              return;
            }
            setError(() => false);
            handleOrderMaterialsChange((prev) => {
              const updatedOrderItems = [...prev, { id: uuidV4(), ...addData }];
              clearSelections();
              return updatedOrderItems;
            });
          }}
        >
          <AddIcon />
        </button>

        {orderMaterials.map((oMat, oMatIdx) => {
          return (
            <React.Fragment key={oMatIdx}>
              {fields.map((field, fieldIdx) => {
                const { key, type, name } = field;
                const value = oMat[key];
                const min =
                  type == "date" || type == "number"
                    ? {
                        min:
                          type == "date"
                            ? formatDate(
                                Object.hasOwn(minimumDates, key)
                                  ? oMat[minimumDates[key].date]
                                  : order["po_date"],
                              )
                            : 0,
                      }
                    : {};

                const updatedValue =
                  type == "date"
                    ? Object.hasOwn(minimumDates, key)
                      ? compareDates(oMat[minimumDates[key].date], value)
                      : compareDates(order["po_date"], value)
                    : type == "select"
                      ? itemsOptions.filter((i) => i.id == oMat[key])[0]
                      : value;

                return (
                  <input
                    style={
                      type != "select" && updatedValue != value
                        ? { border: "1px solid red" }
                        : {}
                    }
                    {...min}
                    key={fieldIdx + "input"}
                    type={type == "select" ? "text" : type}
                    disabled={
                      type == "select" ||
                      (key == "deliver_date" && !oMat["purchase_date"])
                    }
                    value={
                      type == "select"
                        ? updatedValue
                          ? updatedValue.value
                          : ""
                        : updatedValue != value
                          ? value
                          : updatedValue
                    }
                    className={styles.valueOne}
                    onChange={(e) =>
                      handleOrderMaterialsChange((prev) => {
                        return prev.map((p) => {
                          if (p.id == oMat.id) {
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
                className={`${styles.actionBtn} ${doubleClickDelId == oMat.id ? styles.blackRed : styles.red}`}
                onClick={() => {
                  if (doubleClickDelId == oMat.id) {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                      timeoutRef.current = null;
                    }
                    setDoubleClickDelId(null);
                    handleOrderMaterialsChange((prev) => {
                      return prev.filter((p) => p.id !== oMat.id);
                    });
                  } else {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current);
                    }
                    setDoubleClickDelId(oMat.id);

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
