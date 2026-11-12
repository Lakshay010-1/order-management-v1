import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/PaymentTCGridData.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Loader from "./Loader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchorderPaymentTCs,
  insertOrderPaymentTC,
  removeOrderPaymentTC,
  updateOrderPaymentTC,
} from "../store/slices/orderPaymentTCsSlice";
import type { PaymentTC } from "../types/PaymentTC";

const paymentTCkeys = [
  // { name: "Id", type: "number", key: "id" },
  { name: "Term", type: "text", key: "term", required: true },
  { name: "Fulfilled", type: "checkbox", key: "fulfilled" },
];

const addDataInitialState = {
  term: "",
  fulfilled: false,
};

export default function PaymentTCGridData({
  order,
  editMode,
  saveMode,
}: {
  order: any;
  editMode: boolean;
  saveMode: boolean;
}) {
  const dispatch = useAppDispatch();
  const {
    orderPaymentTCs,
    loading: orderPaymentTCsLoading,
    initialized: orderPaymentTCsInitialized,
    error: orderPaymentTCsError,
  } = useAppSelector((state) => state.orderPaymentTCs);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState(addDataInitialState);

  const [error, setError] = useState(false);
  const [doubleClickDelId, setDoubleClickDelId] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [tempPaymentTCsData, setTempPaymentTCsData] = useState([]);
  const [orderPaymentTCsData, setOrderPaymentTCsData] = useState([]);

  function handleAddPaymentTC() {
    const { term, fulfilled } = addData;
    if (term == "") {
      setError(true);
      return;
    }
    setError(false);
    dispatch(
      insertOrderPaymentTC({
        order_id: order.id,
        details: {
          term,
          fulfilled,
        },
      }),
    );
    setAddData(addDataInitialState);
    setAdd(false);
  }

  function handleDeletePaymentTC(payment_tc_id: number) {
    dispatch(removeOrderPaymentTC({ order_id: order.id, payment_tc_id }));
  }

  useEffect(() => {
    if (saveMode) {
      orderPaymentTCsData.map((oPc: PaymentTC) => {
        dispatch(
          updateOrderPaymentTC({
            order_id: order.id,
            payment_tc_id: oPc.id,
            details: {
              term: oPc.term,
              fulfilled: oPc.fulfilled,
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
        setOrderPaymentTCsData(tempPaymentTCsData);
      }
    } else {
      setTempPaymentTCsData(orderPaymentTCsData);
    }
  }, [editMode, saveMode]);

  useEffect(() => {
    if (!orderPaymentTCsInitialized) {
      dispatch(fetchorderPaymentTCs(order.id));
    } else {
      // let currentPaymentTCs = orderPaymentTCsData;
      // const existingIds = new Set(currentPaymentTCs.map((ptc) => ptc.id));
      // const newPaymentTCsIds = new Set(orderPaymentTCs.map((ptc) => ptc.id));
      // const missingPaymentTCs = orderPaymentTCs.filter(
      //   (item) => !existingIds.has(item.id),
      // );

      // currentPaymentTCs = currentPaymentTCs.filter((ptc) =>
      //   newPaymentTCsIds.has(ptc.id),
      // );
      // const newUpdatedPaymentTCs = [...currentPaymentTCs, ...missingPaymentTCs];
      setOrderPaymentTCsData(orderPaymentTCs);
      setTempPaymentTCsData(orderPaymentTCs);
    }
  }, [orderPaymentTCsInitialized, order, orderPaymentTCs]);

  return orderPaymentTCsLoading ? (
    <Loader message="Fetching Order Payment Terms and Conditions..." />
  ) : (
    <div
      style={{
        gridTemplateRows: `repeat(${orderPaymentTCsData.length + 1},1fr)`,
        maxHeight: `${order.po_type_id == 1 ? "22rem" : "95dvh"}`,
      }}
      className={styles.paymentstcsDetails}
    >
      <p className={styles.keyOne}>S.No.</p>
      {paymentTCkeys.map((key) => (
        <p className={styles.keyOne} key={key.name}>
          {key.name}
          <span className="text-red-600">{key?.required && "*"}</span>
        </p>
      ))}
      <button
        disabled={editMode}
        className={`${styles.actionBtn} ${!editMode ? (add ? `${styles.red} ${styles.blackBg}` : styles.green) : styles.lightgreen}`}
        onClick={() => setAdd((prev) => !prev)}
      >
        {!add ? <AddIcon /> : <CancelIcon style={{ color: "red" }} />}
      </button>
      {add && (
        <>
          <p></p>
          {paymentTCkeys.map((key, idx) => {
            const keyName = key.name.toLowerCase();
            // const val =
            //   key.type === "checkbox"
            //     ? { checked: addData[keyName] === true }
            //     : { value: addData[keyName] };
            return (
              <input
                style={
                  error && key?.required
                    ? {
                        border: "1px solid red",
                      }
                    : {}
                }
                key={idx}
                disabled={key.name == "Id"}
                onChange={(e) =>
                  setAddData((prev) => {
                    return {
                      ...prev,
                      [keyName]:
                        keyName == "fulfilled"
                          ? !prev.fulfilled
                          : e.target.value,
                    };
                  })
                }
                value={addData[keyName]}
                checked={addData[keyName]}
                type={key.type}
                className={styles.valueOne}
              />
            );
          })}
          <button
            className={`${styles.actionBtn} ${styles.blue}`}
            onClick={() => handleAddPaymentTC()}
          >
            <DoneIcon />
          </button>
        </>
      )}
      {orderPaymentTCsData.map((p_tc, idx) => {
        return (
          <React.Fragment key={idx}>
            <p>{idx + 1}</p>
            {paymentTCkeys.map((key, keysIdx) => {
              const keyName = key.name.toLowerCase();
              const value =
                key.type === "checkbox"
                  ? { checked: p_tc[keyName] === true }
                  : { value: key.key == "id" ? idx + 1 : p_tc[keyName] };
              return (
                <input
                  key={keysIdx}
                  readOnly={key.name == "Id"}
                  disabled={!editMode || key.name == "Id"}
                  type={key.type}
                  name={keyName}
                  className={styles.valueOne}
                  {...value}
                  onChange={(e) =>
                    setOrderPaymentTCsData((prev) => {
                      const updatedPaymentTCs = prev.map((p) => {
                        if (p.id === p_tc.id) {
                          return {
                            ...p,
                            [keyName]:
                              keyName === "fulfilled"
                                ? !p.fulfilled
                                : e.target.value,
                          };
                        }
                        return p;
                      });
                      return updatedPaymentTCs;
                    })
                  }
                />
              );
            })}
            <button
              disabled={editMode}
              className={`${styles.actionBtn} ${!editMode ? (doubleClickDelId == p_tc.id ? styles.blackRed : styles.red) : styles.lightred}`}
              onClick={() => {
                if (doubleClickDelId == p_tc.id) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                  }
                  setDoubleClickDelId(null);
                  handleDeletePaymentTC(p_tc.id);
                } else {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }
                  setDoubleClickDelId(p_tc.id);

                  timeoutRef.current = setTimeout(() => {
                    setDoubleClickDelId(null);
                    timeoutRef.current = null;
                  }, 1500);
                }
              }}
            >
              <DeleteIcon />
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
