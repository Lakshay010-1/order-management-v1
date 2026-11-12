import React, { useEffect, useRef, useState } from "react";
import type { Material, MaterialDispatch } from "../types/Material";
import { useAppSelector } from "../store/hooks";
import {
  fetchorderMaterialsDispatches,
  insertOrderMaterialDispatch,
  removeOrderMaterialDispatch,
} from "../store/slices/orderMatDispatchesSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import styles from "./styles/MaterialsTableRow.module.css";
import BasicSelect from "./Select";
import Loader from "./Loader";
import type { Order } from "../types/Order";
import { compareDates } from "../utils/compareDates";

const materialsKeys = [
  // { name: "Id", type: "number", key: "id" },
  { name: "Item", type: "select", key: "item", required: true },
  { name: "Quantity", type: "text", key: "quantity", required: true },
  { name: "Order Date", type: "date", key: "order_date", required: true },
  { name: "Purchase Date", type: "date", key: "purchase_date" },
  { name: "Deliver Date", type: "date", key: "deliver_date" },
];

const materialDispatchesKeys = [
  // { name: "Id", type: "number", key: "id" },
  // { name: "Material ID", type: "select", key: "material_id", required: true },
  { name: "Quantity", type: "number", key: "quantity", required: true },
  {
    name: "Delivered By",
    type: "select",
    key: "delivered_by",
    required: true,
  },
  { name: "Dispatch Date", type: "date", key: "dispatch_date", required: true },
  { name: "Confirmation Date", type: "date", key: "confirmation_date" },
];

const addMatDispatchDataInitialState = {
  quantity: "",
  dispatch_date: "",
  confirmation_date: "",
  delivered_by: { id: "", value: "" },
};

export default function Row(props: {
  row: Material;
  rowIdx: number;
  editMode: boolean;
  formatDate: (val: any) => string;
  setOrderMaterialsData: (val: any) => void;
  dispatch: any;
  deliveryOptions: Array<{ id: number; value: string }>;
  orderMaterialDispatchesData: Array<MaterialDispatch>;
  setOrderMaterialDispatchesData: (val: any) => void;
  addMatDispatchStatus: boolean;
  setAddMatDispatchStatus: (val: boolean) => void;
  order_id: number;
  doubleClickDelMatId: number | null;
  order: Order;
  handleDeleteMaterialClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    material_id: number,
    minimumDates: Record<string, { date: string }>,
  ) => void;
}) {
  const {
    order,
    row,
    rowIdx,
    editMode,
    doubleClickDelMatId,
    dispatch,
    deliveryOptions,
    orderMaterialDispatchesData,
    addMatDispatchStatus,
    order_id,
    setOrderMaterialsData,
    formatDate,
    handleDeleteMaterialClick,
    setOrderMaterialDispatchesData,
    setAddMatDispatchStatus,
    minimumDates,
  } = props;

  const { loading: orderMaterialsDispatchesLoading } = useAppSelector(
    (state) => state.orderMatDispatches,
  );

  const [filteredMatDispatches, setFilteredMatDispatches] = useState<
    Array<MaterialDispatch>
  >([]);
  const [mouseIn, setMouseIn] = useState(false);

  const [open, setOpen] = React.useState(false);
  const detailsId = React.useId();
  const [addMatDispatchData, setAddMatDispatchData] = useState(
    addMatDispatchDataInitialState,
  );
  const [matDispatchError, setMatDispatchError] = useState(false);

  const [dispatchedQuantity, setDispatchedQuantity] = useState(0);

  const [materialDispatches, setMaterialDispatches] = useState<
    Array<MaterialDispatch>
  >([]);

  const [materialDispatchItemsChange, setMaterialDispatchItemsChange] =
    useState(false);
  const [doubleClickDelDisId, setDoubleClickDelDisId] = useState<number | null>(
    null,
  );
  const timeoutRefMatDispatch = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    const udpatedFilteredDispatches = orderMaterialDispatchesData.filter(
      (matDis) => matDis.material_id == row.id,
    );
    setFilteredMatDispatches(udpatedFilteredDispatches);
    setDispatchedQuantity(
      udpatedFilteredDispatches.reduce(
        (total, currentOb) => total + currentOb.quantity,
        0,
      ),
    );
  }, [orderMaterialDispatchesData]);

  function handleDeliveryItemOptionChange(id: number) {
    const deliveryItems = deliveryOptions.find((d) => d.id === id);
    setAddMatDispatchData((prev) => {
      return {
        ...prev,
        delivered_by: { id: deliveryItems!.id, value: deliveryItems?.value },
      };
    });
  }

  function handleAddMaterialDispatch() {
    const { dispatch_date, confirmation_date, delivered_by, quantity } =
      addMatDispatchData;
    if (
      !quantity ||
      Number(quantity) == 0 ||
      !dispatch_date ||
      !delivered_by.id
    ) {
      setMatDispatchError(true);
      return;
    }
    setMatDispatchError(false);
    const newOrderMaterialDispatch = {
      order_id: order_id,
      material_id: row.id,
      details: {
        item_id: row.id,
        quantity: Number(quantity),
        dispatch_date: dispatch_date,
        delivered_by: delivered_by.id,
      },
    };
    if (confirmation_date) {
      newOrderMaterialDispatch["details"]["confirmation_date"] =
        confirmation_date;
    }
    dispatch(insertOrderMaterialDispatch(newOrderMaterialDispatch));

    // dispatch(fetchorderMaterialDispatches({ order_id, material_id: row.id }));
    setAddMatDispatchData(addMatDispatchDataInitialState);
    setAddMatDispatchStatus(false);
  }

  function handleDeleteMaterialDispatch(
    material_id: number,
    material_dispatch_id: number,
  ) {
    dispatch(
      removeOrderMaterialDispatch({
        order_id: order_id,
        material_id,
        material_dispatch_id,
      }),
    );
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > .MuiTableCell-root": { borderBottom: "unset" } }}
        className={`  ${mouseIn ? `${styles.lightblueBg} ${styles.topBorder}` : ""}`}
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
        onClick={() => setOpen(!open)}
      >
        <TableCell
          align="center"
          onClick={() => setOpen(!open)}
          className={styles.dispatchbgColor}
        >
          <IconButton
            aria-label={open ? "collapse row" : "expand row"}
            aria-expanded={open}
            aria-controls={detailsId}
            size="small"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{rowIdx + 1}</TableCell>
        {materialsKeys.map((mKey, mKeyIdx) => {
          const { type, key, name, required } = mKey;
          const value = type == "date" ? formatDate(row[key]) : row[key];

          const minimumValue =
            type == "date"
              ? formatDate(
                  Object.hasOwn(minimumDates, key)
                    ? row[minimumDates[key].date]
                    : order["po_date"],
                )
              : 0;
          const min =
            type == "date" || type == "number" ? { min: minimumValue } : {};

          const updatedValue =
            type == "date"
              ? Object.hasOwn(minimumDates, key)
                ? compareDates(row[minimumDates[key].date], value)
                : compareDates(order["po_date"], value)
              : value;

          return (
            <TableCell key={mKeyIdx}>
              <input
                {...min}
                onClick={(e) => e.stopPropagation()}
                style={updatedValue != value ? { border: "1px solid red" } : {}}
                key={mKeyIdx}
                disabled={!editMode || key == "id" || key == "item"}
                type={type}
                name={name}
                value={updatedValue != value ? value : updatedValue}
                className={styles.valueOne}
                onChange={(e) =>
                  setOrderMaterialsData((prev) => {
                    const updatedMaterials = prev.map((mat) => {
                      if (mat.id === row.id) {
                        return {
                          ...mat,
                          [key]: e.target.value,
                        };
                      }
                      return mat;
                    });
                    return updatedMaterials;
                  })
                }
              />
            </TableCell>
          );
        })}
        <TableCell>
          <button
            disabled={editMode}
            className={`${styles.actionBtn} ${!editMode ? (doubleClickDelMatId == row.id ? styles.blackRed : styles.red) : styles.lightred}`}
            onClick={(e) => handleDeleteMaterialClick(e, row.id)}
          >
            <DeleteIcon />
          </button>
        </TableCell>
      </TableRow>
      <TableRow
        id={detailsId}
        aria-hidden={!open ? true : undefined}
        className={`${styles.dispatchbgColor} ${mouseIn ? `${styles.lightblueBg} ${styles.bottomBorder}` : ""} `}
        onMouseEnter={() => setMouseIn(true)}
        onMouseLeave={() => setMouseIn(false)}
        style={{ width: "100%" }}
      >
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0 }}
          colSpan={materialsKeys.length + 3}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                margin: 2,
                marginBottom: 3,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                textAlign: "left",
                alignItems: "center",
              }}
            >
              <div className={styles.dispatchQuantities}>
                <h3>Ordered Quantity : {row.quantity}</h3>
                <h3>
                  Dispatched Quantity : {dispatchedQuantity}
                  {dispatchedQuantity > row.quantity && (
                    <span>(+{dispatchedQuantity - row.quantity})</span>
                  )}
                </h3>
                <h3>
                  Remaining Quantity :{" "}
                  {row.quantity < dispatchedQuantity
                    ? 0
                    : row.quantity - dispatchedQuantity}
                </h3>
              </div>
              <Table
                style={{ width: "100%" }}
                size="small"
                aria-label="purchases"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>S.No.</TableCell>
                    {materialDispatchesKeys.map((mDisField, mDisFieldIdx) => {
                      return (
                        <TableCell key={mDisFieldIdx} align="center">
                          {mDisField.name}

                          <span className="text-red-600">
                            {mDisField?.required && "*"}
                          </span>
                        </TableCell>
                      );
                    })}
                    <TableCell>
                      <button
                        disabled={editMode}
                        className={`${styles.actionBtn} ${!editMode ? (addMatDispatchStatus ? `${styles.red} ${styles.blackBg}` : styles.green) : styles.lightgreen}`}
                        onClick={() => setAddMatDispatchStatus((prev) => !prev)}
                      >
                        {!addMatDispatchStatus ? (
                          <AddIcon />
                        ) : (
                          <CancelIcon style={{ color: "red" }} />
                        )}
                      </button>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addMatDispatchStatus && (
                    <TableRow>
                      <TableCell />
                      {materialDispatchesKeys.map((mdField, mdFieldIdx) => {
                        const { key, type, required, name } = mdField;
                        const val = addMatDispatchData[key];
                        const minimumValue =
                          type == "date"
                            ? formatDate(
                                Object.hasOwn(minimumDates, key)
                                  ? addMatDispatchData[minimumDates[key].date]
                                  : row["deliver_date"],
                              )
                            : 0;
                        const min =
                          type == "date" || type == "number"
                            ? { min: minimumValue }
                            : {};

                        const updatedValue =
                          type == "date"
                            ? Object.hasOwn(minimumDates, key)
                              ? compareDates(
                                  addMatDispatchData[minimumDates[key].date],
                                  val,
                                )
                              : compareDates(row["deliver_date"], val)
                            : val;

                        addMatDispatchData[key] = updatedValue;
                        return (
                          <TableCell key={mdFieldIdx}>
                            {type == "select" ? (
                              <BasicSelect
                                options={deliveryOptions}
                                selectedOption={addMatDispatchData.delivered_by}
                                handleOptionChange={
                                  handleDeliveryItemOptionChange
                                }
                                required={matDispatchError && required}
                              />
                            ) : (
                              <input
                                {...min}
                                onClick={(e) => e.stopPropagation()}
                                placeholder={name}
                                style={
                                  matDispatchError && (required ?? false)
                                    ? {
                                        border: "1px solid red",
                                      }
                                    : {}
                                }
                                disabled={
                                  key == "confirmation_date" &&
                                  !addMatDispatchData["dispatch_date"]
                                }
                                onChange={(e) =>
                                  setAddMatDispatchData((prev) => {
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
                          onClick={() => handleAddMaterialDispatch()}
                        >
                          <DoneIcon />
                        </button>
                      </TableCell>
                    </TableRow>
                  )}

                  {orderMaterialsDispatchesLoading ? (
                    <Loader message="Loading material dispatches" />
                  ) : (
                    filteredMatDispatches.map((matDispatch, mdIdx) => {
                      return (
                        <TableRow key={mdIdx}>
                          <TableCell>{mdIdx + 1}</TableCell>
                          {materialDispatchesKeys.map((mdField, mdFieldIdx) => {
                            const { type, key, required, name } = mdField;
                            const val =
                              type == "date"
                                ? formatDate(matDispatch[key])
                                : matDispatch[key];
                            const minimumValue =
                              type == "date"
                                ? formatDate(
                                    Object.hasOwn(minimumDates, key)
                                      ? matDispatch[minimumDates[key].date]
                                      : row["deliver_date"],
                                  )
                                : 0;
                            const min =
                              type == "date" || type == "number"
                                ? { min: minimumValue }
                                : {};
                            const updatedValue =
                              type == "date"
                                ? Object.hasOwn(minimumDates, key)
                                  ? compareDates(
                                      matDispatch[minimumDates[key].date],
                                      val,
                                    )
                                  : compareDates(row["deliver_date"], val)
                                : key == "delivered_by"
                                  ? matDispatch["delivery_medium"]
                                  : val;

                            return (
                              <TableCell key={mdFieldIdx}>
                                <input
                                  {...min}
                                  onClick={(e) => e.stopPropagation()}
                                  style={
                                    type != "select" && updatedValue != val
                                      ? { border: "1px solid red" }
                                      : {}
                                  }
                                  disabled={
                                    !editMode ||
                                    key == "delivered_by" ||
                                    (key == "confirmation_date" &&
                                      !matDispatch["dispatch_date"])
                                  }
                                  type={type == "select" ? "text" : type}
                                  placeholder={name}
                                  name={key}
                                  value={
                                    updatedValue != val ? val : updatedValue
                                  }
                                  className={styles.valueOne}
                                  onChange={(e) =>
                                    setOrderMaterialDispatchesData((prev) => {
                                      const updatedMaterialDispatches =
                                        prev.map((matDis) => {
                                          if (matDis.id === matDispatch.id) {
                                            const val = e.target.value;
                                            return {
                                              ...matDis,
                                              [key]:
                                                type == "number"
                                                  ? Number(val)
                                                  : type == "date"
                                                    ? formatDate(val)
                                                    : val,
                                            };
                                          }
                                          return matDis;
                                        });
                                      return updatedMaterialDispatches;
                                    })
                                  }
                                />
                              </TableCell>
                            );
                          })}
                          <TableCell>
                            <button
                              disabled={editMode}
                              className={`${styles.actionBtn} ${!editMode ? (doubleClickDelDisId == matDispatch.id ? styles.blackRed : styles.red) : styles.lightred}`}
                              onClick={() => {
                                if (doubleClickDelDisId == matDispatch.id) {
                                  if (timeoutRefMatDispatch.current) {
                                    clearTimeout(timeoutRefMatDispatch.current);
                                    timeoutRefMatDispatch.current = null;
                                  }
                                  setDoubleClickDelDisId(null);
                                  handleDeleteMaterialDispatch(
                                    row.id,
                                    matDispatch.id!,
                                  );
                                } else {
                                  if (timeoutRefMatDispatch.current) {
                                    clearTimeout(timeoutRefMatDispatch.current);
                                  }
                                  setDoubleClickDelDisId(matDispatch.id);

                                  timeoutRefMatDispatch.current = setTimeout(
                                    () => {
                                      setDoubleClickDelDisId(null);
                                      timeoutRefMatDispatch.current = null;
                                    },
                                    1500,
                                  );
                                }
                              }}
                            >
                              <DeleteIcon />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
                {/* <TableBody>
                  {orderMaterialDispatchesData.map((matDis, matDisIdx) => {
                    return (
                      <TableRow key={matDisIdx}>
                        {materialDispatchesKeys.map((disField, disFieldIdx) => {
                          return (
                            <TableCell key={disFieldIdx}>
                              {matDis[disField]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody> */}
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
