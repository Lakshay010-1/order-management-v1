import React, { useState } from "react";
import styles from "./styles/OrderFormHardwareIns.module.css";
import type { NewOrder } from "../types/NewOrder";
import BasicSelect from "./Select";
import { compareDates } from "../utils/compareDates";

const initialState = { id: "", value: "" };

export default function OrderFormHardwareIns({
  fields,
  order,
  statusesOptions,
  fieldError,
  handleChange,
  formatDate,
}: {
  fields: Array<{
    name: string;
    type: string;
    key: string;
    required?: boolean;
  }>;
  fieldError: boolean;
  order: NewOrder;
  statusesOptions: Array<{ id: any; value: any }>;
  handleChange: (val: any) => void;
  formatDate: (val: any) => string;
}) {
  const [selectedStatus, setSelectedStatus] = useState(initialState);

  function handleStatusChange(id: number) {
    handleChange((prev) => {
      return { ...prev, hardware_installation_status_id: id };
    });
    setSelectedStatus(statusesOptions.filter((s) => s.id === id)[0]);
  }

  return (
    <div
      className={styles.hardwareDetails}
      // style={{
      //   gridTemplateRows: `repeat(${fields.length},1fr)`,
      // }}
    >
      {fields.map((field) => {
        const value = order[field.key as keyof NewOrder];
        const updatedValue =
          field.type === "date" ? compareDates(order.po_date, value) : value;
        const min =
          field.type == "date" || field.type == "number"
            ? {
                min: field.type == "date" ? formatDate(order.po_date) : 0,
              }
            : {};

        // handleChange((prev) => {
        //   return { ...prev, [field.key]: updatedValue };
        // });

        return (
          <React.Fragment key={field.key}>
            <p>
              {field.name}
              <span className="text-red-600">{field?.required && "*"}</span>
            </p>
            {field.type === "select" ? (
              <BasicSelect
                options={statusesOptions}
                handleOptionChange={handleStatusChange}
                selectedOption={selectedStatus}
                required={fieldError && field?.required && !selectedStatus.id}
              />
            ) : (
              <input
                type={field.type}
                {...min}
                style={
                  fieldError && field?.required && !updatedValue
                    ? {
                        border: "1px solid red",
                      }
                    : {}
                }
                value={updatedValue}
                onChange={(e) =>
                  handleChange((prev) => {
                    return { ...prev, [field.key]: e.target.value };
                  })
                }
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
