import { pool } from "../config/db.js";
import type { Material, NewMaterial } from "../types/Material.js";
import { fetchOrderMaterialsDispatch } from "./orderMaterialsDispatchesServices.js";

const insertOrderMaterial: (
  order_id: number,
  details: Partial<NewMaterial>,
) => Promise<Partial<Material>> = async (order_id, details) => {
  const { item_id, quantity, order_date, purchase_date } = details;
  const response = await pool
    .request()
    .input("item_id", item_id)
    .input("quantity", quantity)
    .input("order_date", order_date)
    .input("order_id", order_id)
    .input("purchase_date", purchase_date ?? null)
    .query(
      "INSERT INTO order_material (order_id, item_id, quantity, order_date, purchase_date ) OUTPUT INSERTED.* VALUES (@order_id, @item_id, @quantity, @order_date, @purchase_date)",
    );
  const { recordset } = response;
  const itemNameResponse = await pool
    .request()
    .input("item_id", recordset[0].item_id)
    .query("SELECT item FROM items WHERE id=@item_id");
  recordset[0]["item"] = itemNameResponse.recordset[0].item;
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
        "SELECT o.id, i.item, o.quantity, o.order_date, o.purchase_date, o.deliver_date , o.created_at FROM order_material as o JOIN items as i ON o.item_id=i.id WHERE o.order_id=@order_id",
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

const deleteOrderMaterial: (
  order_material_id: number,
) => Promise<boolean> = async (id) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM order_material WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

const putOrderMaterial: (
  id: number,
  details: Partial<NewMaterial>,
) => Promise<boolean> = async (id, details) => {
  const { quantity, order_date, purchase_date, deliver_date } = details;
  const response = await pool
    .request()
    .input("id", id)
    .input("quantity", quantity)
    .input("order_date", order_date)
    .input("purchase_date", purchase_date ?? null)
    .input("deliver_date", deliver_date ?? null)
    .query(
      "UPDATE order_material SET quantity=@quantity, order_date=@order_date, purchase_date=@purchase_date, deliver_date=@deliver_date WHERE id=@id",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export {
  fetchOrderMaterials,
  insertOrderMaterial,
  putOrderMaterial,
  deleteOrderMaterial,
};
