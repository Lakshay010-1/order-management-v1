import React, { type ChangeEvent } from "react";
import styles from "./styles/HardwareGridData.module.css";
import type { Order } from "../types/Order";

interface RowDataFormat {
  key: string;
  // value: string;
  name: string;
}

const hardwareData: Array<RowDataFormat> = [
  { name: "Installation Date", key: "hardware_installation_date" },
  { name: "Installation Status", key: "hardware_installation_status" },
];

export default function HardwareGridData({
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
      className={styles.hardwareDetails}
      style={{ gridTemplateRows: `repeat(${hardwareData.length},1fr)` }}
    >
      {hardwareData.map((d, idx) => {
        const isDate = d.key.toLowerCase().includes("date");
        const field = d.key as keyof Order;
        const value = order[field];
        let inputValue = isDate ? formatDate(value) : value;
        return (
          // <div
          //   style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
          // >
          <React.Fragment key={idx}>
            <p key={d.key + "p"} className={styles.keyOne}>
              {d.name}
            </p>
            <div>
              {d.key == "hardware_installation_status" ? (
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
            {/* </div> */}
          </React.Fragment>
        );
      })}
    </div>
  );
}
