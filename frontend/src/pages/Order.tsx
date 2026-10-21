import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { type Order } from "../types/Order";
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
import ItemsGridData from "../components/ItemsGridData";
import MaterialsGridData from "../components/MaterialsGridData";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

import styles from "./styles/Order.module.css";
import HardwareGridData from "../components/HardwareGridData";
import BasicSelect from "../components/Select";
import SoftwareGridData from "../components/SoftwareGridData";
import PaymentTCGridData from "../components/PaymentTCGridData";
import MaterialsDispatchesGridData from "../components/MaterialsDispatchesGridData";
import { setOrderPaymentTCSInitializer } from "../store/slices/orderPaymentTCsSlice";
import { setOrderMaterialsInitializer } from "../store/slices/orderMaterialsSlice";
import {
  clearOrderMaterialDispatchesGlobal,
  setOrderMaterialDispatchesInitializer,
} from "../store/slices/orderMatDispatchesSlice";
import { setOrderItemsInitializer } from "../store/slices/orderItemsSlice";

type OrderFormState = {
  id: string;
  po_date: string;
  status_id: string;
  status: string;
  party_id: string;
  party: string;
  hardware_installation_date: string;
  hardware_installation_status: string;
  hardware_installation_status_id: string;
  software_installation_date: string;
  software_installation_status: string;
  software_installation_status_id: string;
};

const orderInitialState: OrderFormState = {
  id: "",
  po_date: "",
  status_id: "",
  status: "",
  party_id: "",
  party: "",
  hardware_installation_date: "",
  hardware_installation_status: "",
  hardware_installation_status_id: "",
  software_installation_date: "",
  software_installation_status: "",
  software_installation_status_id: "",
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
    loading: ordersLoading,
    initialized: ordersInitialized,
  } = useAppSelector((state) => state.orders);

  const { statuses, initialized: statusesInitialized } = useAppSelector(
    (state) => state.statuses,
  );

  const [errorMsg, setErrorMsg] = useState("");
  const [order, setOrder] = useState<OrderFormState>(orderInitialState);
  const [editMode, setEditMode] = useState(false);
  const [saveMode, setSaveMode] = useState(false);
  const [tempOrder, setTempOrder] = useState<OrderFormState | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(
    undefined,
  );
  const [statusItems, setStatusItems] = useState<
    Array<{ id: number; value: string }>
  >([]);

  useEffect(() => {
    dispatch(resetCurrentOrder());
  }, []);

  // Fetch orders.
  useEffect(() => {
    if (!ordersInitialized) {
      dispatch(fetchOrders());
    }
  }, [ordersInitialized, dispatch]);

  // Fetch statuses.
  useEffect(() => {
    if (!statusesInitialized) {
      dispatch(fetchStatuses());
    }
  }, [statusesInitialized, dispatch]);

  useEffect(() => {
    setCurrentOrder(orders.find((item) => item.id === Number(id)));
    dispatch(setOrderPaymentTCSInitializer(false));
    dispatch(setOrderMaterialsInitializer(false));
    dispatch(setOrderMaterialDispatchesInitializer(false));
    dispatch(setOrderItemsInitializer(false));
    dispatch(clearOrderMaterialDispatchesGlobal());
  }, [id]);

  useEffect(() => {
    if (statusesInitialized) {
      const sItems = statuses.map((s) => {
        return { id: s.id, value: s.status };
      });
      setOrder((prev) => {
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
    } else {
      dispatch(fetchStatuses());
    }
  }, [statuses, statusesInitialized]);

  // Populate the form when the selected order becomes available.
  // Do not overwrite the user's changes while editing or saving.
  useEffect(() => {
    if (!ordersInitialized) return;
    if (editMode || saveMode) return;
    setOrder(null);

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      setErrorMsg("Invalid Order Id");
      setOrder(orderInitialState);
      return;
    }

    if (!currentOrder) {
      setErrorMsg("Order not found");
      setOrder(orderInitialState);
      return;
    }

    setErrorMsg("");

    setOrder({
      id: toInputValue(currentOrder.id),
      po_date: formatDate(currentOrder.po_date),
      status_id: toInputValue(currentOrder.status_id),
      status: toInputValue(currentOrder.status),
      party_id: toInputValue(currentOrder.party_id),
      party: toInputValue(currentOrder.party),

      hardware_installation_date: formatDate(
        currentOrder.hardware_installation_date,
      ),
      hardware_installation_status: "",
      hardware_installation_status_id: toInputValue(
        currentOrder.hardware_installation_status_id,
      ),

      software_installation_date: formatDate(
        currentOrder.software_installation_date,
      ),
      software_installation_status: "",
      software_installation_status_id: toInputValue(
        currentOrder.software_installation_status_id,
      ),
    });
  }, [id, ordersInitialized, currentOrder, editMode, saveMode]);

  // Convert installation status IDs into their display labels.
  // Only update the status labels, not the other form fields.
  useEffect(() => {
    if (!statusesInitialized) return;

    setOrder((prev) => {
      const hardwareStatus = statuses.find(
        (item) => item.id === Number(prev.hardware_installation_status_id),
      );

      const softwareStatus = statuses.find(
        (item) => item.id === Number(prev.software_installation_status_id),
      );

      const hardwareLabel = hardwareStatus?.status ?? "";
      const softwareLabel = softwareStatus?.status ?? "";

      if (
        prev.hardware_installation_status === hardwareLabel &&
        prev.software_installation_status === softwareLabel
      ) {
        return prev;
      }

      return {
        ...prev,
        hardware_installation_status: hardwareLabel,
        software_installation_status: softwareLabel,
      };
    });
  }, [statuses, statusesInitialized]);

  // Start editing and preserve the original form values.
  function handleStartEdit() {
    setTempOrder({ ...order });
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

    setOrder((prev) => ({
      ...prev,
      hardware_installation_status: status?.status ?? "",
      hardware_installation_status_id: toInputValue(status?.id),
    }));
  }

  function handleSoftwareStatusChange(id: number) {
    const status = statuses.find((item) => item.id === id);

    setOrder((prev) => ({
      ...prev,
      software_installation_status: status?.status ?? "",
      software_installation_status_id: toInputValue(status?.id),
    }));
  }

  useEffect(() => {
    if (saveMode) {
      dispatch(
        updateOrder({
          id: Number(order.id),
          details: {
            po_date: new Date(order.po_date),
            hardware_installation_date: new Date(
              order.hardware_installation_date,
            ),
            software_installation_date: new Date(
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

  // Update the application header.
  useEffect(() => {
    dispatch(
      setHeaderContent(
        <div className={styles.orderOperationsHeader}>
          <h2>Order (id: {order.id})</h2>

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
  }, [dispatch, order.id, editMode]);

  if (!ordersInitialized) {
    return ordersLoading ? (
      <Loader message="Fetching Order" />
    ) : (
      <Loader message="Loading Order" />
    );
  }

  if (errorMsg) {
    return <h1>{errorMsg}</h1>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.orderGrid}>
        <OrderGridCell gridArea="a" title="Overview" color="orange">
          <OverviewGridData
            key={order.id}
            order={order}
            editMode={editMode}
            updateOrder={setOrder}
            saveMode={saveMode}
          />
        </OrderGridCell>

        <OrderGridCell gridArea="b" title="Items" color="red">
          <ItemsGridData
            key={order.id}
            order={order}
            formatDate={formatDate}
            editMode={editMode}
            saveMode={saveMode}
          />
        </OrderGridCell>

        <OrderGridCell gridArea="f" title="Materials" color="gold">
          <MaterialsGridData
            key={order.id}
            order={order}
            formatDate={formatDate}
            editMode={editMode}
            saveMode={saveMode}
          />
        </OrderGridCell>

        <OrderGridCell
          gridArea={"g"}
          title={"Materials Dispatches"}
          color={"lightblue"}
        >
          <MaterialsDispatchesGridData
            key={order.id}
            order={order}
            formatDate={formatDate}
            editMode={editMode}
            saveMode={saveMode}
          />
        </OrderGridCell>

        <OrderGridCell
          gridArea={"e"}
          title={"Payment Terms & Conditions"}
          color={"yellow"}
        >
          <PaymentTCGridData
            key={order.id}
            order={order}
            editMode={editMode}
            saveMode={saveMode}
          />
        </OrderGridCell>

        <OrderGridCell gridArea={""} title={"Hardware"} color={"blue"}>
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
        <OrderGridCell gridArea={""} title={"Software"} color={"green"}>
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
  );
}
