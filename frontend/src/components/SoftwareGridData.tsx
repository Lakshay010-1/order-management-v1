import React, { type ChangeEvent } from "react";
import type { Order } from "../types/Order";
import styles from "./styles/SoftwareGridData.module.css";
import type { FieldKey } from "../types/FieldKey";
import { compareDates } from "../utils/compareDates";

export default function SoftwareGridData({
  fields,
  order,
  formatDate,
  updateOrder,
  editMode,
  fieldError,
  children,
}: {
  fields: Array<FieldKey>;
  order: Order;
  formatDate: (value: string) => string;
  updateOrder: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
  editMode: boolean;
  fieldError: boolean;
  children: any;
}) {
  return (
    <div
      // style={{ gridTemplateRows: `repeat(${softwareData.length},1fr)` }}
      className={styles.softwareDetails}
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
                  {...min}
                  style={
                    (value && !updatedValue) || fieldError
                      ? {
                          border: "1px solid red",
                        }
                      : {}
                  }
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
          </React.Fragment>
          // </div>
        );
      })}
    </div>
  );
}
