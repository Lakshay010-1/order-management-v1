import React from "react";
import styles from "./styles/OrderGridCell.module.css";

export default function OrderGridCell({
  title,
  gridArea,
  children,
}: {
  title: string;
  gridArea: string;
  children: any;
}) {
  return (
    <div style={{ gridArea: gridArea }} className={styles.cell}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.contentContainer}>{children}</div>
    </div>
  );
}
