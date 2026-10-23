import { pool } from "../config/db.js";
import type { PoType } from "../types/PoType.js";

const fetchPoTypes: () => Promise<Array<PoType>> = async () => {
  const response = await pool.request().query("SELECT * FROM po_types");
  const { recordset } = response;
  return recordset;
};

export { fetchPoTypes };
