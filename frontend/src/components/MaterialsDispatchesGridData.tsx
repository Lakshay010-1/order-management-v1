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
import { fetchDeliveryMediums } from "../store/slices/deliveryMediumsSlice";

const materialDispatchesKeys = [
  { name: "Id", type: "number", key: "id" },
  { name: "Material ID", type: "select", key: "material_id", required: true },
  { name: "Quantity", type: "number", key: "quantity", required: true },
  { name: "Dispatch Date", type: "date", key: "dispatch_date", required: true },
  { name: "Confirmation Date", type: "date", key: "confirmation_date" },
  { name: "Delivered By", type: "select", key: "delivered_by", required: true },
];

const addDataInitialState = {
  material: { id: -1, value: "" },
  quantity: "",
  dispatch_date: "",
  confirmation_date: "",
  delivered_by: { id: -1, value: "" },
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

  const { deliveryMediums, initialized: deliveryMediumsInitialized } =
    useAppSelector((state) => state.deliveryMediums);

  const {
    orderMaterials,
    intialized: orderMaterialsIntialized,
    loading: orderMaterialsLoading,
  } = useAppSelector((state) => state.orderMaterials);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState<MaterialDispatch>(addDataInitialState);

  const [error, setError] = useState(false);

  const [deliveryOptions, setDeliveryOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);
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

  function handleMaterialItemOptionChange(id: number) {
    const orderMatItems = orderMaterials.find((m) => m.id === id);
    setAddData((prev) => {
      return {
        ...prev,
        material: { id: orderMatItems!.id, value: "" + orderMatItems!.id },
      };
    });
  }
  function handleDeliveryItemOptionChange(id: number) {
    const deliveryItems = deliveryOptions.find((d) => d.id === id);
    setAddData((prev) => {
      return {
        ...prev,
        delivered_by: { id: deliveryItems!.id, value: deliveryItems.medium },
      };
    });
  }

  function handleAddMaterialDispatch() {
    const {
      material,
      dispatch_date,
      confirmation_date,
      delivered_by,
      quantity,
    } = addData;
    if (
      !quantity ||
      Number(quantity) == 0 ||
      !material.value ||
      !dispatch_date ||
      !delivered_by.id
    ) {
      setError(true);
      return;
    }
    setError(false);
    const newOrderMaterialDispatch = {
      order_id: order.id,
      material_id: material.id,
      details: {
        item_id: material.id,
        quantity: Number(quantity),
        dispatch_date: new Date(dispatch_date),
        delivered_by: delivered_by.id,
      },
    };
    if (confirmation_date) {
      newOrderMaterialDispatch["details"]["confirmation_date"] = new Date(
        confirmation_date,
      );
    }
    dispatch(insertOrderMaterialDispatch(newOrderMaterialDispatch));
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
              dispatch_date: new Date(oMatDisptch.dispatch_date),
              delivered_by: oMatDisptch.delivered_by.id,
              confirmation_date: new Date(oMatDisptch.confirmation_date),
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
    if (deliveryMediumsInitialized) {
      const oDelItems = deliveryMediums.map((delMed) => {
        return { id: delMed.id, value: delMed.medium };
      });
      setDeliveryOptions(oDelItems);
    } else {
      dispatch(fetchDeliveryMediums());
    }
  }, [deliveryMediumsInitialized]);

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
          {materialDispatchesKeys.map((key, idx) => {
            if (key.type == "select") {
              if (key.key == "material_id") {
                return (
                  <BasicSelect
                    options={materialsOptions}
                    selectedOption={addData.material}
                    handleOptionChange={handleMaterialItemOptionChange}
                    required={error}
                  />
                );
              } else if (key.key == "delivered_by") {
                return (
                  <BasicSelect
                    options={deliveryOptions}
                    selectedOption={addData.delivered_by}
                    handleOptionChange={handleDeliveryItemOptionChange}
                    required={error}
                  />
                );
              }
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
                disabled={key.key == "id"}
                onChange={(e) =>
                  setAddData((prev) => {
                    return {
                      ...prev,
                      [key.key]: e.target.value,
                    };
                  })
                }
                value={addData[key.key]}
                type={key.type}
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
              const keyName = key.key;
              const val = matDispatch[keyName];
              const updatedVal =
                key.type == "date"
                  ? formatDate(val)
                  : key.key == "delivered_by"
                    ? matDispatch["delivery_medium"]
                    : key.key == "id"
                      ? matDisptchIdx + 1
                      : val;
              return (
                <input
                  key={idx}
                  disabled={
                    !editMode ||
                    key.key == "id" ||
                    key.key == "material_id" ||
                    key.key == "delivered_by"
                  }
                  type={key.type}
                  name={keyName}
                  className={styles.valueOne}
                  value={updatedVal}
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
