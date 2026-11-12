import React from "react";
import styles from "./styles/OrderGridCell.module.css";

export default function OrderGridCell({
  title,
  gridArea,
  color,
  children,
}: {
  title: string;
  gridArea: string;
  color?: string;
  children: any;
}) {
  return (
    <div style={{ gridArea: gridArea }} className={styles.cell}>
      <h1
        style={{ ...(color ? { backgroundColor: color } : {}) }}
        className={styles.title}
      >
        {title}
      </h1>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
