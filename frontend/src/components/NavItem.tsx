import React from "react";
import styles from "./styles/NavItem.module.css";

export default function NavItem({
  item,
  handleClick,
  itemCount,
  navItemSelected,
  showCount = true,
}: {
  item: string;
  navItemSelected: string;
  itemCount: number;
  showCount?: boolean;
  handleClick: (item: string) => void;
}) {
  return (
    <div
      onClick={() => handleClick(item)}
      className={`${styles.navItem} ${navItemSelected && navItemSelected === item ? styles.navItemSelected : ""}`}
    >
      <h3>{item}</h3>
      {showCount && <h4 className={styles.recordCount}>{itemCount}</h4>}
    </div>
  );
}
