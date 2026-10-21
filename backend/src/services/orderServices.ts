import { pool } from "../config/db.js";
import type { Order } from "../types/Order.js";
import { fetchOrderItems, insertOrderItem } from "./orderItemService.js";
import {
  fetchOrderMaterials,
  insertOrderMaterial,
} from "./orderMaterialService.js";
import {
  fetchOrderPaymentTCs,
  insertOrderPaymentTC,
} from "./orderPaymentTCServices.js";

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
    `SELECT o.id,
        o.party_id,
        o.status as status_id,
        o.software_installation_status as software_installation_status_id, 
        o.hardware_installation_status as hardware_installation_status_id, 
        o.po_date,
        o.hardware_installation_date, 
        h_s.status as hardware_installation_status, 
        o.software_installation_date, 
        s_s.status as software_installation_status, 
        s.status, 
        o.created_at, 
        p.party as party
        FROM orders as o 
        JOIN statuses as s_s 
        ON o.software_installation_status=s_s.id
        JOIN statuses as h_s 
        ON o.hardware_installation_status=h_s.id
        JOIN statuses as s 
        ON o.status=s.id
        JOIN parties as p
        ON o.party_id=p.id        
        `,
  );
  const { recordset } = ordersResponse;
  if (!recordset) {
    return undefined;
  }
  for (let i = 0; i < recordset.length; i++) {
    const element = recordset[i];
    const elementId = element["id"];
    element["items"] = await fetchOrderItems(elementId);
    element["materials"] = await fetchOrderMaterials(elementId);
    element["payment_tc"] = await fetchOrderPaymentTCs(elementId);
  }
  return recordset;
};

const fetchOrder: (id: number) => Promise<Order | undefined> = async (
  id: number,
) => {
  const response = await pool.request().input("id", id).query(`
    SELECT o.id,
        o.po_date,
        o.hardware_installation_date, 
        h_s.status as hardware_installation_status, 
        o.software_installation_date, 
        s_s.status as software_installation_status, 
        s.status, 
        o.created_at, 
        p.party as party
        FROM orders as o 
        JOIN statuses as s_s 
        ON o.software_installation_status=s_s.id
        JOIN statuses as h_s 
        ON o.hardware_installation_status=h_s.id
        JOIN statuses as s 
        ON o.status=s.id
        JOIN parties as p
        ON o.party_id=p.id
        WHERE o.id=@id
        `);
  const { recordset } = response;
  if (!recordset[0]) {
    return undefined;
  }
  const element = recordset[0];
  const elementId = element["id"];
  element["items"] = await fetchOrderItems(elementId);
  element["materials"] = await fetchOrderMaterials(elementId);
  element["payment_tc"] = await fetchOrderPaymentTCs(elementId);
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

const insertOrder: (details: {
  po_date: Date;
  hardware_installation_date: Date;
  software_installation_date: Date;
  software_installation_status_id: number;
  hardware_installation_status_id: number;
  status_id: number;
  party_id: number;
  materials: Array<{ item_id: number; quantity: number; date: Date }>;
  items: Array<{ item_id: number; quantity: number; date: Date }>;
  payment_tcs: Array<{ term: string; fulfilled: boolean }>;
}) => Promise<Order | undefined> = async (details) => {
  const {
    po_date,
    hardware_installation_date,
    hardware_installation_status_id,
    software_installation_date,
    software_installation_status_id,
    status_id,
    party_id,
    payment_tcs,
    items,
    materials,
  } = details;
  const orderResponse = await pool
    .request()
    .input("po_date", po_date)
    .input("hardware_installation_date", hardware_installation_date)
    .input("hardware_installation_status", hardware_installation_status_id)
    .input("software_installation_date", software_installation_date)
    .input("software_installation_status", software_installation_status_id)
    .input("status", status_id)
    .input("party_id", party_id)
    .query(
      `INSERT INTO orders (po_date, hardware_installation_date, hardware_installation_status, software_installation_date, software_installation_status, status, party_id) 
      OUTPUT INSERTED.id
      VALUES (@po_date, @hardware_installation_date, @hardware_installation_status, @software_installation_date, @software_installation_status, @status, @party_id)`,
    );
  const { recordset } = orderResponse;
  if (!recordset[0]) {
    return undefined;
  }
  const order_id = recordset[0].id;

  for (let i = 0; i < payment_tcs.length; i++) {
    const element = payment_tcs[i]!;
    const { term, fulfilled } = element;
    const response = await insertOrderPaymentTC(
      order_id,
      term,
      fulfilled ? 1 : 0,
    );
  }
  for (let i = 0; i < items.length; i++) {
    const element = items[i]!;
    const { item_id, quantity, date } = element;
    const response = await insertOrderItem(order_id, item_id, quantity, date);
  }
  for (let i = 0; i < materials.length; i++) {
    const element = materials[i]!;
    const { item_id, quantity, date } = element;
    const response = await insertOrderMaterial(
      order_id,
      item_id,
      quantity,
      date,
    );
  }

  const order = await fetchOrder(order_id);
  return order;
};

const putOrder: (
  order_id: number,
  details: {
    po_date: Date;
    hardware_installation_date: Date;
    software_installation_date: Date;
    software_installation_status_id: number;
    hardware_installation_status_id: number;
    status_id: number;
    party_id: number;
  },
) => Promise<boolean> = async (order_id, details) => {
  const {
    po_date,
    hardware_installation_date,
    hardware_installation_status_id,
    software_installation_date,
    software_installation_status_id,
    status_id,
    party_id,
  } = details;
  const response = await pool
    .request()
    .input("order_id", order_id)
    .input("po_date", po_date)
    .input("hardware_installation_date", hardware_installation_date)
    .input("hardware_installation_status", hardware_installation_status_id)
    .input("software_installation_date", software_installation_date)
    .input("software_installation_status", software_installation_status_id)
    .input("status", status_id)
    .input("party_id", party_id)
    .query(
      `UPDATE orders 
      SET
      po_date=@po_date, 
      hardware_installation_date=@hardware_installation_date, 
      hardware_installation_status=@hardware_installation_status, 
      software_installation_date=@software_installation_date, 
      software_installation_status=@software_installation_status, 
      status=@status, party_id=@party_id WHERE id=@order_id`,
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export { fetchOrders, fetchOrder, removeOrder, insertOrder, putOrder };
