import React, { useState } from "react";
import styles from "./styles/OrderFormServices.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { v4 as uuidv4 } from "uuid";

export default function OrderFormServies({
  fields,
  handleOrderServicesChange,
  orderServices,
  formatDate,
}: {
  fields: Array<any>;
  handleOrderServicesChange: (value: any) => void;
  orderServices: Array<any>;
  formatDate: (val: any) => string;
}) {
  const addDataInitialState = {
    id: -1,
    description: "",
    date: new Date(),
  };

  const [addData, setAddData] = useState(addDataInitialState);

  function clearSelections() {
    setAddData(addDataInitialState);
  }

  return (
    <div className={styles.container}>
      <div className={styles.totalServicesP}>
        <p>
          Total Serv  ices to give
          {/* Total Services Required: <span>{orderServices.length}</span> */}
        </p>
        <input />
      </div>
      <div
        style={{
          gridTemplateRows: `repeat(${orderServices.length + 1},1fr)`,
        }}
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

          const minimumNumVal = type == "number" ? { min: 0 } : {};
          return (
            <input
              {...minimumNumVal}
              key={fieldIdx + key}
              placeholder={name}
              value={type == "date" ? formatDate(addData[key]) : addData[key]}
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
            handleOrderServicesChange((prev) => {
              const updatedorderServices = [
                ...prev,
                { ...addData, id: uuidv4() },
              ];
              clearSelections();
              return updatedorderServices;
            })
          }
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

                const updatedValue = type == "date" ? formatDate(value) : value;
                return (
                  <input
                    key={fieldIdx + key}
                    type={type}
                    value={updatedValue}
                    className="valueOne"
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
                className={`${styles.actionBtn} ${styles.red} ${styles.border1}`}
                onClick={() =>
                  handleOrderServicesChange((prev) => {
                    return prev.filter((p) => p.id !== oService.id);
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
