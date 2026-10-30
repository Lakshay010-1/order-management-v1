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
    { id: 2, value: "Time" },
  ];
  const parties = useAppSelector((state) => state.parties.parties);
  const { statuses } = useAppSelector((state) => state.statuses);
  const [category, setCategory] = React.useState(categories[0]);
  const [items, setItems] = useState<string[]>([]);

  const [clickedItem, setClickedItem] = useState("All");

  useEffect(() => {
    if (clickedItem != "All" && category.id == 2) {
      return;
    }
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
    } else if (category.value == categories[1].value) {
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
      {category.id !== 2 ? (
        <NavItems
          items={items}
          navItemSelected={clickedItem}
          category={category.value}
          handleClick={setClickedItem}
        />
      ) : (
        <div style={{ display: "flex", width: "100%" }}>
          <NavItems
            items={["Month", "Year"]}
            navItemSelected={clickedItem}
            category={category.value}
            handleClick={setClickedItem}
          />
          {clickedItem !== "All" && (
            <>
              {clickedItem == "Month" ? (
                <input
                  type="month"
                  onChange={(e) =>
                    props.setSortOrdersBy({
                      type: category.value,
                      value: e.target.value,
                    })
                  }
                />
              ) : (
                <input
                  type="number"
                  min={2000}
                  max={2099}
                  placeholder="Year"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 9999 || val <= 999) {
                      return;
                    }
                    props.setSortOrdersBy((prev) => {
                      return {
                        type: category.value,
                        value: `${val}-00`,
                      };
                    });
                  }}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
