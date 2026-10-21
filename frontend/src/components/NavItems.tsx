import React from "react";
import styles from "./styles/NavItems.module.css";
import NavItem from "./NavItem";
import { useAppSelector } from "../store/hooks";

export default function NavItems({
  items,
  handleClick,
  category,
  navItemSelected,
}: {
  handleClick: (item: string) => void;
  items: Array<string>;
  category: string;
  navItemSelected: string;
}) {
  const { orders } = useAppSelector((state) => state.orders);

  return (
    <div className={styles.container}>
      <NavItem
        item={"All"}
        itemCount={orders.length}
        handleClick={handleClick}
        navItemSelected={navItemSelected}
      />
      {items.map((item, idx) => {
        const itemCount =
          orders.length > 0
            ? orders.filter((order) => order[category.toLowerCase()] === item)
                .length
            : 0;
        return (
          <NavItem
            key={idx}
            item={item}
            itemCount={itemCount}
            handleClick={handleClick}
            navItemSelected={navItemSelected}
          />
        );
      })}
    </div>
  );
}
