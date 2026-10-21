import React from "react";
import styles from "./styles/OrderFormTable.module.css";

export default function OrderFormTable({
  fields_len,
  children,
  records_len,
}: {
  fields_len: number;
  records_len: number;
  children: any;
}) {
  return (
    <div
      style={{
        gridTemplateRows: `repeat(${records_len + 1},1fr)`,
        gridTemplateColumns: `repeat(${fields_len + 1},max-content)`,
      }}
      className={styles.recordTable}
    >
      {children}
    </div>
  );
}
