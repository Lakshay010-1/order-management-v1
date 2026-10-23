import { pool } from "../config/db.js";
import type { MaterialDispatch } from "../types/Material.js";

const insertOrderMaterialDispatch: (
  material_id: number,
  details: MaterialDispatch,
) => Promise<MaterialDispatch> = async (material_id, details) => {
  const { quantity, dispatch_date, confirmation_date, delivered_by } = details;
  const response = await pool
    .request()
    .input("material_id", material_id)
    .input("quantity", quantity)
    .input("dispatch_date", dispatch_date)
    .input("confirmation_date", confirmation_date ?? null)
    .input("delivered_by", delivered_by)
    .query(
      "INSERT INTO order_material_dispatch (material_id, quantity, dispatch_date, confirmation_date, delivered_by) OUTPUT INSERTED.* VALUES (@material_id, @quantity, @dispatch_date, @confirmation_date, @delivered_by)",
    );
  const { recordset } = response;
  return recordset[0];
};

const fetchOrderMaterialsDispatch: (
  id: number,
) => Promise<Array<MaterialDispatch> | undefined> = async (id: number) => {
  try {
    const response = await pool
      .request()
      .input("material_id", id)
      .query(
        "SELECT md.id, md.quantity, md.dispatch_date, md.confirmation_date, d.medium as delivery_medium, md.created_at FROM order_material_dispatch as md JOIN delivery_mediums as d ON md.delivered_by=d.id WHERE material_id=@material_id",
      );
    const { recordset } = response;
    return recordset ?? undefined;
  } catch (error) {
    return undefined;
  }
};

const deleteOrderMaterialDispatch: (id: number) => Promise<boolean> = async (
  id,
) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM order_material_dispatch WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const putOrderMaterialDispatch: (
  id: number,
  details: MaterialDispatch,
) => Promise<boolean> = async (id, details) => {
  const { quantity, dispatch_date, confirmation_date, delivered_by } = details;
  const response = await pool
    .request()
    .input("id", id)
    .input("quantity", quantity)
    .input("dispatch_date", dispatch_date)
    .input("confirmation_date", confirmation_date)
    .input("delivered_by", delivered_by)
    .query(
      "UPDATE order_material_dispatch SET quantity=@quantity, dispatch_date=@dispatch_date, confirmation_date=@confirmation_date, delivered_by=@delivered_by  WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export {
  fetchOrderMaterialsDispatch,
  insertOrderMaterialDispatch,
  putOrderMaterialDispatch,
  deleteOrderMaterialDispatch,
};
