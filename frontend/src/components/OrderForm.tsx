import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setHeaderContent } from "../store/slices/headerSlice";
import AddIcon from "@mui/icons-material/Add";
import styles from "./styles/OrderForm.module.css";
import { fetchStatuses } from "../store/slices/statusSlice";
import { fetchItems } from "../store/slices/itemsSlice";
import { fetchParties } from "../store/slices/partySlice";
import { insertOrder } from "../store/slices/ordersSlice";
import type { NewOrder_a } from "../types/Order";
import OrderFormOverview from "./OrderFormOverview";
import OrderFormItems from "./OrderFormItems";
import OrderFormMaterials from "./OrderFormMaterials";
// import OrderFormMaterialsDispatches from "./OrderFormMaterialsDispatches";
import OrderFormPaymentTCs from "./OrderFormPaymentTCs";
import OrderFormHardwareIns from "./OrderFormHardwareIns";
import OrderFormSoftwareIns from "./OrderFormSoftwareIns";
import OrderGridCell from "./OrderGridCell";
import { useNavigate } from "react-router-dom";
import { fetchPoTypes } from "../store/slices/poTypesSlice";
import OrderFormServies from "./OrderFormServices";

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
  po_number: "",
  po_type_id: "",
  status_id: "",
  party_id: "",
  total_services: "",
  hardware_installation_date: "",
  software_installation_date: "",
  hardware_installation_expected_date: "",
  software_installation_expected_date: "",
  hardware_installation_status_id: "",
  software_installation_status_id: "",
};

interface newItemAndMaterialState {
  id: string;
  item_id: number;
  quantity: number;
  date: Date;
}

interface newServiceState {
  id: string;
  description: string;
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
  const [newOrder, setNewOrder] = useState<NewOrder_a>(newOrderInitialState);
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
  const { poTypes, initialized: poTypesInitialized } = useAppSelector(
    (state) => state.poTypes,
  );

  const [orderServices, setOrderServices] = useState<Array<newServiceState>>(
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
  const [poTypesOptions, setPoTypesOptions] = useState<
    Array<{ id: any; value: any }>
  >([]);

  const servicesKeys = [
    { name: "Description", type: "text", key: "description", required: false },
    { name: "Date", type: "date", key: "date", required: true },
  ];

  const materialKeys = [
    {
      name: "Item",
      type: "select",
      key: "item_id",
      required: true,
    },
    {
      name: "Quantity",
      type: "number",
      key: "quantity",
      required: true,
    },
    {
      name: "Order Date",
      type: "date",
      key: "order_date",
      required: true,
    },
    {
      name: "Purchase Date",
      type: "date",
      key: "purchase_date",
    },
    {
      name: "Deliver Date",
      type: "date",
      key: "deliver_date",
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
      required: true,
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
      const {
        po_date,
        po_number,
        po_type_id,
        status_id,
        party_id,
        total_services,
        hardware_installation_date,
        hardware_installation_expected_date,
        hardware_installation_status_id,
        software_installation_date,
        software_installation_expected_date,
        software_installation_status_id,
      } = newOrder;
      const newOdr_a = {
        po_date: formatDate(po_date),
        po_number: Number(po_number),
        po_type_id,
        status_id,
        party_id,
        payment_tcs: orderPaymentTCs,
      };
      const newOdr_b = {
        hardware_installation_expected_date: formatDate(
          hardware_installation_expected_date,
        ),
        software_installation_expected_date: formatDate(
          software_installation_expected_date,
        ),
        hardware_installation_status_id,
        software_installation_status_id,
        materials: orderMaterials,
      };
      if (software_installation_date) {
        newOdr_b["software_installation_date"] = formatDate(
          software_installation_date,
        );
      }
      if (hardware_installation_date) {
        newOdr_b["hardware_installation_date"] = formatDate(
          hardware_installation_date,
        );
      }
      const newOdr_c = {
        services: orderServices,
        total_services: Number(total_services),
      };
      const newOdr = {
        ...newOdr_a,
        ...(po_type_id == 1 ? newOdr_b : newOdr_c),
      };
      dispatch(insertOrder(newOdr));
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
    if (!poTypesInitialized) {
      dispatch(fetchPoTypes());
    } else {
      setPoTypesOptions(createOptionsList(poTypes, "id", "type"));
    }
  }, [poTypesInitialized]);

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
    const dateStr = !Number.isNaN(date.getTime())
      ? date.toISOString().split("T")[0]
      : "";
    return dateStr;
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.orderGrid} ${!newOrder.po_type_id || newOrder.po_type_id == 1 ? styles.orderGrid_a : styles.orderGrid_b}`}
      >
        {/* <div style={{ gridArea: "a" }} className={styles.firstRow}> */}
        <OrderGridCell gridArea={"a"} title="Overview" color="orange">
          <OrderFormOverview
            order={newOrder}
            handleChange={setNewOrder}
            partiesOptions={partiesOptions}
            statusesOptions={statusesOptions}
            formatDate={formatDate}
            poTypesOptions={poTypesOptions}
          />
        </OrderGridCell>

        {!newOrder.po_type_id || newOrder.po_type_id == 1 ? (
          <>
            <OrderGridCell gridArea={"d"} title="Materials" color="gold">
              <OrderFormMaterials
                fields={materialKeys}
                itemsOptions={itemsOptions}
                orderMaterials={orderMaterials}
                handleOrderMaterialsChange={setOrderMaterials}
                formatDate={formatDate}
              />
            </OrderGridCell>
            <OrderGridCell gridArea={"f"} title={"Hardware"} color={"blue"}>
              <OrderFormHardwareIns
                order={newOrder}
                handleChange={setNewOrder}
                statusesOptions={statusesOptions}
                formatDate={formatDate}
              />
            </OrderGridCell>
            <OrderGridCell gridArea={"g"} title={"Software"} color={"green"}>
              <OrderFormSoftwareIns
                order={newOrder}
                handleChange={setNewOrder}
                statusesOptions={statusesOptions}
                formatDate={formatDate}
              />
            </OrderGridCell>
          </>
        ) : (
          <OrderGridCell gridArea={"b"} title={"Services"} color={"#92EEFF"}>
            <OrderFormServies
              order={newOrder}
              handleOrderChange={setNewOrder}
              fields={servicesKeys}
              orderServices={orderServices}
              handleOrderServicesChange={setOrderServices}
              formatDate={formatDate}
            />
          </OrderGridCell>
        )}

        <OrderGridCell
          gridArea={"c"}
          title={"Payment Terms & Conditions"}
          color={"yellow"}
        >
          <OrderFormPaymentTCs
            fields={paymentTCKeys}
            orderPaymentTCs={orderPaymentTCs}
            handleOrderPaymentTCsChange={setOrderPaymentTCs}
            po_type_id={!newOrder.po_type_id ? 1 : newOrder.po_type_id}
          />
        </OrderGridCell>
        {/* </div> */}
      </div>
    </div>
  );
}
