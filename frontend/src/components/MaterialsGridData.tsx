import React, { useEffect, useState } from "react";
import type { Order } from "../types/Order";
import styles from "./styles/MaterialsGridData.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import BasicSelect from "./Select";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchItems } from "../store/slices/itemsSlice";
import {
  fetchorderMaterials,
  insertOrderMaterial,
  removeOrderMaterial,
  updateOrderMaterial,
} from "../store/slices/orderMaterialsSlice";
import Loader from "./Loader";

const materialsKeys = [
  { name: "Id", type: "number", key: "id" },
  { name: "Item", type: "text", key: "item", required: true },
  { name: "Quantity", type: "text", key: "quantity", required: true },
  { name: "Order Date", type: "date", key: "order_date", required: true },
  { name: "Purchase Date", type: "date", key: "purchase_date" },
  { name: "Deliver Date", type: "date", key: "deliver_date" },
];

const addDataInitialState = {
  material: { id: -1, value: "" },
  quantity: "",
  order_date: "",
  purchase_date: "",
  deliver_date: "",
};

export default function MaterialsGridData({
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
    orderMaterials,
    loading: orderMaterialsLoading,
    intialized: orderMaterialsInitialized,
    error: orderMaterialsError,
  } = useAppSelector((state) => state.orderMaterials);

  const {
    items,
    initialized: itemsInitialized,
    loading: itemsLoading,
  } = useAppSelector((state) => state.items);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState(addDataInitialState);

  const [error, setError] = useState(false);

  const [itemOptions, setItemOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);

  const [tempMaterialsData, setTempMaterialsData] = useState([]);
  const [orderMaterialsData, setOrderMaterialsData] = useState([]);

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
  }>({ id: -1, value: "" });

  function handleItemOptionChange(id: number) {
    const iItem = items.find((i) => i.id === id);
    setAddData((prev) => {
      return { ...prev, material: { id: iItem!.id, value: iItem!.item } };
    });
  }

  function handleAddMaterial() {
    const { material, order_date, purchase_date, deliver_date, quantity } =
      addData;
    if (Number(quantity) == 0 || material.value == "" || !order_date) {
      setError(true);
      return;
    }
    setError(false);
    const newOrderMaterial = {
      order_id: order.id,
      details: {
        item_id: material.id,
        order_date: new Date(order_date),
        quantity: Number(quantity),
      },
    };
    if (purchase_date) {
      newOrderMaterial["details"]["purchase_date"] = new Date(purchase_date);
    }
    if (purchase_date) {
      newOrderMaterial["details"]["deliver_date"] = new Date(deliver_date);
    }
    dispatch(insertOrderMaterial(newOrderMaterial));
    setAddData(addDataInitialState);
    setAdd(false);
  }

  function handleDeleteMaterial(material_id: number) {
    dispatch(removeOrderMaterial({ order_id: order.id, material_id }));
  }

  useEffect(() => {
    if (saveMode) {
      orderMaterialsData.map((oMaterial) => {
        dispatch(
          updateOrderMaterial({
            order_id: order.id,
            material_id: oMaterial.id,
            details: {
              quantity: Number(oMaterial.quantity),
              order_date: oMaterial.order_date,
              purchase_date: oMaterial.purchase_date,
              deliver_date: oMaterial.deliver_date,
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
        setOrderMaterialsData(tempMaterialsData);
      }
    } else {
      setTempMaterialsData(orderMaterialsData);
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
    if (!orderMaterialsInitialized) {
      dispatch(fetchorderMaterials(order.id));
    } else {
      let currentMaterials = orderMaterialsData;
      const existingIds = new Set(currentMaterials.map((mat) => mat.id));
      const newMaterialsIds = new Set(orderMaterials.map((mat) => mat.id));
      const missingMaterials = orderMaterials.filter(
        (item) => !existingIds.has(item.id),
      );

      currentMaterials = currentMaterials.filter((mat) =>
        newMaterialsIds.has(mat.id),
      );
      const newUpdatedMaterials = [...currentMaterials, ...missingMaterials];
      setOrderMaterialsData(newUpdatedMaterials);
      setTempMaterialsData(newUpdatedMaterials);
      // setOrderMaterialsData((prev) => {
      //   const existingIds = new Set(prev.map((item) => item.id));

      //   const missingMaterials = orderMaterials.filter(
      //     (oM) => !existingIds.has(oM.id),
      //   );

      //   return [...prev, ...missingMaterials];
      // });
      // setTempMaterialsData((prev) => {
      //   const existingIds = new Set(prev.map((item) => item.id));

      //   const missingMaterials = orderMaterials.filter(
      //     (oM) => !existingIds.has(oM.id),
      //   );

      //   return [...prev, ...missingMaterials];
      // });
    }
  }, [orderMaterialsInitialized, order, orderMaterials]);

  return orderMaterialsLoading ? (
    <Loader message="Fetching order materials..." />
  ) : (
    <div
      style={{
        gridTemplateRows: `repeat(${orderMaterialsData.length + 1},1fr)`,
      }}
      className={styles.materialsDetails}
    >
      {materialsKeys.map((key) => (
        <p className={styles.keyOne} key={key.name}>
          {key.name}
          <span className="text-red-600">{key?.required && "*"}</span>
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
          {materialsKeys.map((key, idx) => {
            if (key.name == "Item") {
              return (
                <BasicSelect
                  options={itemOptions}
                  selectedOption={addData.material}
                  handleOptionChange={handleItemOptionChange}
                  required={error}
                />
              );
            }
            return (
              <input
                style={
                  error && key?.required
                    ? {
                        border: "1px solid red",
                      }
                    : {}
                }
                disabled={key.name == "Id"}
                onChange={(e) =>
                  setAddData((prev) => {
                    return {
                      ...prev,
                      [key.key]: e.target.value,
                    };
                  })
                }
                value={addData[key.key]}
                type={key.type === "date" ? "date" : "number"}
                className={styles.valueOne}
              />
            );
          })}
          <button
            className={`${styles.actionBtn} ${styles.blue}`}
            onClick={() => handleAddMaterial()}
          >
            <DoneIcon />
          </button>
        </>
      )}
      {orderMaterialsData.map((material, materialIdx) => {
        return (
          <React.Fragment key={materialIdx}>
            {materialsKeys.map((key, idx) => (
              <input
                key={idx}
                disabled={!editMode || key.name == "Id" || key.name == "Item"}
                type={key.type}
                name={key.key}
                className={styles.valueOne}
                onChange={(e) =>
                  setOrderMaterialsData((prev) => {
                    const updatedMaterials = prev.map((mat) => {
                      if (mat.id === material.id) {
                        return {
                          ...mat,
                          [key.key]: e.target.value,
                        };
                      }
                      return mat;
                    });
                    return updatedMaterials;
                  })
                }
                value={
                  key.type == "date"
                    ? formatDate(material[key.key])
                    : material[key.key]
                }
              />
            ))}
            <button
              disabled={!editMode}
              className={`${styles.actionBtn} ${editMode ? styles.red : styles.lightred}`}
              onClick={() => handleDeleteMaterial(material.id)}
            >
              <DeleteIcon />
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
