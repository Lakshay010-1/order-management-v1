import React, { type ChangeEvent } from "react";
import styles from "./styles/HardwareGridData.module.css";
import type { Order } from "../types/Order";
import type { FieldKey } from "../types/FieldKey";
import { compareDates } from "../utils/compareDates";

export default function HardwareGridData({
  fields,
  order,
  formatDate,
  updateOrder,
  editMode,
  children,
  fieldError,
}: {
  fields: Array<FieldKey>;
  order: Order;
  formatDate: (value: string) => string;
  updateOrder: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  editMode: boolean;
  children: any;
  fieldError: boolean;
}) {
  return (
    <div
      className={styles.hardwareDetails}
      // style={{ gridTemplateRows: `repeat(${fields.length},1fr)` }}
    >
      {fields.map((d, idx) => {
        const isDate = d.type == "date";
        const field = d.key as keyof Order;
        const value =
          d.type == "date" ? formatDate(order[field]) : order[field];
        const updatedValue =
          d.type === "date" ? compareDates(order.po_date, value) : value;
        const min =
          d.type == "date" || d.type == "number"
            ? {
                min: d.type == "date" ? formatDate(order.po_date) : 0,
              }
            : {};
        return (
          // <div
          //   style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
          // >
          <React.Fragment key={idx}>
            <p key={d.key + "p"} className={styles.keyOne}>
              {d.name}
              <span className="text-red-600">{d?.required && "*"}</span>
            </p>
            <div>
              {d.type == "select" ? (
                children
              ) : (
                <input
                  {...min}
                  style={
                    (value && !updatedValue) || fieldError
                      ? {
                          border: "1px solid red",
                        }
                      : {}
                  }
                  key={d.key + "input"}
                  type={isDate ? "date" : "text"}
                  className={styles.valueOne}
                  disabled={!editMode}
                  value={value && updatedValue != value ? value : updatedValue}
                  onChange={(e) =>
                    updateOrder((prev) => {
                      return {
                        ...prev,
                        [d.key]: isDate
                          ? formatDate(e.target.value)
                          : e.target.value,
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
