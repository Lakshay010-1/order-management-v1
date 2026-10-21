import { pool } from "../config/db.js";
import type { Item } from "../types/Item.js";

export const fetchItems: (item?: string) => Promise<Array<Item>> = async (
  item: string = "",
) => {
  const response =
    item.length > 0
      ? await pool
          .request()
          .input("item", item)
          .query("SELECT * FROM items WHERE item LIKE CONCAT('%', @item, '%')")
      : await pool.request().query("SELECT * FROM items");
  const { recordset } = response;
  return recordset;
};

export const insertItem: (item: string) => Promise<Item> = async (
  item: string,
) => {
  const response = await pool
    .request()
    .input("item", item)
    .query("INSERT INTO items (item) OUTPUT INSERTED.* VALUES (@item)");
  const { recordset } = response;
  return recordset[0];
};

export const putItem: (id: number, item: string) => Promise<boolean> = async (
  id,
  item,
) => {
  const response = await pool
    .request()
    .input("item", item)
    .input("id", id)
    .query("UPDATE items SET item=@item WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};

export const removeItem: (id: number) => Promise<boolean> = async (
  id: number,
) => {
  const response = await pool
    .request()
    .input("id", id)
    .query("DELETE FROM items WHERE id=@id");
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};
