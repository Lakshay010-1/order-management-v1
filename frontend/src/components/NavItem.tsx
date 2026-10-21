import React from "react";
import styles from "./styles/NavItem.module.css";

export default function NavItem({
  item,
  handleClick,
  itemCount,
  navItemSelected,
}: {
  item: string;
  navItemSelected: string;
  itemCount: number;
  handleClick: (item: string) => void;
}) {
  return (
    <div
      onClick={() => handleClick(item)}
      className={`${styles.navItem} ${navItemSelected && navItemSelected === item ? styles.navItemSelected : ""}`}
    >
      <h3>{item}</h3>
      <h4 className={styles.recordCount}>{itemCount}</h4>
    </div>
  );
}
