import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { type Order, type Order_a } from "../types/Order";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchOrders,
  resetCurrentOrder,
  updateOrder,
} from "../store/slices/ordersSlice";
import { setHeaderContent } from "../store/slices/headerSlice";
import { fetchStatuses } from "../store/slices/statusSlice";

import Loader from "./Loader";
import OrderGridCell from "../components/OrderGridCell";
import OverviewGridData from "../components/OverviewGridData";
import MaterialsGridData from "../components/MaterialsGridData";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import styles from "./styles/Order.module.css";
import HardwareGridData from "../components/HardwareGridData";
import BasicSelect from "../components/Select";
import SoftwareGridData from "../components/SoftwareGridData";
import PaymentTCGridData from "../components/PaymentTCGridData";
import ServiceGridData from "../components/ServiceGridData.tsx";
import MaterialsDispatchesGridData from "../components/MaterialsDispatchesGridData";
import { setOrderPaymentTCSInitializer } from "../store/slices/orderPaymentTCsSlice";
import { setOrderMaterialsInitializer } from "../store/slices/orderMaterialsSlice";
import {
  clearOrderMaterialDispatchesGlobal,
  setOrderMaterialDispatchesInitializer,
} from "../store/slices/orderMatDispatchesSlice";
import { setOrderServicessInitializer } from "../store/slices/orderServicesSlice.ts";
import { fetchDeliveryMediums } from "../store/slices/deliveryMediumsSlice.ts";
import MaterialsTable from "../components/MaterialsTable.tsx";
import Box from "@mui/material/Box";
import { sizeHeight, type SxProps } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import type { FieldKey } from "../types/FieldKey.ts";
import { compareDates } from "../utils/compareDates.ts";
import type { Material, MaterialDispatch } from "../types/Material.ts";

const orderInitialState: Order_a = {
  id: -1,
  po_number: -1,
  po_type: "",
  po_type_id: -1,
  total_services: -1,
  po_date: "",
  status_id: -1,
  status: "",
  party_id: -1,
  party: "",
  hardware_installation_date: "",
  hardware_installation_expected_date: "",
  hardware_installation_status: "",
  hardware_installation_status_id: -1,
  software_installation_date: "",
  software_installation_expected_date: "",
  software_installation_status: "",
  software_installation_status_id: -1,
};

const minimumDates: Record<string, { date: string }> = {
  purchase_date: { date: "order_date" },
  deliver_date: { date: "purchase_date" },
  // dispatch_date: { date: "deliver_date" },
  confirmation_date: { date: "dispatch_date" },
};

const overviewKeys: Array<FieldKey> = [
  { name: "PO Number", key: "po_number", type: "text", required: true },
  { name: "PO Date", key: "po_date", type: "date", required: true },
  { name: "PO Type", key: "po_type", type: "select", required: true },
  { name: "Party", key: "party", type: "select", required: true },
  { name: "Status", key: "status", type: "select", required: true },
];

const serviceKey: FieldKey = {
  name: "Total Services",
  key: "total_services",
  type: "number",
  required: true,
};

const hardwareKeys: Array<FieldKey> = [
  {
    name: "Installation Date",
    key: "hardware_installation_date",
    type: "date",
  },
  {
    name: "Expected Installation Date",
    key: "hardware_installation_expected_date",
    type: "date",
    required: true,
  },
  {
    name: "Installation Status",
    key: "hardware_installation_status",
    type: "select",
    required: true,
  },
];

const softwareKeys: Array<FieldKey> = [
  {
    name: "Installation Date",
    key: "software_installation_date",
    type: "date",
  },
  {
    name: "Expected Installation Date",
    key: "software_installation_expected_date",
    type: "date",
    required: true,
  },
  {
    name: "Installation Status",
    key: "software_installation_status",
    type: "select",
    required: true,
  },
];

const materialsKeys = [
  // { name: "Id", type: "number", key: "id" },
  { name: "Item", type: "select", key: "item", required: true },
  { name: "Quantity", type: "number", key: "quantity", required: true },
  { name: "Order Date", type: "date", key: "order_date", required: true },
  { name: "Purchase Date", type: "date", key: "purchase_date" },
  { name: "Deliver Date", type: "date", key: "deliver_date" },
];

const materialDispatchesKeys = [
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

function formatDate(value: unknown): string {
  if (!value) return "";

  const date = new Date(value as string | number);

  return !Number.isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
}

function toInputValue(value: unknown): string {
  return value == null ? "" : String(value);
}

export default function Order() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const {
    orders,
    currentOrder,
    loading: ordersLoading,
    initialized: ordersInitialized,
  } = useAppSelector((state) => state.orders);

  const { statuses, initialized: statusesInitialized } = useAppSelector(
    (state) => state.statuses,
  );

  const { deliveryMediums, initialized: deliveryMediumsInitialized } =
    useAppSelector((state) => state.deliveryMediums);

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldError, setFieldError] = useState(false);
  const [order, setOrder] = useState<Order_a | null>(orderInitialState);
  const [editMode, setEditMode] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [tempOrder, setTempOrder] = useState<Order_a | null>(null);
  const [orderServicesData, setOrderServicesData] = useState([]);
  const [orderMaterialsData, setOrderMaterialsData] = useState<Array<Material>>(
    [],
  );
  const [orderMaterialDispatchesData, setOrderMaterialDispatchesData] =
    useState<Array<MaterialDispatch>>([]);

  // const [currentOrder, setCurrentOrder] = useState<Order | undefined>(
  //   undefined,
  // );
  const [statusItems, setStatusItems] = useState<
    Array<{ id: number; value: string }>
  >([]);

  // reset
  useEffect(() => {
    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setErrorMsg("Invalid Order Id");
      setOrder(orderInitialState);
      // setTempOrder(orderInitialState);
      return;
    }

    setOrder(null);
    // setTempOrder(null);
    setErrorMsg("");
    dispatch(setOrderPaymentTCSInitializer(false));
    dispatch(setOrderMaterialsInitializer(false));
    dispatch(setOrderServicessInitializer(false));
    dispatch(setOrderMaterialDispatchesInitializer(false));
    dispatch(clearOrderMaterialDispatchesGlobal());
  }, []);

  // Fetch current order details
  useEffect(() => {
    let curOrder;
    if (currentOrder || ordersInitialized) {
      if (currentOrder) {
        curOrder = currentOrder;
        dispatch(resetCurrentOrder());
      } else {
        curOrder = orders.filter((o) => o.id === Number(id))[0];
      }
      if (!curOrder) {
        setErrorMsg("Order not found");
        setOrder(orderInitialState);
        // setTempOrder(orderInitialState);
        return;
      } else {
        setOrder(curOrder);
        // setTempOrder(curOrder);
      }
    } else {
      dispatch(fetchOrders());
    }
  }, [ordersInitialized, dispatch, id, currentOrder, order]);

  // Fetch statuses.
  useEffect(() => {
    if (!statusesInitialized) {
      dispatch(fetchStatuses());
    } else {
      const sItems = statuses.map((s) => {
        return { id: s.id, value: s.status };
      });
      let currentOrderState = order;
      if (currentOrderState != null) {
        const hardwareStatusId = Number(
          currentOrderState.hardware_installation_status_id,
        );
        const softwareStatusId = Number(
          currentOrderState.software_installation_status_id,
        );
        const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
        const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
        currentOrderState = {
          ...currentOrderState,
          hardware_installation_status: hardwareStatus[0]
            ? hardwareStatus[0].status
            : "",
          software_installation_status: softwareStatus[0]
            ? softwareStatus[0].status
            : "",
        };
      }
      setOrder(currentOrderState);
      // setTempOrder(currentOrderState);
      // setOrder((prev) => {
      //   if (prev == null) {
      //     return prev;
      //   }
      //   const hardwareStatusId = Number(prev.hardware_installation_status_id);
      //   const softwareStatusId = Number(prev.software_installation_status_id);
      //   const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
      //   const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
      //   return {
      //     ...prev,
      //     hardware_installation_status: hardwareStatus[0]
      //       ? hardwareStatus[0].status
      //       : "",
      //     software_installation_status: softwareStatus[0]
      //       ? softwareStatus[0].status
      //       : "",
      //   };
      // });
      setStatusItems(sItems);
    }
  }, [statusesInitialized, dispatch]);

  useEffect(() => {
    if (ordersInitialized) {
      setOrder(orders.filter((o) => o.id === Number(id))[0]);
    }
  }, [ordersInitialized, orders]);

  // Fetch delivery mediums.
  useEffect(() => {
    if (!deliveryMediumsInitialized) {
      dispatch(fetchDeliveryMediums());
    } else {
      const delMedItems = deliveryMediums.map((delMed) => {
        return { id: delMed.id, value: delMed.medium };
      });
      let currentOrderState = order;
      if (currentOrderState != null) {
        const hardwareStatusId = Number(
          currentOrderState.hardware_installation_status_id,
        );
        const softwareStatusId = Number(
          currentOrderState.software_installation_status_id,
        );
        const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
        const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
        currentOrderState = {
          ...currentOrderState,
          hardware_installation_status: hardwareStatus[0]
            ? hardwareStatus[0].status
            : "",
          software_installation_status: softwareStatus[0]
            ? softwareStatus[0].status
            : "",
        };
      }
      setOrder(currentOrderState);
      // setTempOrder(currentOrderState);
      // setOrder((prev) => {
      //   if (prev == null) {
      //     return prev;
      //   }
      //   const hardwareStatusId = Number(prev.hardware_installation_status_id);
      //   const softwareStatusId = Number(prev.software_installation_status_id);
      //   const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
      //   const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
      //   return {
      //     ...prev,
      //     hardware_installation_status: hardwareStatus[0]
      //       ? hardwareStatus[0].status
      //       : "",
      //     software_installation_status: softwareStatus[0]
      //       ? softwareStatus[0].status
      //       : "",
      //   };
      // });
    }
  }, [statusesInitialized, dispatch]);

  // save order
  useEffect(() => {
    if (saveMode) {
      setSaveMode(false);
      if (order == null) {
        return;
      }

      let requiredFields: Array<FieldKey> = [
        { name: "PO Number", key: "po_number", type: "text", required: true },
        { name: "PO Date", key: "po_date", type: "date", required: true },
        { name: "PO Type", key: "po_type_id", type: "number", required: true },
        { name: "Party", key: "party_id", type: "number", required: true },
        { name: "Status", key: "status_id", type: "number", required: true },
      ];
      if (order.po_type_id == 1) {
        requiredFields = [
          ...requiredFields,
          ...hardwareKeys,
          {
            name: "Hardware Installation Status ID",
            key: "hardware_installation_status_id",
            type: "number",
            required: true,
          },
          ...softwareKeys,
          {
            name: "Software Installation Status ID",
            key: "software_installation_status_id",
            type: "number",
            required: true,
          },
        ];
      } else if (order.po_type_id == 2) {
        requiredFields = [...requiredFields, serviceKey];
      } else {
        setFieldError(true);
        return;
      }

      // let orderFieldError = false;

      // for (const reqField of requiredFields) {
      //   if (!order[reqField.key] && (reqField.required ?? false)) {
      //     setFieldError(true);
      //     orderFieldError = true;
      //     break;
      //   }
      // }

      // if (orderFieldError) {
      //   setSaveMode(false);
      //   setEditMode(true);
      //   return;
      // } else {
      //   setFieldError(false);
      // }
      // const updatedOrderDetails = {
      //   po_date: order.po_date,
      //   status_id: Number(order.status_id),
      //   party_id: Number(order.party_id),
      //   po_number: order.po_number,
      //   po_type_id: Number(order.po_type_id),

      //   total_services: Number(order.total_services),
      //   hardware_installation_date: order.hardware_installation_date,
      //   hardware_installation_status_id: Number(
      //     order.hardware_installation_status_id,
      //   ),
      //   software_installation_date: order.software_installation_date,
      //   software_installation_status_id: Number(
      //     order.software_installation_status_id,
      //   ),
      //   hardware_installation_expected_date:
      //     order.hardware_installation_expected_date,

      //   software_installation_expected_date:
      //     order.software_installation_expected_date,
      // };

      const updatedOrderDetails = {};

      requiredFields.forEach((reqField) => {
        const { key, type } = reqField;
        const value = order[key];
        updatedOrderDetails[key] = type == "number" ? Number(value) : value;
      });

      dispatch(
        updateOrder({
          id: Number(order.id),
          details: updatedOrderDetails,
        }),
      );
    }
  }, [saveMode]);

  useEffect(() => {
    if (!editMode) {
      if (!saveMode) {
        setOrder(tempOrder);
      }
    } else {
      setTempOrder(order);
    }
  }, [editMode, saveMode]);

  // Update the header.
  useEffect(() => {
    dispatch(setHeaderContent(`Order (id:${order?.id})`));
  }, [dispatch, order, editMode]);

  // Start editing and preserve the original form values.
  function handleStartEdit() {
    // setTempOrder(order);
    setSaveMode(false);
    setEditMode(true);
  }

  // Cancel editing and restore the original form values.
  function handleCancelEdit() {
    if (tempOrder !== null) {
      setOrder({ ...tempOrder });
    }

    // setTempOrder(null);
    setSaveMode(false);
    setEditMode(false);
  }

  // Trigger the save behavior used by the child components.
  function handleSaveMode() {
    if (order == null) {
      return;
    }
    setFieldError(false);

    let requiredFields: Array<FieldKey> = [
      { name: "PO Number", key: "po_number", type: "text", required: true },
      { name: "PO Date", key: "po_date", type: "date", required: true },
      { name: "PO Type", key: "po_type_id", type: "number", required: true },
      { name: "Party", key: "party_id", type: "number", required: true },
      { name: "Status", key: "status_id", type: "number", required: true },
    ];
    if (order.po_type_id == 1) {
      requiredFields = [
        ...requiredFields,
        ...hardwareKeys,
        {
          name: "Hardware Installation Status ID",
          key: "hardware_installation_status_id",
          type: "number",
          required: true,
        },
        ...softwareKeys,
        {
          name: "Software Installation Status ID",
          key: "software_installation_status_id",
          type: "number",
          required: true,
        },
      ];
    } else if (order.po_type_id == 2) {
      requiredFields = [...requiredFields, serviceKey];
    } else {
      setFieldError(true);
      return;
    }

    let orderFieldError = false;

    for (const reqField of requiredFields) {
      if (!order[reqField.key] && (reqField.required ?? false)) {
        setFieldError(true);
        orderFieldError = true;
        break;
      }
    }

    if (orderFieldError) {
      return;
    } else {
      setFieldError(false);
    }

    const order_po_date = order?.po_date;
    const order_po_type: number = order?.po_type_id
      ? Number(order?.po_type_id)
      : -1;
    if (order_po_type == 1) {
      for (const hardwareInfoUnitKey of hardwareKeys) {
        if (hardwareInfoUnitKey.type == "date") {
          if (
            order[hardwareInfoUnitKey.key] &&
            !compareDates(order_po_date, order[hardwareInfoUnitKey.key])
          ) {
            return;
          }
        }
      }
      for (const softwareInfoUnitKey of softwareKeys) {
        if (softwareInfoUnitKey.type == "date") {
          if (
            order[softwareInfoUnitKey.key] &&
            !compareDates(order_po_date, order[softwareInfoUnitKey.key])
          ) {
            return;
          }
        }
      }
      for (const material of orderMaterialsData) {
        for (const field of materialsKeys) {
          if (field.type == "date") {
            const key = field.key;
            const value = formatDate(material[key]);
            const compareToDate = formatDate(
              Object.hasOwn(minimumDates, key)
                ? material[minimumDates[key].date]
                : order["po_date"],
            );
            if (value && !compareDates(compareToDate, value)) {
              return;
            }
          }
        }
      }

      for (const materialDispatch of orderMaterialDispatchesData) {
        for (const field of materialDispatchesKeys) {
          if (field.type == "date") {
            const key = field.key;
            const value = formatDate(materialDispatch[key]);
            const material = orderMaterialsData.filter(
              (m) => m.id == materialDispatch.material_id,
            )[0];
            const compareToDate = formatDate(
              Object.hasOwn(minimumDates, key)
                ? materialDispatch[minimumDates[key].date]
                : material["deliver_date"],
            );
            if (value && !compareDates(compareToDate, value)) {
              return;
            }
          }
        }
      }
      // return;
    } else if (order_po_type == 2) {
      for (const odrService of orderServicesData) {
        if (!compareDates(order_po_date, odrService.date)) {
          return;
        }
      }
    } else {
      return;
    }
    setSaveMode(true);
    setEditMode(false);
  }

  function handleHardwareStatusChange(id: number) {
    const status = statuses.find((item) => item.id === id);

    setOrder((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        hardware_installation_status: status?.status ?? "",
        hardware_installation_status_id:
          status?.id ?? prev.hardware_installation_status_id,
      };
    });
  }

  function handleSoftwareStatusChange(id: number) {
    const status = statuses.find((item) => item.id === id);

    setOrder((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        software_installation_status: status?.status ?? "",
        software_installation_status_id:
          status?.id ?? prev.software_installation_status_id,
      };
    });
  }

  if (errorMsg) {
    return <h1>{errorMsg}</h1>;
  }

  return ordersInitialized ? (
    ordersLoading ? (
      <Loader message="Loading Order" />
    ) : order && order?.id !== -1 ? (
      <div className={styles.containerContainer}>
        <div className={styles.container}>
          <div
            className={`${styles.orderGrid} ${order?.po_type_id == 2 ? styles.orderGrid_b : styles.orderGrid_a}`}
          >
            <OrderGridCell gridArea={"a"} title="Overview">
              <OverviewGridData
                fields={overviewKeys}
                key={order.id}
                order={order}
                editMode={editMode}
                updateOrder={setOrder}
                formatDate={formatDate}
                saveMode={saveMode}
                fieldError={fieldError}
              />
            </OrderGridCell>
            {order.po_type_id == 1 ? (
              <>
                <OrderGridCell gridArea={"d"} title="Materials">
                  <MaterialsTable
                    fields={materialsKeys}
                    order={order}
                    formatDate={formatDate}
                    editMode={editMode}
                    saveMode={saveMode}
                    orderMaterialDispatchesData={orderMaterialDispatchesData}
                    setOrderMaterialDispatchesData={
                      setOrderMaterialDispatchesData
                    }
                    orderMaterialsData={orderMaterialsData}
                    setOrderMaterialsData={setOrderMaterialsData}
                  />
                </OrderGridCell>
                {/* <OrderGridCell gridArea={"d"} title="Materials">
                <MaterialsGridData
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  editMode={editMode}
                  saveMode={saveMode}
                />
              </OrderGridCell>

              <OrderGridCell gridArea={"e"} title={"Materials Dispatches"}>
                <MaterialsDispatchesGridData
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  editMode={editMode}
                  saveMode={saveMode}
                />
              </OrderGridCell> */}

                <div
                  className={styles.installationContainer}
                  style={{ gridArea: "fg" }}
                >
                  <OrderGridCell gridArea={"f"} title={"Hardware"}>
                    <HardwareGridData
                      key={order.id}
                      fields={hardwareKeys}
                      order={order}
                      formatDate={formatDate}
                      editMode={editMode}
                      updateOrder={setOrder}
                      fieldError={fieldError}
                    >
                      <BasicSelect
                        options={statusItems}
                        selectedOption={{
                          id: order.hardware_installation_status_id,
                          value: order.hardware_installation_status,
                        }}
                        handleOptionChange={handleHardwareStatusChange}
                        isDisabled={!editMode}
                      />
                    </HardwareGridData>
                  </OrderGridCell>
                  <OrderGridCell gridArea={"g"} title={"Software"}>
                    <SoftwareGridData
                      fields={softwareKeys}
                      key={order.id}
                      order={order}
                      formatDate={formatDate}
                      editMode={editMode}
                      updateOrder={setOrder}
                      fieldError={fieldError}
                    >
                      <BasicSelect
                        options={statusItems}
                        selectedOption={{
                          id: order.software_installation_status_id,
                          value: order.software_installation_status,
                        }}
                        handleOptionChange={handleSoftwareStatusChange}
                        isDisabled={!editMode}
                      />
                    </SoftwareGridData>
                  </OrderGridCell>
                </div>
              </>
            ) : (
              <>
                <OrderGridCell gridArea={"b"} title={"Services"}>
                  <ServiceGridData
                    key={order.id}
                    order={order}
                    editMode={editMode}
                    saveMode={saveMode}
                    formatDate={formatDate}
                    orderServicesData={orderServicesData}
                    setOrderServicesData={setOrderServicesData}
                    fieldError={fieldError}
                  />
                </OrderGridCell>
              </>
            )}
            <OrderGridCell gridArea={"c"} title={"Payment Terms & Conditions"}>
              <PaymentTCGridData
                key={order.id}
                order={order}
                editMode={editMode}
                saveMode={saveMode}
              />
            </OrderGridCell>
          </div>
        </div>
        <div className={styles.orderOperationsHeader}>
          <div>
            {editMode && (
              <button
                type="button"
                onClick={handleSaveMode}
                aria-label="Save order"
              >
                <SaveIcon sx={{ fontSize: "2rem" }} />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setEditMode((prev) => !prev);
                setSaveMode(false);
                setFieldError(false);
              }}
              aria-label={editMode ? "Cancel editing" : "Edit order"}
            >
              {editMode ? (
                <KeyboardReturnIcon sx={{ fontSize: "2rem" }} />
              ) : (
                <EditIcon sx={{ fontSize: "2rem" }} />
              )}
            </button>
          </div>
        </div>
      </div>
    ) : (
      <Loader message="Fetching Order info" />
    )
  ) : (
    <Loader message="Fetching Order" />
  );
}
