import React, { useEffect, useState } from "react";
import BasicSelect from "./Select";
import styles from "./styles/NavBar.module.css";
import NavItems from "./NavItems";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchParties } from "../store/slices/partySlice";
import { fetchStatuses } from "../store/slices/statusSlice";

export default function NavBar(props: {
  setSortOrdersBy: (value: { type: string; value: string }) => void;
}) {
  const dispatch = useAppDispatch();
  const categories = [
    { id: 0, value: "Status" },
    { id: 1, value: "Party" },
  ];
  const parties = useAppSelector((state) => state.parties.parties);
  const { statuses } = useAppSelector((state) => state.statuses);
  const [category, setCategory] = React.useState(categories[0]);
  const [items, setItems] = useState<string[]>([]);

  const [clickedItem, setClickedItem] = useState("All");

  useEffect(() => {
    props.setSortOrdersBy({ type: category.value, value: clickedItem });
  }, [clickedItem]);

  useEffect(() => {
    setClickedItem("All");
  }, [category]);

  useEffect(() => {
    if (category.value == categories[1].value) {
      dispatch(fetchParties());
    } else if (category.value == categories[0].value) {
      dispatch(fetchStatuses());
    }
  }, [category, dispatch]);

  useEffect(() => {
    if (category.value == categories[0].value) {
      setItems(statuses.map((status) => status.status));
    } else {
      setItems(parties.map((party) => party.party));
    }
  }, [parties, statuses, category]);

  function handleOptionChange(id: number) {
    const category = categories.find((category) => category.id === id);
    setCategory(category!);
  }

  return (
    <div className={styles.container}>
      <BasicSelect
        selectedOption={category}
        handleOptionChange={handleOptionChange}
        options={categories}
      />
      <NavItems
        items={items}
        navItemSelected={clickedItem}
        category={category.value}
        handleClick={setClickedItem}
      />
    </div>
  );
}
