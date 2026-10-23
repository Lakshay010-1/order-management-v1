import { pool } from "../config/db.js";
import type { DeliveryMedium } from "../types/DeliveryMedium.js";

const fetchDeliveryMediums: () => Promise<Array<DeliveryMedium>> = async () => {
  const response = await pool.request().query("SELECT * FROM delivery_mediums");
  const { recordset } = response;
  return recordset;
};

export { fetchDeliveryMediums };
