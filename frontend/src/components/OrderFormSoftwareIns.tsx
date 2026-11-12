import React, { useState } from "react";
import type { NewOrder } from "../types/NewOrder";
import styles from "./styles/OrderFormSoftwareIns.module.css";
import BasicSelect from "./Select";
import { compareDates } from "../utils/compareDates";

const initialState = { id: "", value: "" };

export default function OrderFormSoftwareIns({
  fields,
  order,
  fieldError,
  statusesOptions,
  handleChange,
  formatDate,
}: {
  fields: Array<{
    name: string;
    type: string;
    key: string;
    required?: boolean;
  }>;
  order: NewOrder;
  fieldError: boolean;
  statusesOptions: Array<{ id: any; value: any }>;
  handleChange: (val: any) => void;
  formatDate: (val: any) => string;
}) {
  const [selectedStatus, setSelectedStatus] = useState(initialState);

  function handleStatusChange(id: number) {
    handleChange((prev) => {
      return { ...prev, software_installation_status_id: id };
    });
    setSelectedStatus(statusesOptions.filter((s) => s.id === id)[0]);
  }

  return (
    <div
      // style={{
      //   gridTemplateRows: `repeat(${fields.length},1fr)`,
      // }}
      className={styles.softwareDetails}
    >
      {fields.map((field, fieldIdx) => {
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
          <React.Fragment key={fieldIdx}>
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
                {...min}
                type={field.type}
                value={updatedValue}
                style={
                  fieldError && field?.required && !updatedValue
                    ? {
                        border: "1px solid red",
                      }
                    : {}
                }
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
