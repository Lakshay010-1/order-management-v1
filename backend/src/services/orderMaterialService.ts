import { pool } from "../config/db.js";
import type { Material, MaterialDispatch } from "../types/Material.js";

const insertOrderMaterial: (
  order_id: number,
  item_id: number,
  quantity: number,
  date: Date,
) => Promise<Material> = async (order_id, item_id, quantity, date) => {
  const response = await pool
    .request()
    .input("item_id", item_id)
    .input("quantity", quantity)
    .input("date", date)
    .input("order_id", order_id)
    .query(
      "INSERT INTO order_material (order_id, item_id, quantity, date) OUTPUT INSERTED.* VALUES (@order_id, @item_id, @quantity, @date)",
    );
  const { recordset } = response;
  const itemNameResponse = await pool
    .request()
    .input("item_id", recordset[0].item_id)
    .query("SELECT item FROM items WHERE id=@item_id");
  recordset[0]["item"] = itemNameResponse.recordset[0].item;
  return recordset[0];
};

const insertOrderMaterialDispatch: (
  material_id: number,
  quantity: number,
  date: Date,
) => Promise<MaterialDispatch> = async (material_id, quantity, date) => {
  const response = await pool
    .request()
    .input("material_id", material_id)
    .input("quantity", quantity)
    .input("date", date)
    .query(
      "INSERT INTO order_material_dispatch (material_id, quantity, date) OUTPUT INSERTED.* VALUES (@material_id, @quantity, @date)",
    );
  const { recordset } = response;
  return recordset[0];
};

const fetchOrderMaterials: (
  id: number,
) => Promise<Array<Material> | undefined> = async (id: number) => {
  try {
    const response = await pool
      .request()
      .input("order_id", id)
      .query(
        "SELECT o.id, i.item, o.quantity, o.date, o.created_at FROM order_material as o JOIN items as i ON o.item_id=i.id WHERE o.order_id=@order_id",
      );
    const { recordset } = response;
    if (!recordset) {
      return undefined;
    }
    for (let i = 0; i < recordset.length; i++) {
      const element = recordset[i];
      element["dispatch"] = await fetchOrderMaterialsDispatch(element["id"]);
    }
    return recordset;
  } catch (error) {
    return undefined;
  }
};

const fetchOrderMaterialsDispatch: (
  id: number,
) => Promise<Array<MaterialDispatch> | undefined> = async (id: number) => {
  try {
    const response = await pool
      .request()
      .input("material_id", id)
      .query(
        "SELECT id, quantity, date, created_at FROM order_material_dispatch WHERE material_id=@material_id",
      );
    const { recordset } = response;
    return recordset ?? undefined;
  } catch (error) {
    return undefined;
  }
};

const deleteOrderMaterial: (id: number) => Promise<boolean> = async (id) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM order_material WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
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

const putOrderMaterial: (
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
      "UPDATE order_material SET quantity=@quantity, date=@date WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const putOrderMaterialDispatch: (
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
      "UPDATE order_material_dispatch SET quantity=@quantity, date=@date WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export {
  fetchOrderMaterials,
  fetchOrderMaterialsDispatch,
  insertOrderMaterial,
  insertOrderMaterialDispatch,
  putOrderMaterial,
  putOrderMaterialDispatch,
  deleteOrderMaterial,
  deleteOrderMaterialDispatch,
};
