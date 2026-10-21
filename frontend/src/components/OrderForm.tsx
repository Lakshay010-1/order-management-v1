import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setHeaderContent } from "../store/slices/headerSlice";
import AddIcon from "@mui/icons-material/Add";
import styles from "./styles/OrderForm.module.css";
import { fetchStatuses } from "../store/slices/statusSlice";
import { fetchItems } from "../store/slices/itemsSlice";
import { fetchParties } from "../store/slices/partySlice";
import { insertOrder } from "../store/slices/ordersSlice";
import type { NewOrder } from "../types/NewOrder";
import OrderFormOverview from "./OrderFormOverview";
import OrderFormItems from "./OrderFormItems";
import OrderFormMaterials from "./OrderFormMaterials";
// import OrderFormMaterialsDispatches from "./OrderFormMaterialsDispatches";
import OrderFormPaymentTCs from "./OrderFormPaymentTCs";
import OrderFormHardwareIns from "./OrderFormHardwareIns";
import OrderFormSoftwareIns from "./OrderFormSoftwareIns";
import OrderGridCell from "./OrderGridCell";
import { useNavigate } from "react-router-dom";

function createOptionsList(
  list: Array<any>,
  idField: string,
  valueField: string,
) {
  return list.map((element) => {
    return {
      id: element[idField],
      value: element[valueField],
    };
  });
}
const newOrderInitialState = {
  po_date: new Date(),
  hardware_installation_date: new Date(),
  software_installation_date: new Date(),
  hardware_installation_status_id: -1,
  software_installation_status_id: -1,
  status_id: -1,
  party_id: -1,
};

interface newItemAndMaterialState {
  id: string;
  item_id: number;
  quantity: number;
  date: Date;
}
// interface newMaterialDispatchState {
//   id: string;
//   material_id: number;
//   quantity: number;
//   date: Date;
// }
interface newPaymentTCState {
  id: string;
  term: string;
  fulfilled: boolean;
}

export default function OrderForm() {
  const dispatch = useAppDispatch();
  const [newOrder, setNewOrder] = useState<NewOrder>(newOrderInitialState);
  const navigate = useNavigate();

  const [addOrderStatus, setAddOrderStatus] = useState(false);

  const { currentOrder, error: ordersError } = useAppSelector(
    (state) => state.orders,
  );
  const { statuses, initialized: statusesInitialized } = useAppSelector(
    (state) => state.statuses,
  );
  const { parties, initialized: partiesInitialized } = useAppSelector(
    (state) => state.parties,
  );
  const { items, initialized: itemsInitialized } = useAppSelector(
    (state) => state.items,
  );

  const [orderItems, setOrderItems] = useState<Array<newItemAndMaterialState>>(
    [],
  );

  const [orderMaterials, setOrderMaterials] = useState<
    Array<newItemAndMaterialState>
  >([]);
  // const [orderMaterialsDispatches, setOrderMaterialsDispatches] = useState<
  //   Array<newMaterialDispatchState>
  // >([]);
  const [orderPaymentTCs, setOrderPaymentTCs] = useState<
    Array<newPaymentTCState>
  >([]);

  const [itemsOptions, setItemsOptions] = useState<
    Array<{ id: any; value: any }>
  >([]);
  const [partiesOptions, setPartiesOptions] = useState<
    Array<{ id: any; value: any }>
  >([]);
  const [statusesOptions, setStatusesOptions] = useState<
    Array<{ id: any; value: any }>
  >([]);

  const itemAndMaterialKeys = [
    {
      name: "Item",
      type: "select",
      key: "item_id",
    },
    {
      name: "Quantity",
      type: "number",
      key: "quantity",
    },
    {
      name: "Date",
      type: "date",
      key: "date",
    },
  ];
  // const MaterialDispatchKeys = [
  //   {
  //     name: "Material Id",
  //     type: "select",
  //     key: "material_id",
  //   },
  //   {
  //     name: "Quantity",
  //     type: "number",
  //     key: "quantity",
  //   },
  //   {
  //     name: "Date",
  //     type: "date",
  //     key: "date",
  //   },
  // ];
  const paymentTCKeys = [
    {
      name: "Term",
      type: "text",
      key: "term",
    },
    {
      name: "Fulfilled",
      type: "checkbox",
      key: "fulfilled",
    },
  ];

  useEffect(() => {
    if (currentOrder) {
      navigate(`/orders/${currentOrder.id}`, { replace: true });
    }
  }, [currentOrder]);

  useEffect(() => {
    if (addOrderStatus) {
      const newOdr = {
        ...newOrder,
        items: orderItems,
        materials: orderMaterials,
        payment_tcs: orderPaymentTCs,
      };
      dispatch(insertOrder(newOdr));
      setAddOrderStatus(false);
    }
  }, [addOrderStatus]);

  useEffect(() => {
    if (!itemsInitialized) {
      dispatch(fetchItems());
    } else {
      setItemsOptions(createOptionsList(items, "id", "item"));
    }
  }, [itemsInitialized]);

  useEffect(() => {
    if (!partiesInitialized) {
      dispatch(fetchParties());
    } else {
      setPartiesOptions(createOptionsList(parties, "id", "party"));
    }
  }, [partiesInitialized]);

  useEffect(() => {
    if (!statusesInitialized) {
      dispatch(fetchStatuses());
    } else {
      setStatusesOptions(createOptionsList(statuses, "id", "status"));
    }
  }, [statusesInitialized]);

  useEffect(() => {
    dispatch(
      setHeaderContent(
        <div className={styles.orderFormHeader}>
          <h2>New Order</h2>
          <button
            onClick={() => {
              setAddOrderStatus(true);
            }}
          >
            <AddIcon />
          </button>
        </div>,
      ),
    );
  }, [dispatch]);

  function formatDate(value: unknown): string {
    if (!value) return "";

    const date = new Date(value as string | number);

    return !Number.isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : "";
  }

  return (
    <div className={styles.container}>
      <div className={styles.orderGrid}>
        <div className={styles.overviewContainer}>
          <OrderGridCell gridArea="a" title="Overview" color="orange">
            <OrderFormOverview
              order={newOrder}
              handleChange={setNewOrder}
              partiesOptions={partiesOptions}
              statusesOption={statusesOptions}
              formatDate={formatDate}
            />
          </OrderGridCell>

          <OrderGridCell gridArea={""} title={"Hardware"} color={"blue"}>
            <OrderFormHardwareIns
              order={newOrder}
              handleChange={setNewOrder}
              statusesOptions={statusesOptions}
              formatDate={formatDate}
            />
          </OrderGridCell>
          <OrderGridCell gridArea={""} title={"Software"} color={"green"}>
            <OrderFormSoftwareIns
              order={newOrder}
              handleChange={setNewOrder}
              statusesOptions={statusesOptions}
              formatDate={formatDate}
            />
          </OrderGridCell>
        </div>
        <OrderGridCell gridArea="b" title="Items" color="red">
          <OrderFormItems
            fields={itemAndMaterialKeys}
            itemsOptions={itemsOptions}
            orderItems={orderItems}
            handleOrderItemsChange={setOrderItems}
            formatDate={formatDate}
          />
        </OrderGridCell>

        <OrderGridCell gridArea="f" title="Materials" color="gold">
          <OrderFormMaterials
            fields={itemAndMaterialKeys}
            itemsOptions={itemsOptions}
            orderMaterials={orderMaterials}
            handleOrderMaterialsChange={setOrderMaterials}
            formatDate={formatDate}
          />
        </OrderGridCell>

        <OrderGridCell
          gridArea={"e"}
          title={"Payment Terms & Conditions"}
          color={"yellow"}
        >
          <OrderFormPaymentTCs
            fields={paymentTCKeys}
            orderPaymentTCs={orderPaymentTCs}
            handleOrderPaymentTCsChange={setOrderPaymentTCs}
          />
        </OrderGridCell>
      </div>
    </div>
  );
}
