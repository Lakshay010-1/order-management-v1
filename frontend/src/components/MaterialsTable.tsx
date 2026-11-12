import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import type { Material, MaterialDispatch } from "../types/Material";
import styles from "./styles/MaterialsTable.module.css";
import {
  fetchorderMaterials,
  insertOrderMaterial,
  removeOrderMaterial,
  updateOrderMaterial,
} from "../store/slices/orderMaterialsSlice";
import type { Order } from "../types/Order";
import { fetchItems } from "../store/slices/itemsSlice";
import Loader from "./Loader";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import BasicSelect from "./Select";
import { fetchDeliveryMediums } from "../store/slices/deliveryMediumsSlice";
import {
  fetchorderMaterialsDispatches,
  updateOrderMaterialDispatch,
} from "../store/slices/orderMatDispatchesSlice";
import Row from "./MaterialsTableRow";
import { compareDates } from "../utils/compareDates";
import type { FieldKey } from "../types/FieldKey";

const addMaterialDataInitialState = {
  material: { id: "", value: "" },
  quantity: "",
  order_date: new Date().toISOString().split("T")[0],
  purchase_date: "",
  deliver_date: "",
};

const minimumDates: Record<string, { date: string }> = {
  purchase_date: { date: "order_date" },
  deliver_date: { date: "purchase_date" },
  // dispatch_date: { date: "deliver_date" },
  confirmation_date: { date: "dispatch_date" },
};

export default function CollapsibleTable({
  fields,
  order,
  formatDate,
  editMode,
  saveMode,
  orderMaterialDispatchesData,
  setOrderMaterialDispatchesData,
  orderMaterialsData,
  setOrderMaterialsData,
}: {
  fields: Array<FieldKey>;
  order: Order;
  formatDate: (value: string) => string;
  editMode: boolean;
  saveMode: boolean;
  orderMaterialDispatchesData: Array<MaterialDispatch>;
  setOrderMaterialDispatchesData: (val: any) => void;
  orderMaterialsData: Array<Material>;
  setOrderMaterialsData: (val: any) => void;
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

  const [deliveryOptions, setDeliveryOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);

  const {
    orderMaterialsDispatches: orderMaterialDispatches,
    loading: orderMaterialDispatchesLoading,
    initialized: orderMaterialDispatchesInitialized,
    error: orderMaterialDispatchesError,
  } = useAppSelector((state) => state.orderMatDispatches);

  const { deliveryMediums, initialized: deliveryMediumsInitialized } =
    useAppSelector((state) => state.deliveryMediums);

  const [addMatStatus, setAddMatStatus] = useState<boolean>(false);
  const [addMatData, setAddMatData] = useState(addMaterialDataInitialState);

  const [matError, setMatError] = useState(false);

  const [itemOptions, setItemOptions] = useState<
    Array<{ id: number; value: string }>
  >([]);

  const [tempMaterialsData, setTempMaterialsData] = useState([]);
  const [addMatError, setAddMatError] = useState(false);

  const [doubleClickDelMatId, setDoubleClickDelMatId] = useState<number | null>(
    null,
  );
  const timeoutRefMat = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [addMatDispatchStatus, setAddMatDispatchStatus] =
    useState<boolean>(false);

  const [tempMaterialDispatchesData, setTempMaterialDispatchesData] = useState<
    Array<MaterialDispatch>
  >([]);

  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    value: string;
  }>({ id: -1, value: "" });

  function handleItemOptionChange(id: number) {
    const iItem = items.find((i) => i.id === id);
    setAddMatData((prev) => {
      return { ...prev, material: { id: iItem!.id, value: iItem!.item } };
    });
  }

  function handleAddMaterial() {
    const { material, order_date, purchase_date, deliver_date, quantity } =
      addMatData;
    if (Number(quantity) == 0 || material.value == "" || !order_date) {
      setMatError(true);
      return;
    }
    setMatError(false);
    const newOrderMaterial = {
      order_id: order.id,
      details: {
        item_id: material.id,
        order_date: order_date,
        quantity: Number(quantity),
      },
    };
    if (purchase_date) {
      newOrderMaterial["details"]["purchase_date"] = purchase_date;
    }
    if (deliver_date) {
      newOrderMaterial["details"]["deliver_date"] = deliver_date;
    }
    dispatch(insertOrderMaterial(newOrderMaterial));
    setAddMatData(addMaterialDataInitialState);
    setAddMatStatus(false);
  }

  function handleDeleteMaterial(material_id: number) {
    dispatch(removeOrderMaterial({ order_id: order.id, material_id }));
  }

  function handleDeleteMaterialClick(
    e: React.MouseEvent<HTMLButtonElement>,
    material_id: number,
  ) {
    e.stopPropagation();
    if (doubleClickDelMatId == material_id) {
      if (timeoutRefMat.current) {
        clearTimeout(timeoutRefMat.current);
        timeoutRefMat.current = null;
      }
      setDoubleClickDelMatId(null);
      handleDeleteMaterial(material_id);
      return;
    } else {
      if (timeoutRefMat.current) {
        clearTimeout(timeoutRefMat.current);
      }
      setDoubleClickDelMatId(material_id);

      timeoutRefMat.current = setTimeout(() => {
        setDoubleClickDelMatId(null);
        timeoutRefMat.current = null;
      }, 1500);
    }
  }

  // useEffect(() => {
  //   if (orderMaterialsIntialized) {
  //     if (!orderMaterialDispatchesInitialized) {
  //       orderMaterials.map((oM) => {
  //         dispatch(
  //           setOrderMaterialDispatchesGlobal(
  //             oM.dispatch.map((oMDis) => {
  //               return {
  //                 ...oMDis,
  //                 material_id: oM.id,
  //               };
  //             }),
  //           ),
  //         );
  //       });
  //       dispatch(setOrderMaterialDispatchesInitializer(true));
  //     } else {
  //       let currentMaterialDispatches = orderMaterialDispatchesData;
  //       const existingIds = new Set(
  //         currentMaterialDispatches.map((matDis) => matDis.id),
  //       );
  //       const newMaterialDispatchesIds = new Set(
  //         orderMaterialDispatches.map((matDis) => matDis.id),
  //       );
  //       const missingMaterialDispatches = orderMaterialDispatches.filter(
  //         (matDis) => !existingIds.has(matDis.id),
  //       );

  //       currentMaterialDispatches = currentMaterialDispatches.filter((matDis) =>
  //         newMaterialDispatchesIds.has(matDis.id),
  //       );
  //       const newUpdatedMaterialDispatches = [
  //         ...currentMaterialDispatches,
  //         ...missingMaterialDispatches,
  //       ];
  //       setOrderMaterialDispatchesData(newUpdatedMaterialDispatches);
  //       setTempMaterialDispatchesData(newUpdatedMaterialDispatches);
  //     }
  //   }
  // }, [
  //   orderMaterials,
  //   orderMaterialDispatchesInitialized,
  //   order,
  //   orderMaterialDispatches,
  // ]);

  useEffect(() => {
    if (saveMode) {
      orderMaterialsData.map((oMaterial) => {
        const {
          id: item_id,
          quantity,
          order_date,
          purchase_date,
          deliver_date,
        } = oMaterial;
        const updatedMaterial = {
          order_id: order.id,
          material_id: item_id,
          details: {
            quantity: Number(quantity),
            order_date: order_date,
          },
        };
        if (purchase_date) {
          updatedMaterial["details"]["purchase_date"] = purchase_date;
        }
        if (deliver_date) {
          updatedMaterial["details"]["deliver_date"] = deliver_date;
        }
        dispatch(updateOrderMaterial(updatedMaterial));
      });

      orderMaterialDispatchesData.map((oMatDisptch) => {
        const {
          id,
          material_id,
          quantity,
          dispatch_date,
          delivered_by,
          confirmation_date,
        } = oMatDisptch;
        const updatedOrderMaterialDis = {
          order_id: order.id,
          material_id: Number(material_id),
          material_dispatch_id: Number(id),
          details: {
            quantity: Number(quantity),
            dispatch_date: dispatch_date,
            delivered_by: delivered_by?.id ?? oMatDisptch.delivered_by_id,
          },
        };
        if (confirmation_date) {
          updatedOrderMaterialDis["details"]["confirmation_date"] =
            confirmation_date;
        }
        dispatch(updateOrderMaterialDispatch(updatedOrderMaterialDis));
      });
    }
  }, [saveMode]);

  useEffect(() => {
    if (!editMode) {
      setAddMatStatus(false);
      setAddMatDispatchStatus(false);
      if (!saveMode) {
        setOrderMaterialsData(tempMaterialsData);
        setOrderMaterialDispatchesData(tempMaterialDispatchesData);
      }
    } else {
      setTempMaterialsData(orderMaterialsData);
      setTempMaterialDispatchesData(orderMaterialDispatchesData);
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
    if (!orderMaterialsInitialized) {
      dispatch(fetchorderMaterials(order.id));
    } else {
      // let currentMaterials = orderMaterialsData;
      // const existingIds = new Set(currentMaterials.map((mat) => mat.id));
      // const newMaterialsIds = new Set(orderMaterials.map((mat) => mat.id));
      // const missingMaterials = orderMaterials.filter(
      //   (item) => !existingIds.has(item.id),
      // );

      // currentMaterials = currentMaterials.filter((mat) =>
      //   newMaterialsIds.has(mat.id),
      // );
      // const newUpdatedMaterials = [...currentMaterials, ...missingMaterials];
      // setOrderMaterialsData(newUpdatedMaterials);
      // setTempMaterialsData(newUpdatedMaterials);

      setOrderMaterialsData(orderMaterials);
      setTempMaterialsData(orderMaterials);

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
  }, [orderMaterialsInitialized, orderMaterials]);

  useEffect(() => {
    if (!orderMaterialDispatchesInitialized) {
      dispatch(fetchorderMaterialsDispatches(order.id));
    } else {
      setOrderMaterialDispatchesData(orderMaterialDispatches);
      setTempMaterialDispatchesData(orderMaterialDispatches);
    }
  }, [orderMaterialDispatchesInitialized, orderMaterialDispatches]);

  return orderMaterialsLoading ? (
    <Loader message="Fetching order materials..." />
  ) : (
    <TableContainer>
      <Table
        aria-label="collapsible table"
        sx={
          {
            // borderCollapse: "separate",
            // borderSpacing: "0 10px",
          }
        }
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>S.No.</TableCell>
            {fields.map((mKey, mKeyIdx) => {
              return (
                <TableCell key={mKeyIdx} align="center">
                  {mKey.name}
                  <span className="text-red-600">{mKey?.required && "*"}</span>
                </TableCell>
              );
            })}
            <TableCell>
              <button
                disabled={editMode}
                className={`${styles.actionBtn} ${!editMode ? (addMatStatus ? `${styles.red} ${styles.blackBg}` : styles.green) : styles.lightgreen}`}
                onClick={() => setAddMatStatus((prev) => !prev)}
              >
                {!addMatStatus ? (
                  <AddIcon />
                ) : (
                  <CancelIcon style={{ color: "red" }} />
                )}
              </button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addMatStatus && (
            <TableRow>
              <TableCell />
              <TableCell />
              {fields.map((mKey, mKeyIdx) => {
                const { key, required, type, name } = mKey;
                const val = addMatData[key];
                const minimumValue =
                  type == "date"
                    ? formatDate(
                        Object.hasOwn(minimumDates, key)
                          ? addMatData[minimumDates[key].date]
                          : order["po_date"],
                      )
                    : 0;
                const min =
                  type == "date" || type == "number"
                    ? { min: minimumValue }
                    : {};

                const updatedValue =
                  type == "date"
                    ? Object.hasOwn(minimumDates, key)
                      ? compareDates(addMatData[minimumDates[key].date], val)
                      : compareDates(order["po_date"], val)
                    : val;

                // addMatData[key] = updatedValue;

                // setAddMatError(!updatedValue);

                return (
                  <TableCell key={mKeyIdx}>
                    {type == "select" ? (
                      <BasicSelect
                        options={itemOptions}
                        selectedOption={addMatData.material}
                        handleOptionChange={handleItemOptionChange}
                        required={matError}
                      />
                    ) : (
                      <input
                        {...min}
                        onClick={(e) => e.stopPropagation()}
                        placeholder={name}
                        style={
                          (matError && (required ?? false)) || addMatError
                            ? {
                                border: "1px solid red",
                              }
                            : {}
                        }
                        disabled={
                          key == "id" ||
                          (key == "deliver_date" &&
                            !addMatData["purchase_date"])
                        }
                        onChange={(e) =>
                          setAddMatData((prev) => {
                            return {
                              ...prev,
                              [key]: e.target.value,
                            };
                          })
                        }
                        value={updatedValue}
                        type={type}
                        className={styles.valueOne}
                      />
                    )}
                  </TableCell>
                );
              })}
              <TableCell>
                <button
                  className={`${styles.actionBtn} ${styles.blue}`}
                  onClick={() => handleAddMaterial()}
                >
                  <DoneIcon />
                </button>
              </TableCell>
            </TableRow>
          )}
          {orderMaterialsData.map((material, materialIdx) => (
            <Row
              key={materialIdx}
              order={order}
              row={material}
              rowIdx={materialIdx}
              editMode={editMode}
              formatDate={formatDate}
              setOrderMaterialsData={setOrderMaterialsData}
              dispatch={dispatch}
              deliveryOptions={deliveryOptions}
              orderMaterialDispatchesData={orderMaterialDispatchesData}
              setOrderMaterialDispatchesData={setOrderMaterialDispatchesData}
              addMatDispatchStatus={addMatDispatchStatus}
              setAddMatDispatchStatus={setAddMatDispatchStatus}
              order_id={order.id}
              doubleClickDelMatId={doubleClickDelMatId}
              handleDeleteMaterialClick={handleDeleteMaterialClick}
              minimumDates={minimumDates}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
