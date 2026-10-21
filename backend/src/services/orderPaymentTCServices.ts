import { pool } from "../config/db.js";
import type { PaymentTC } from "../types/PaymentTC.js";

const fetchOrderPaymentTCs: (
  id: number,
) => Promise<Array<PaymentTC> | undefined> = async (id: number) => {
  try {
    const response = await pool
      .request()
      .input("order_id", id)
      .query(
        "SELECT id, term, fulfilled, created_at FROM order_payment_terms WHERE order_id=@order_id",
      );
    const { recordset } = response;
    return recordset ?? undefined;
  } catch (error) {
    return undefined;
  }
};

const insertOrderPaymentTC: (
  order_id: number,
  term: string,
  fulfilled: 0 | 1,
) => Promise<PaymentTC> = async (order_id, term, fulfilled) => {
  const response = await pool
    .request()
    .input("term", term)
    .input("fulfilled", fulfilled)
    .input("order_id", order_id)
    .query(
      "INSERT INTO order_payment_terms (order_id, term, fulfilled) OUTPUT INSERTED.* VALUES (@order_id, @term, @fulfilled)",
    );
  const { recordset } = response;
  return recordset[0];
};

const deleteOrderPaymentTC: (id: number) => Promise<boolean> = async (id) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM order_payment_terms WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const putOrderPaymentTC: (
  id: number,
  term: string,
  fulfilled: 1 | 0,
) => Promise<boolean> = async (id, term, fulfilled) => {
  const response = await pool
    .request()
    .input("id", id)
    .input("term", term)
    .input("fulfilled", fulfilled)
    .query(
      "UPDATE order_payment_terms SET term=@term, fulfilled=@fulfilled WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export {
  insertOrderPaymentTC,
  fetchOrderPaymentTCs,
  putOrderPaymentTC,
  deleteOrderPaymentTC,
};
