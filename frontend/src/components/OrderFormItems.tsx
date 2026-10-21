import React, { useState } from "react";
import type { NewOrder } from "../types/NewOrder";
import styles from "./styles/OrderFormItems.module.css";
import BasicSelect from "./Select";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

export default function OrderFormItems({
  fields,
  handleOrderItemsChange,
  orderItems,
  itemsOptions,
  formatDate,
}: {
  fields: Array<any>;
  handleOrderItemsChange: (value: any) => void;
  orderItems: Array<any>;
  itemsOptions: Array<{ id: number; value: string }>;
  formatDate: (val: any) => string;
}) {
  const addDataInitialState = { item_id: -1, quantity: 0, date: new Date() };
  const selectedOptionInitialState = {
    id: -1,
    value: "",
  };
  const [addData, setAddData] = useState(addDataInitialState);
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
    <div
      style={{
        gridTemplateRows: `repeat(${orderItems.length + 1},1fr)`,
      }}
      className={styles.itemsDetails}
    >
      {fields.map((field, fieldIdx) => (
        <p className="keyOne" key={fieldIdx}>
          {field.name}
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

        const minimumNumVal = type == "number" ? { min: 0 } : {};
        return key == "item_id" ? (
          <BasicSelect
            key={fieldIdx + type}
            options={itemsOptions}
            selectedOption={selectedItemOption}
            handleOptionChange={handleItemOptionChange}
          />
        ) : (
          <input
            {...minimumNumVal}
            key={fieldIdx + type}
            placeholder={name}
            value={addData[key]}
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
        onClick={() =>
          handleOrderItemsChange((prev) => {
            const updatedOrderItems = [
              ...prev,
              { id: crypto.randomUUID(), ...addData },
            ];
            clearSelections();
            return updatedOrderItems;
          })
        }
      >
        <AddIcon />
      </button>

      {orderItems.map((oItem, oItemIdx) => {
        return (
          <React.Fragment key={oItemIdx}>
            {fields.map((field, fieldIdx) => {
              const { key, type, name } = field;
              const value = oItem[key];

              const minimumNumVal = type == "number" ? { min: 0 } : {};
              const updatedValue =
                type == "date"
                  ? formatDate(value)
                  : type == "select"
                    ? itemsOptions.filter((i) => i.id == oItem[key])[0]
                    : value;
              return (
                <input
                  {...minimumNumVal}
                  key={fieldIdx + "input"}
                  type={type == "select" ? "text" : type}
                  disabled={type == "select"}
                  value={
                    type == "select"
                      ? updatedValue
                        ? updatedValue.value
                        : ""
                      : updatedValue
                  }
                  className="valueOne"
                  onChange={(e) =>
                    handleOrderItemsChange((prev) => {
                      return prev.map((p) => {
                        if (p.id == oItem.id) {
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
              className={`${styles.actionBtn} ${styles.red} ${styles.border1}`}
              onClick={() =>
                handleOrderItemsChange((prev) => {
                  return prev.filter((p) => p.id !== oItem.id);
                })
              }
            >
              <DeleteIcon />
            </button>
          </React.Fragment>
        );
      })}
      {/* {fields.map((field, fieldIdx) => {
        const { name, type, key } = field;
        const updatedKey = key == "item" ? "item_id" : key;
        const updatedVal =
          updatedKey == "date"
            ? addData[updatedKey].toISOString().split("T")[0]
            : addData[updatedKey];
        return type == "select" ? (
          <BasicSelect
            options={itemsOptions}
            selectedOption={selectedItemOption}
            handleOptionChange={handleItemOptionChange}
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
  );
}
