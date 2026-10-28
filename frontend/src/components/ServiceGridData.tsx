import React, { useEffect, useState } from "react";
import styles from "./styles/ServiceGridData.module.css";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";
import Loader from "./Loader";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOrderServices,
  insertOrderService,
  removeOrderService,
  updateOrderService,
} from "../store/slices/orderServicesSlice";

const serviceKeys = [
  {
    name: "Id",
    type: "number",
    key: "id",
  },
  {
    name: "Description",
    type: "text",
    key: "description",
  },
  {
    name: "Date",
    type: "date",
    key: "date",
    required: true,
  },
];

const addDataInitialState = {
  id: "",
  description: "",
  date: "",
};

export default function ServiceGridData({
  order,
  editMode,
  saveMode,
  formatDate,
}: {
  order: any;
  editMode: boolean;
  formatDate: (val: any) => string;
  saveMode: boolean;
}) {
  const dispatch = useAppDispatch();
  const {
    orderServices,
    loading: orderServicesLoading,
    initialized: orderServicesInitialized,
    error: orderServicesError,
  } = useAppSelector((state) => state.orderServices);

  const [add, setAdd] = useState<boolean>(false);
  const [addData, setAddData] = useState(addDataInitialState);

  const [error, setError] = useState(false);

  const [tempServicesData, setTempServicesData] = useState([]);
  const [orderServicesData, setOrderServicesData] = useState([]);

  function handleAddService() {
    const { description, date } = addData;
    if (date == "") {
      setError(true);
      return;
    }
    setError(false);
    dispatch(
      insertOrderService({
        order_id: order.id,
        details: {
          description,
          date: new Date(date),
        },
      }),
    );
    setAddData(addDataInitialState);
    setAdd(false);
  }

  function handleDeleteService(service_id: number) {
    dispatch(removeOrderService({ order_id: order.id, service_id }));
  }

  useEffect(() => {
    if (saveMode) {
      orderServicesData.map((oS) => {
        dispatch(
          updateOrderService({
            order_id: order.id,
            service_id: oS.id,
            details: {
              description: oS.description,
              date: oS.date,
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
        setOrderServicesData(tempServicesData);
      }
    } else {
      setTempServicesData(orderServicesData);
    }
  }, [editMode, saveMode]);

  useEffect(() => {
    if (!orderServicesInitialized) {
      dispatch(fetchOrderServices(order.id));
    } else {
      let currentServices = orderServicesData;
      const existingIds = new Set(currentServices.map((ptc) => ptc.id));
      const newServicesIds = new Set(orderServices.map((ptc) => ptc.id));
      const missingServices = orderServices.filter(
        (item) => !existingIds.has(item.id),
      );

      currentServices = currentServices.filter((ptc) =>
        newServicesIds.has(ptc.id),
      );
      const newUpdatedServices = [...currentServices, ...missingServices];
      setOrderServicesData(newUpdatedServices);
      setTempServicesData(newUpdatedServices);
    }
  }, [orderServicesInitialized, order, orderServices]);

  return orderServicesLoading ? (
    <Loader message="Fetching Order Services..." />
  ) : (
    <div
      style={{
        gridTemplateRows: `repeat(${orderServicesData.length + 1},1fr)`,
      }}
      className={styles.servicesDetails}
    >
      {serviceKeys.map((key) => (
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
          {serviceKeys.map((key, idx) => {
            const keyName = key.name.toLowerCase();
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
                      [keyName]: e.target.value,
                    };
                  })
                }
                value={
                  key.type == "date"
                    ? formatDate(addData[keyName])
                    : addData[keyName]
                }
                type={key.type}
                className={styles.valueOne}
              />
            );
          })}
          <button
            className={`${styles.actionBtn} ${styles.blue}`}
            onClick={() => handleAddService()}
          >
            <DoneIcon />
          </button>
        </>
      )}
      {orderServicesData.map((p_tc, idx) => {
        return (
          <React.Fragment key={idx}>
            {serviceKeys.map((key, keysIdx) => {
              const keyName = key.name.toLowerCase();
              return (
                <input
                  key={keysIdx}
                  readOnly={key.name == "Id"}
                  disabled={!editMode || key.name == "Id"}
                  type={key.type}
                  name={keyName}
                  className={styles.valueOne}
                  value={
                    key.type == "date"
                      ? formatDate(p_tc[keyName])
                      : key.key == "id"
                        ? idx + 1
                        : p_tc[keyName]
                  }
                  onChange={(e) =>
                    setOrderServicesData((prev) => {
                      const updatedServices = prev.map((p) => {
                        if (p.id === p_tc.id) {
                          return {
                            ...p,
                            [keyName]: e.target.value,
                          };
                        }
                        return p;
                      });
                      return updatedServices;
                    })
                  }
                />
              );
            })}
            <button
              disabled={!editMode}
              className={`${styles.actionBtn} ${editMode ? styles.red : styles.lightred}`}
              onClick={() => handleDeleteService(p_tc.id)}
            >
              <DeleteIcon />
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
