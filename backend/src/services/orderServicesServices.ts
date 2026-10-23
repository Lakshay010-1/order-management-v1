import { pool } from "../config/db.js";
import type { NewOrderService, OrderService } from "../types/Service.js";

const insertOrderService: (
  order_id: number,
  details: NewOrderService,
) => Promise<OrderService> = async (order_id, details) => {
  const response = await pool
    .request()
    .input("date", details.date)
    .input("description", details.description)
    .input("order_id", order_id)
    .query(
      "INSERT INTO order_services (order_id, description, date) OUTPUT INSERTED.* VALUES (@order_id, @description, @date)",
    );
  const { recordset } = response;
  return recordset[0] ?? undefined;
};

const putOrderService: (
  service_id: number,
  details: NewOrderService,
) => Promise<boolean> = async (service_id, details) => {
  const response = await pool
    .request()
    .input("service_id", service_id)
    .input("description", details.description)
    .input("date", details.date)
    .query(
      "UPDATE order_services SET description=@description, date=@date WHERE id=@service_id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const deleteOrderService: (service_id: number) => Promise<boolean> = async (
  service_id,
) => {
  const response = await pool
    .request()
    .input("service_id", service_id)
    .query("DELETE FROM order_services WHERE id=@service_id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const fetchOrderServices: (
  order_id: number,
) => Promise<Array<OrderService>> = async (order_id) => {
  const response = await pool
    .request()
    .input("order_id", order_id)
    .query("SELECT * FROM order_services WHERE order_id=@order_id");
  const { recordset } = response;
  return recordset;
};

export {
  insertOrderService,
  putOrderService,
  deleteOrderService,
  fetchOrderServices,
};
