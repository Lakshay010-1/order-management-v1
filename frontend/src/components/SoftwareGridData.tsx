import React, { type ChangeEvent } from "react";
import type { Order } from "../types/Order";
import styles from "./styles/SoftwareGridData.module.css";

interface RowDataFormat {
  key: string;
  name: string;
}
const softwareData: Array<RowDataFormat> = [
  { name: "Installation Date", key: "software_installation_date" },
  { name: "Installation Status", key: "software_installation_status" },
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
      style={{ gridTemplateRows: `repeat(${softwareData.length},1fr)` }}
      className={styles.softwareDetails}
    >
      {softwareData.map((d, idx) => {
        const isDate = d.key.toLowerCase().includes("date");
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
            </p>
            <div>
              {d.key == "software_installation_status" ? (
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
                        [d.key.toLowerCase()]: e.target.value,
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
