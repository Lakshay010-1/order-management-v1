import React, { type ChangeEvent } from "react";
import type { Order } from "../types/Order";
import styles from "./styles/SoftwareGridData.module.css";

interface RowDataFormat {
  key: string;
  name: string;
  type: string;
  required?: boolean;
}
const softwareData: Array<RowDataFormat> = [
  {
    name: "Installation Date",
    key: "software_installation_date",
    type: "date",
  },
  {
    name: "Expected Installation Date",
    key: "software_installation_expected_date",
    type: "date",
    required: true,
  },
  {
    name: "Installation Status",
    key: "software_installation_status",
    type: "select",
    required: true,
  },
];

export default function SoftwareGridData({
  order,
  formatDate,
  updateOrder,
  editMode,
  children,
}: {
  order: Order;
  formatDate: (value: string) => string;
  updateOrder: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  editMode: boolean;
  children: any;
}) {
  return (
    <div
      // style={{ gridTemplateRows: `repeat(${softwareData.length},1fr)` }}
      className={styles.softwareDetails}
    >
      {softwareData.map((d, idx) => {
        const isDate = d.type == "date";
        const field = d.key as keyof Order;
        const value = order[field];
        let inputValue;
        inputValue = isDate ? formatDate(value) : value;
        return (
          // <div
          //   style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
          // >
          <React.Fragment key={idx}>
            <p key={d.key} className={styles.keyOne}>
              {d.name}
              <span className="text-red-600">{d?.required && "*"}</span>
            </p>
            <div>
              {d.type == "select" ? (
                children
              ) : (
                <input
                  key={d.key + "input"}
                  type={isDate ? "date" : "text"}
                  className={styles.valueOne}
                  disabled={!editMode}
                  value={inputValue}
                  onChange={(e) =>
                    updateOrder((prev) => {
                      return {
                        ...prev,
                        [d.key]: e.target.value,
                      };
                    })
                  }
                />
              )}
            </div>
          </React.Fragment>
          // </div>
        );
      })}
    </div>
  );
}
