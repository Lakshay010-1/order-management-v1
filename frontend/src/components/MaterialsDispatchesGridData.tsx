import React, { useEffect, useState, type ChangeEvent } from "react";
import type { MaterialDispatch } from "../types/Material";
import styles from "./styles/MaterialsDispatchesGridData.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchorderMaterialDispatches,
  insertOrderMaterialDispatch,
  removeOrderMaterialDispatch,
  setOrderMaterialDispatchesGlobal,
  setOrderMaterialDispatchesInitializer,
  updateOrderMaterialDispatch,
} from "../store/slices/orderMatDispatchesSlice";
import { fetchorderMaterials } from "../store/slices/orderMaterialsSlice";
import Loader from "./Loader";
import BasicSelect from "./Select";

const materialDispatchesKeys = [
  { name: "Id", type: "number" },
  { name: "Material_ID", type: "text" },
  { name: "Quantity", type: "text" },
  { name: "Date", type: "date" },
];

const addDataInitialState = {
  material: { id: -1, value: "" },
  quantity: 0,
  date: new Date().toISOString().split("T")[0],
};

export default function MaterialsDispatchesGridData({
  formatDate,
  order,
  saveMode,
  editMode,
}: {
  formatDate: (value: string) => string;
  order: any;
  editMode: boolean;
  saveMode: boolean;
}) {
  const dispatch = useAppDispatch();
  const {
    orderMaterialDispatches,
    loading: orderMaterialDispatchesLoading,
    initialized: orderMaterialDispatchesInitialized,
    error: orderMaterialDispatchesError,
  } = useAppSelector((state) => state.orderMatDispatches);

  const {
    orderMaterials,
    intialized: orderMaterialsIntialized,
    loading: orderMaterialsLoading,
  } = useAppSelector((state) => state.orderMaterials);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState(addDataInitialState);

  const [quantityError, setQuantityError] = useState(false);
  const [MaterialDispatchError, setMaterialDispatchError] = useState(false);

  const [materialsOptions, setMaterialsOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);

  const [tempMaterialDispatchesData, setTempMaterialDispatchesData] = useState(
    [],
  );
  const [orderMaterialDispatchesData, setOrderMaterialDispatchesData] =
    useState([]);

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
  }>({ id: -1, value: "" });

  function handleItemOptionChange(id: number) {
    const orderMatItems = orderMaterials.find((m) => m.id === id);
    setAddData((prev) => {
      return {
        ...prev,
        material: { id: orderMatItems!.id, value: "" + orderMatItems!.id },
      };
    });
  }

  function handleAddMaterialDispatch() {
    const { material, date, quantity } = addData;
    if (quantity == 0 || material.value == "") {
      setQuantityError(quantity == 0);
      setMaterialDispatchError(material.value == "");
      return;
    }
    dispatch(
      insertOrderMaterialDispatch({
        order_id: order.id,
        material_id: material.id,
        details: {
          item_id: material.id,
          date: new Date(date),
          quantity: Number(quantity),
        },
      }),
    );
    setAddData(addDataInitialState);
    setAdd(false);
  }

  function handleDeleteMaterialDispatch(
    material_id: number,
    material_dispatch_id: number,
  ) {
    dispatch(
      removeOrderMaterialDispatch({
        order_id: order.id,
        material_id,
        material_dispatch_id,
      }),
    );
  }

  useEffect(() => {
    if (saveMode) {
      orderMaterialDispatchesData.map((oMatDisptch) => {
        dispatch(
          updateOrderMaterialDispatch({
            order_id: order.id,
            material_id: oMatDisptch.material_id,
            material_dispatch_id: oMatDisptch.id,
            details: {
              quantity: Number(oMatDisptch.quantity),
              date: new Date(oMatDisptch.date),
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
        setOrderMaterialDispatchesData(tempMaterialDispatchesData);
      }
    } else {
      setTempMaterialDispatchesData(orderMaterialDispatchesData);
    }
  }, [editMode, saveMode]);

  useEffect(() => {
    if (orderMaterialsIntialized) {
      const oMatItems = orderMaterials.map((ordMat) => {
        return { id: ordMat.id, value: "" + ordMat.id };
      });
      setMaterialsOptions(oMatItems);
    } else {
      dispatch(fetchorderMaterials(order.id));
    }
  }, [orderMaterialsIntialized, order]);

  useEffect(() => {
    if (orderMaterialsIntialized) {
      if (!orderMaterialDispatchesInitialized) {
        orderMaterials.map((oM) => {
          dispatch(
            setOrderMaterialDispatchesGlobal(
              oM.dispatch.map((oMDis) => {
                return {
                  ...oMDis,
                  material_id: oM.id,
                };
              }),
            ),
          );
        });
        dispatch(setOrderMaterialDispatchesInitializer(true));
      } else {
        let currentMaterialDispatches = orderMaterialDispatchesData;
        const existingIds = new Set(
          currentMaterialDispatches.map((matDis) => matDis.id),
        );
        const newMaterialDispatchesIds = new Set(
          orderMaterialDispatches.map((matDis) => matDis.id),
        );
        const missingMaterialDispatches = orderMaterialDispatches.filter(
          (matDis) => !existingIds.has(matDis.id),
        );

        currentMaterialDispatches = currentMaterialDispatches.filter((matDis) =>
          newMaterialDispatchesIds.has(matDis.id),
        );
        const newUpdatedMaterialDispatches = [
          ...currentMaterialDispatches,
          ...missingMaterialDispatches,
        ];
        setOrderMaterialDispatchesData(newUpdatedMaterialDispatches);
        setTempMaterialDispatchesData(newUpdatedMaterialDispatches);
      }
    }
  }, [
    orderMaterials,
    orderMaterialDispatchesInitialized,
    order,
    orderMaterialDispatches,
  ]);

  return !orderMaterialDispatchesInitialized ? (
    <Loader message="Fetching order materials dispatches..." />
  ) : (
    <div
      style={{
        gridTemplateRows: `repeat(${orderMaterialDispatchesData!.length + 1},1fr)`,
      }}
      className={styles.materialsDispatchesDetails}
    >
      {materialDispatchesKeys.map((key) => (
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
          {materialDispatchesKeys.map((key, idx) => {
            if (key.name == "Material_ID") {
              return (
                <BasicSelect
                  options={materialsOptions}
                  selectedOption={addData.material}
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
            onClick={() => handleAddMaterialDispatch()}
          >
            <DoneIcon />
          </button>
        </>
      )}
      {orderMaterialDispatchesData!.map((matDispatch, matDisptchIdx) => {
        return (
          <React.Fragment key={matDisptchIdx}>
            {materialDispatchesKeys.map((key, idx) => {
              const keyName = key.name.toLowerCase();
              return (
                <input
                  key={idx}
                  disabled={
                    !editMode || key.name == "Id" || key.name == "Material_ID"
                  }
                  type={key.type}
                  name={keyName}
                  className={styles.valueOne}
                  value={
                    key.type == "date"
                      ? formatDate(matDispatch[keyName])
                      : matDispatch[keyName]
                  }
                  onChange={(e) =>
                    setOrderMaterialDispatchesData((prev) => {
                      const updatedMaterialDispatches = prev.map((matDis) => {
                        if (matDis.id === matDispatch.id) {
                          return {
                            ...matDis,
                            [keyName]: e.target.value,
                          };
                        }
                        return matDis;
                      });
                      return updatedMaterialDispatches;
                    })
                  }
                />
              );
            })}
            <button
              disabled={!editMode}
              className={`${styles.actionBtn} ${editMode ? styles.red : styles.lightred}`}
              onClick={() =>
                handleDeleteMaterialDispatch(
                  matDispatch.material_id,
                  matDispatch.id,
                )
              }
            >
              <DeleteIcon />
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
