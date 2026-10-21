import React, { useEffect, useState, type ChangeEvent } from "react";
import type { Order } from "../types/Order";
import styles from "./styles/ItemsGridData.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOrderItems,
  insertOrderItem,
  removeOrderItem,
  updateOrderItem,
} from "../store/slices/orderItemsSlice";
import { fetchItems } from "../store/slices/itemsSlice";
import Loader from "./Loader";
import BasicSelect from "./Select";

const itemsKeys = [
  { name: "Id", type: "number" },
  { name: "Item", type: "text" },
  { name: "Quantity", type: "text" },
  { name: "Date", type: "date" },
];

const addDataInitialState = {
  item: { id: -1, value: "" },
  quantity: 0,
  date: new Date().toISOString().split("T")[0],
};

export default function ItemsGridData({
  order,
  formatDate,
  editMode,
  saveMode,
}: {
  order: Order;
  formatDate: (value: string) => string;
  editMode: boolean;
  saveMode: boolean;
}) {
  const dispatch = useAppDispatch();
  const {
    orderItems,
    loading: orderItemsLoading,
    intialized: orderItemsInitialized,
    error: orderItemsError,
  } = useAppSelector((state) => state.orderItems);

  const {
    items,
    initialized: itemsInitialized,
    loading: itemsLoading,
  } = useAppSelector((state) => state.items);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState(addDataInitialState);

  const [quantityError, setQuantityError] = useState(false);
  const [itemError, setItemError] = useState(false);

  const [itemOptions, setItemOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);

  const [tempOrderItemsData, setTempOrderItemsData] = useState([]);
  const [orderItemsData, setorderItemsData] = useState([]);

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
  }>({ id: -1, value: "" });

  function handleItemOptionChange(id: number) {
    const iItem = items.find((i) => i.id === id);
    setAddData((prev) => {
      return { ...prev, item: { id: iItem!.id, value: iItem!.item } };
    });
  }

  function handleAddItem() {
    const { item, date, quantity } = addData;
    if (quantity == 0 || item.value == "") {
      setQuantityError(quantity == 0);
      setItemError(item.value == "");
      return;
    }
    dispatch(
      insertOrderItem({
        order_id: order.id,
        details: {
          item_id: item.id,
          date: new Date(date).toISOString().split("T")[0],
          quantity: Number(quantity),
        },
      }),
    );
    setAddData(addDataInitialState);
    setAdd(false);
  }

  function handleDeleteItem(item_id: number) {
    dispatch(removeOrderItem({ order_id: order.id, item_id }));
  }

  useEffect(() => {
    if (saveMode) {
      orderItemsData.map((oItem) => {
        dispatch(
          updateOrderItem({
            order_id: order.id,
            item_id: oItem.id,
            details: {
              quantity: Number(oItem.quantity),
              date: new Date(oItem.date).toISOString().split("T")[0],
            },
          }),
        );
      });
    }
  }, [saveMode]);

  useEffect(() => {
    if (!editMode) {
      setAdd(false);
      if (!saveMode) {
        setorderItemsData(tempOrderItemsData);
      }
    } else {
      setTempOrderItemsData(orderItemsData);
    }
  }, [editMode, saveMode]);

  useEffect(() => {
    if (itemsInitialized) {
      const iItems = items.map((i) => {
        return { id: i.id, value: i.item };
      });
      setItemOptions(iItems);
    } else {
      dispatch(fetchItems());
    }
  }, [itemsInitialized]);

  useEffect(() => {
    if (!orderItemsInitialized) {
      dispatch(fetchOrderItems(order.id));
    } else {
      let currentItems = orderItemsData;
      const existingIds = new Set(currentItems.map((item) => item.id));
      const newItemsIds = new Set(orderItems.map((item) => item.id));
      const missingItems = orderItems.filter(
        (item) => !existingIds.has(item.id),
      );

      currentItems = currentItems.filter((item) => newItemsIds.has(item.id));
      const newUpdatedItems = [...currentItems, ...missingItems];
      setorderItemsData(newUpdatedItems);
      setTempOrderItemsData(newUpdatedItems);

      // setorderItemsData((prev) => {
      //   const existingIds = new Set(prev.map((item) => item.id));
      //   const newItemsIds = new Set(prev.map((item) => item.id));

      //   const missingItems = orderItems.filter((oM) => !existingIds.has(oM.id));
      //   const extraItemsIds = new Set(
      //     prev.filter((prevItem) => {
      //       if (!newItemsIds.has(prevItem.id)) {
      //         return prevItem.id;
      //       }
      //     }),
      //   );
      //   prev = prev.filter((pI) => !extraItemsIds.has(pI.id));
      //   return [...prev, ...missingItems];
      // });
      // setorderItemsData((prev) => {
      //   const existingIds = new Set(prev.map((item) => item.id));

      //   const missingItems = orderItems.filter((oM) => !existingIds.has(oM.id));

      //   return [...prev, ...missingItems];
      // });
    }
  }, [orderItemsInitialized, order, orderItems]);

  return orderItemsLoading ? (
    <Loader message="Fetching order items..." />
  ) : (
    <div
      style={{
        gridTemplateRows: `repeat(${orderItemsData.length + 1},1fr)`,
      }}
      className={styles.itemsDetails}
    >
      {itemsKeys.map((key) => (
        <p className={styles.keyOne} key={key.name}>
          {key.name}
        </p>
      ))}
      <button
        disabled={!editMode}
        className={`${styles.actionBtn} ${editMode ? (add ? `${styles.red} ${styles.blackBg}` : styles.green) : styles.lightgreen}`}
        onClick={() => setAdd((prev) => !prev)}
      >
        {!add ? <AddIcon /> : <CancelIcon style={{ color: "red" }} />}
      </button>
      {add && (
        <>
          {itemsKeys.map((key, idx) => {
            if (key.name == "Item") {
              return (
                <BasicSelect
                  options={itemOptions}
                  selectedOption={addData.item}
                  handleOptionChange={handleItemOptionChange}
                />
              );
            }
            return (
              <input
                disabled={key.name == "Id"}
                onChange={(e) =>
                  setAddData((prev) => {
                    return {
                      ...prev,
                      [key.name.toLowerCase()]: e.target.value,
                    };
                  })
                }
                value={addData[key.name.toLowerCase()]}
                type={key.name.toLowerCase() === "date" ? "date" : "number"}
                className={styles.valueOne}
              />
            );
          })}
          <button
            className={`${styles.actionBtn} ${styles.blue}`}
            onClick={() => handleAddItem()}
          >
            <DoneIcon />
          </button>
        </>
      )}
      {orderItemsData.map((item, idx) => (
        <React.Fragment key={item.id ?? idx}>
          {itemsKeys.map((key, idx) => {
            return (
              <input
                key={idx}
                disabled={!editMode || key.name == "Id" || key.name == "Item"}
                type={key.type}
                name={key.name.toLowerCase()}
                className={styles.valueOne}
                onChange={(e) =>
                  setorderItemsData((prev) => {
                    const updatedItems = prev.map((itm) => {
                      if (itm.id === item.id) {
                        return {
                          ...itm,
                          [key.name.toLowerCase()]: e.target.value,
                        };
                      }
                      return itm;
                    });
                    return updatedItems;
                  })
                }
                value={
                  key.type == "date"
                    ? formatDate(item[key.name.toLowerCase()])
                    : item[key.name.toLowerCase()]
                }
              />
            );
          })}
          <button
            disabled={!editMode}
            className={`${styles.actionBtn} ${editMode ? styles.red : styles.lightred}`}
            onClick={() => handleDeleteItem(item.id)}
          >
            <DeleteIcon />
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}
