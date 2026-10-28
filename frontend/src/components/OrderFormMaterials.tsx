import React, { useState } from "react";
import styles from "./styles/OrderFormMaterials.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import BasicSelect from "./Select";

export default function OrderFormMaterials({
  fields,
  itemsOptions,
  orderMaterials,
  handleOrderMaterialsChange,
  formatDate,
}: {
  fields: Array<any>;
  itemsOptions: Array<{ id: number; value: string }>;
  orderMaterials: Array<any>;
  handleOrderMaterialsChange: (value: any) => void;
  formatDate: (val: any) => string;
}) {
  const addDataInitialState = {
    item_id: -1,
    quantity: 0,
    order_date: "",
    purchase_date: "",
    deliver_date: "",
  };
  const selectedOptionInitialState = {
    id: -1,
    value: "",
  };
  const [addData, setAddData] = useState(addDataInitialState);
  const [error, setError] = useState(false);
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
          const minimumNumVal = type == "number" ? { min: 0 } : {};
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
              required={field?.required}
              key={fieldIdx + type}
              placeholder={name}
              value={addData[key]}
              type={type}
              {...minimumNumVal}
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

        {orderMaterials.map((oMat, oMatIdx) => {
          return (
            <React.Fragment key={oMatIdx}>
              {fields.map((field, fieldIdx) => {
                const { key, type, name } = field;
                const value = oMat[key];
                const minimumNumVal = type == "number" ? { min: 0 } : {};
                const updatedValue =
                  type == "date"
                    ? formatDate(value)
                    : type == "select"
                      ? itemsOptions.filter((i) => i.id == oMat[key])[0]
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
                className={`${styles.actionBtn} ${styles.red} ${styles.border1}`}
                onClick={() =>
                  handleOrderMaterialsChange((prev) => {
                    return prev.filter((p) => p.id !== oMat.id);
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
