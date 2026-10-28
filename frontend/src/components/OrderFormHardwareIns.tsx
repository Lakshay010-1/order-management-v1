import React, { useState } from "react";
import styles from "./styles/OrderFormHardwareIns.module.css";
import type { NewOrder } from "../types/NewOrder";
import BasicSelect from "./Select";

const hardwareInstallationKeys = [
  {
    name: "Expected Installation Date",
    type: "date",
    key: "hardware_installation_expected_date",
    required: true,
  },
  {
    name: "Installation Date",
    type: "date",
    key: "hardware_installation_date",
  },
  {
    name: "Installation Status",
    type: "select",
    key: "hardware_installation_status_id",
    required: true,
  },
];

const initialState = { id: -1, value: "" };

export default function OrderFormHardwareIns({
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
      return { ...prev, hardware_installation_status_id: id };
    });
    setSelectedStatus(statusesOptions.filter((s) => s.id === id)[0]);
  }

  return (
    <div
      className={styles.hardwareDetails}
      // style={{
      //   gridTemplateRows: `repeat(${hardwareInstallationKeys.length},1fr)`,
      // }}
    >
      {hardwareInstallationKeys.map((field) => {
        const value = order[field.key as keyof NewOrder];
        const updatedValue = field.type === "date" ? formatDate(value) : value;

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
