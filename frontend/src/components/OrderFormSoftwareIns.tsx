import React, { useState } from "react";
import type { NewOrder } from "../types/NewOrder";
import styles from "./styles/OrderFormSoftwareIns.module.css";
import BasicSelect from "./Select";

const softwareInstallationKeys = [
  {
    name: "Installation Date",
    type: "date",
    key: "software_installation_date",
  },
  {
    name: "Installation Status",
    type: "select",
    key: "software_installation_status_id",
  },
];

const initialState = { id: -1, value: "" };

export default function OrderFormSoftwareIns({
  order,
  statusesOptions,
  handleChange,
  formatDate,
}: {
  order: NewOrder;
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
      style={{
        gridTemplateRows: `repeat(${softwareInstallationKeys.length},1fr)`,
      }}
      className={styles.softwareDetails}
    >
      {softwareInstallationKeys.map((field, fieldIdx) => {
        const value = order[field.key as keyof NewOrder];
        const updatedValue = field.type === "date" ? formatDate(value) : value;
        return (
          <React.Fragment key={fieldIdx}>
            <p>{field.name}</p>
            {field.type === "select" ? (
              <BasicSelect
                options={statusesOptions}
                handleOptionChange={handleStatusChange}
                selectedOption={selectedStatus}
              />
            ) : (
              <input
                type={field.type}
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
