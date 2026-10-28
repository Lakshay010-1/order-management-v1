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

const orderInitialState: Order_a = {
  id: -1,
  po_number: -1,
  po_type: "",
  po_type_id: -1,
  total_services: -1,
  po_date: new Date("1000-01-01"),
  status_id: -1,
  status: "",
  party_id: -1,
  party: "",
  hardware_installation_date: new Date("1000-01-01"),
  hardware_installation_expected_date: new Date("1000-01-01"),
  hardware_installation_status: "",
  hardware_installation_status_id: -1,
  software_installation_date: new Date("1000-01-01"),
  software_installation_expected_date: new Date("1000-01-01"),
  software_installation_status: "",
  software_installation_status_id: -1,
};

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
  const [order, setOrder] = useState<Order_a | null>(orderInitialState);
  const [editMode, setEditMode] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [tempOrder, setTempOrder] = useState<Order_a | null>(null);
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
      return;
    }

    setOrder(null);
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
        return;
      } else {
        setOrder(curOrder);
      }
    } else {
      dispatch(fetchOrders());
    }
  }, [ordersInitialized, dispatch, id, currentOrder]);

  // Fetch statuses.
  useEffect(() => {
    if (!statusesInitialized) {
      dispatch(fetchStatuses());
    } else {
      const sItems = statuses.map((s) => {
        return { id: s.id, value: s.status };
      });
      setOrder((prev) => {
        if (prev == null) {
          return prev;
        }
        const hardwareStatusId = Number(prev.hardware_installation_status_id);
        const softwareStatusId = Number(prev.software_installation_status_id);
        const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
        const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
        return {
          ...prev,
          hardware_installation_status: hardwareStatus[0]
            ? hardwareStatus[0].status
            : "",
          software_installation_status: softwareStatus[0]
            ? softwareStatus[0].status
            : "",
        };
      });
      setStatusItems(sItems);
    }
  }, [statusesInitialized, dispatch]);

  // Fetch delivery mediums.
  useEffect(() => {
    if (!deliveryMediumsInitialized) {
      dispatch(fetchDeliveryMediums());
    } else {
      const delMedItems = deliveryMediums.map((delMed) => {
        return { id: delMed.id, value: delMed.medium };
      });
      setOrder((prev) => {
        if (prev == null) {
          return prev;
        }
        const hardwareStatusId = Number(prev.hardware_installation_status_id);
        const softwareStatusId = Number(prev.software_installation_status_id);
        const hardwareStatus = statuses.filter((s) => s.id == hardwareStatusId);
        const softwareStatus = statuses.filter((s) => s.id == softwareStatusId);
        return {
          ...prev,
          hardware_installation_status: hardwareStatus[0]
            ? hardwareStatus[0].status
            : "",
          software_installation_status: softwareStatus[0]
            ? softwareStatus[0].status
            : "",
        };
      });
    }
  }, [statusesInitialized, dispatch]);

  // save order
  useEffect(() => {
    if (saveMode) {
      if (order == null) {
        return;
      }
      dispatch(
        updateOrder({
          id: Number(order.id),
          details: {
            po_date: new Date(order.po_date),
            po_number: Number(order.po_number),
            po_type_id: Number(order.po_type_id),
            total_services: Number(order.total_services),
            hardware_installation_date: new Date(
              order.hardware_installation_date,
            ),
            software_installation_date: new Date(
              order.software_installation_date,
            ),
            hardware_installation_expected_date: new Date(
              order.hardware_installation_date,
            ),
            software_installation_expected_date: new Date(
              order.software_installation_date,
            ),
            software_installation_status_id: Number(
              order.software_installation_status_id,
            ),
            hardware_installation_status_id: Number(
              order.hardware_installation_status_id,
            ),
            status_id: Number(order.status_id),
            party_id: Number(order.party_id),
          },
        }),
      );
    }
  }, [saveMode]);

  // Update the header.
  useEffect(() => {
    dispatch(
      setHeaderContent(
        <div className={styles.orderOperationsHeader}>
          <h2>Order (id: {order?.id})</h2>

          <button
            type="button"
            onClick={() => setEditMode((prev) => !prev)}
            // onClick={editMode ? handleCancelEdit : handleStartEdit}
            aria-label={editMode ? "Cancel editing" : "Edit order"}
          >
            {editMode ? <KeyboardReturnIcon /> : <EditIcon />}
          </button>

          {editMode && (
            <button
              type="button"
              onClick={handleSaveMode}
              aria-label="Save order"
            >
              <SaveIcon />
            </button>
          )}
        </div>,
      ),
    );
  }, [dispatch, order?.id, editMode]);

  // Start editing and preserve the original form values.
  function handleStartEdit() {
    setTempOrder(order);
    setSaveMode(false);
    setEditMode(true);
  }

  // Cancel editing and restore the original form values.
  function handleCancelEdit() {
    if (tempOrder !== null) {
      setOrder({ ...tempOrder });
    }

    setTempOrder(null);
    setSaveMode(false);
    setEditMode(false);
  }

  // Trigger the save behavior used by the child components.
  function handleSaveMode() {
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
      <div className={styles.container}>
        <div
          className={`${styles.orderGrid} ${order?.po_type_id == 2 ? "" : styles.orderGrid_a}`}
        >
          <OrderGridCell gridArea="a" title="Overview">
            <OverviewGridData
              key={order.id}
              order={order}
              editMode={editMode}
              updateOrder={setOrder}
              formatDate={formatDate}
              saveMode={saveMode}
            />
          </OrderGridCell>

          <OrderGridCell gridArea="d" title="Materials">
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
          </OrderGridCell>

          {order?.po_type_id == 2 && (
            <OrderGridCell gridArea={"b"} title={"Services"}>
              <ServiceGridData
                key={order.id}
                order={order}
                editMode={editMode}
                saveMode={saveMode}
                formatDate={formatDate}
              />
            </OrderGridCell>
          )}
          <OrderGridCell gridArea={"c"} title={"Payment Terms & Conditions"}>
            <PaymentTCGridData
              key={order.id}
              order={order}
              editMode={editMode}
              saveMode={saveMode}
            />
          </OrderGridCell>

          <OrderGridCell gridArea={"f"} title={"Hardware"}>
            <HardwareGridData
              key={order.id}
              order={order}
              formatDate={formatDate}
              editMode={editMode}
              updateOrder={setOrder}
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
              key={order.id}
              order={order}
              formatDate={formatDate}
              editMode={editMode}
              updateOrder={setOrder}
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
      </div>
    ) : (
      <Loader message="Fetching Order info" />
    )
  ) : (
    <Loader message="Fetching Order" />
  );
}
