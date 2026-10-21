import React from "react";
import styles from "./styles/OrderGridCell.module.css";

export default function OrderGridCell({
  title,
  color,
  gridArea,
  children,
}: {
  color: string;
  title: string;
  gridArea: string;
  children: any;
}) {
  return (
    <div style={{ gridArea: gridArea }} className={styles.cell}>
      <h1 style={{ fontWeight: "normal", backgroundColor: color }}>{title}</h1>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
