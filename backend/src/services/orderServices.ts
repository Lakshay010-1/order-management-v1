import { pool } from "../config/db.js";
import type { NewOrder, Order } from "../types/Order.js";
import {
  fetchOrderMaterials,
  insertOrderMaterial,
} from "./orderMaterialService.js";
import {
  fetchOrderPaymentTCs,
  insertOrderPaymentTC,
} from "./orderPaymentTCServices.js";
import { fetchOrderServices } from "./orderServicesServices.js";

const orderExists: (order_id: number) => Promise<boolean> = async (
  order_id,
) => {
  const response = await pool
    .request()
    .input("order_id", order_id)
    .query("SELECT id FROM orders WHERE id=@order_id");
  const { recordset } = response;
  return recordset.length > 0;
};

const fetchOrders: () => Promise<Array<Order> | undefined> = async () => {
  const ordersResponse = await pool.request().query(
    ` SELECT o.id,
        o.po_date,
        o.po_number,
        pt.type as po_type,
        o.po_type_id,
        o.party_id,
        p.party as party,
        o.total_services,
        o.status as status_id,
        s.status, 
        o.software_installation_status as software_installation_status_id, 
        o.hardware_installation_status as hardware_installation_status_id, 
        h_s.status as hardware_installation_status, 
        s_s.status as software_installation_status, 
        o.hardware_installation_date, 
        o.software_installation_date, 
        o.hardware_installation_expected_date, 
        o.software_installation_expected_date, 
        o.created_at 
        FROM orders as o 
        JOIN statuses as s_s 
        ON o.software_installation_status=s_s.id
        JOIN statuses as h_s 
        ON o.hardware_installation_status=h_s.id
        JOIN statuses as s 
        ON o.status=s.id
        JOIN parties as p
        ON o.party_id=p.id     
        JOIN po_types as pt
        ON o.po_type_id=pt.id  
        `,
  );
  const { recordset } = ordersResponse;
  if (!recordset) {
    return undefined;
  }
  for (let i = 0; i < recordset.length; i++) {
    const element = recordset[i];
    const elementId = element["id"];
    element["materials"] = await fetchOrderMaterials(elementId);
    element["payment_tcs"] = await fetchOrderPaymentTCs(elementId);
    element["services"] = await fetchOrderServices(elementId);
  }
  return recordset;
};

const fetchOrder: (id: number) => Promise<Order | undefined> = async (
  id: number,
) => {
  const response = await pool.request().input("order_id", id).query(`
    SELECT o.id,
        o.po_date,
        o.po_number,
        o.po_type_id,
        pt.type as po_type,
        o.party_id,
        p.party as party,
        o.total_services,
        o.status as status_id,
        s.status, 
        o.software_installation_status as software_installation_status_id, 
        o.hardware_installation_status as hardware_installation_status_id, 
        h_s.status as hardware_installation_status, 
        s_s.status as software_installation_status, 
        o.hardware_installation_date, 
        o.software_installation_date, 
        o.hardware_installation_expected_date, 
        o.software_installation_expected_date, 
        o.created_at 
        FROM orders as o 
        JOIN statuses as s_s 
        ON o.software_installation_status=s_s.id
        JOIN statuses as h_s 
        ON o.hardware_installation_status=h_s.id
        JOIN statuses as s 
        ON o.status=s.id
        JOIN parties as p
        ON o.party_id=p.id     
        JOIN po_types as pt
        ON o.po_type_id=pt.id   
        WHERE o.id=@order_id;
        `);
  const { recordset } = response;
  if (!recordset[0]) {
    return undefined;
  }
  const element = recordset[0];
  const elementId = element["id"];
  element["materials"] = await fetchOrderMaterials(elementId);
  element["payment_tcs"] = await fetchOrderPaymentTCs(elementId);
  element["services"] = await fetchOrderServices(elementId);
  return element;
};

const removeOrder: (id: number) => Promise<boolean> = async (id: number) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM orders WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const insertOrder: (details: NewOrder) => Promise<Order | undefined> = async (
  details,
) => {
  const {
    po_date,
    po_number,
    po_type_id,
    total_services,
    hardware_installation_expected_date,
    software_installation_expected_date,
    hardware_installation_date,
    hardware_installation_status_id,
    software_installation_date,
    software_installation_status_id,
    status_id,
    party_id,
    payment_tcs,
    materials,
  } = details;
  const orderResponse = await pool
    .request()
    .input("po_date", po_date)
    .input("po_number", po_number)
    .input("po_type_id", po_type_id)
    .input("total_services", total_services)
    .input(
      "hardware_installation_expected_date",
      hardware_installation_expected_date,
    )
    .input(
      "software_installation_expected_date",
      software_installation_expected_date,
    )
    .input("hardware_installation_date", hardware_installation_date)
    .input("hardware_installation_status", hardware_installation_status_id)
    .input("software_installation_date", software_installation_date)
    .input("software_installation_status", software_installation_status_id)
    .input("status", status_id)
    .input("party_id", party_id)
    .query(
      `INSERT INTO orders 
      (
      po_date, hardware_installation_date, hardware_installation_status, 
      software_installation_date, software_installation_status, status, party_id,
      po_number, po_type_id, total_services, 
      hardware_installation_expected_date, software_installation_expected_date
      ) 
      OUTPUT INSERTED.id
      VALUES (
      @po_date, @hardware_installation_date, @hardware_installation_status, 
      @software_installation_date, @software_installation_status, @status, @party_id,
      @po_number, @po_type_id, @total_services,
      @hardware_installation_expected_date, @software_installation_expected_date
      )`,
    );
  const { recordset } = orderResponse;
  if (!recordset[0]) {
    return undefined;
  }
  const order_id = recordset[0].id;

  for (let i = 0; i < payment_tcs.length; i++) {
    const element = payment_tcs[i]!;
    const { term, fulfilled } = element;
    await insertOrderPaymentTC(order_id, term, fulfilled ? 1 : 0);
  }
  for (let i = 0; i < materials.length; i++) {
    const element = materials[i]!;
    await insertOrderMaterial(order_id, element);
  }

  const order = await fetchOrder(order_id);
  return order;
};

const putOrder: (
  order_id: number,
  details: Partial<NewOrder>,
) => Promise<boolean> = async (order_id, details) => {
  const {
    po_date,
    po_number,
    po_type_id,
    total_services,
    hardware_installation_expected_date,
    hardware_installation_date,
    hardware_installation_status_id,
    software_installation_expected_date,
    software_installation_date,
    software_installation_status_id,
    status_id,
    party_id,
  } = details;
  const response = await pool
    .request()
    .input("order_id", order_id)
    .input("po_number", po_number)
    .input("po_type_id", po_type_id)
    .input("total_services", total_services)
    .input(
      "hardware_installation_expected_date",
      hardware_installation_expected_date,
    )
    .input(
      "software_installation_expected_date",
      software_installation_expected_date,
    )
    .input("po_date", po_date)
    .input("hardware_installation_date", hardware_installation_date)
    .input("hardware_installation_status", hardware_installation_status_id)
    .input("software_installation_date", software_installation_date)
    .input("software_installation_status", software_installation_status_id)
    .input("status", status_id)
    .input("party_id", party_id)
    .query(
      `UPDATE orders SET
      po_date=@po_date, 
      hardware_installation_date=@hardware_installation_date, 
      hardware_installation_status=@hardware_installation_status, 
      software_installation_date=@software_installation_date, 
      software_installation_status=@software_installation_status, 
      status=@status, party_id=@party_id,
      po_number=@po_number, po_type_id=@po_type_id,
      total_services=@total_services,
      hardware_installation_expected_date=@hardware_installation_expected_date,
      software_installation_expected_date=@software_installation_expected_date
      WHERE id=@order_id
      `,
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export { fetchOrders, fetchOrder, removeOrder, insertOrder, putOrder };
