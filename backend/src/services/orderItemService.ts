import { pool } from "../config/db.js";
import type { OrderItem } from "../types/OrderItem.js";

const fetchOrderItems: (
  id: number,
) => Promise<Array<OrderItem> | undefined> = async (id: number) => {
  try {
    const response = await pool
      .request()
      .input("order_id", id)
      .query(
        "SELECT o.id, i.item, o.quantity, o.date, o.created_at FROM order_items as o JOIN items as i ON o.item_id=i.id WHERE o.order_id=@order_id",
      );
    const { recordset } = response;
    return recordset ?? undefined;
  } catch (error) {
    return undefined;
  }
};

const insertOrderItem: (
  order_id: number,
  item_id: number,
  quantity: number,
  date: Date,
) => Promise<OrderItem> = async (order_id, item_id, quantity, date) => {
  const response = await pool
    .request()
    .input("item_id", item_id)
    .input("quantity", quantity)
    .input("date", date)
    .input("order_id", order_id)
    .query(
      "INSERT INTO order_items (order_id, item_id, quantity, date) OUTPUT INSERTED.* VALUES (@order_id, @item_id, @quantity, @date)",
    );
  const { recordset } = response;
  const itemNameResponse = await pool
    .request()
    .input("item_id", recordset[0].item_id)
    .query("SELECT item FROM items WHERE id=@item_id");
  recordset[0]["item"] = itemNameResponse.recordset[0].item;
  return recordset[0];
};

const deleteOrderItem: (id: number) => Promise<boolean> = async (id) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM order_items WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const putOrderItem: (
  id: number,
  quantity: number,
  date: Date,
) => Promise<boolean> = async (id, quantity, date) => {
  const response = await pool
    .request()
    .input("id", id)
    .input("quantity", quantity)
    .input("date", date)
    .query(
      "UPDATE order_items SET quantity=@quantity, date=@date WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export { insertOrderItem, fetchOrderItems, putOrderItem, deleteOrderItem };
