import { pool } from "../config/db.js";
import { apiResponse } from "./apiResponse.js";
import type { Response } from "express";

interface ValidationResponse {
  success: boolean;
  response: Response | null;
}

interface RecordId {
  id: number;
}

const responseStrcuture = (
  success: boolean,
  response: Response | null,
): ValidationResponse => {
  return {
    success,
    response,
  };
};

export const validateRecordExistance = async (
  id: number,
  table_name: string,
  record_type: string,
  res: Response,
): Promise<ValidationResponse> => {
  const allowed_tables: string[] = [
    "orders",
    "order_material",
    "order_material_dispatch",
    "order_items",
    "order_payment_terms",
    "parties",
    "items",
    "statuses",
  ];
  if (!allowed_tables.includes(table_name)) {
    return responseStrcuture(
      false,
      apiResponse(res, 400, "Invalid Data table"),
    );
  }
  try {
    const response = await pool
      .request()
      .input("id", id)
      .query(`SELECT id FROM ${table_name} WHERE id=@id`);
    const { recordset }: { recordset: RecordId[] } = response;
    const exists: boolean = recordset.length > 0;

    if (!exists) {
      return responseStrcuture(
        false,
        apiResponse(res, 404, `${record_type} not found`),
      );
    }
    return responseStrcuture(true, null);
  } catch (error: unknown) {
    return responseStrcuture(
      false,
      apiResponse(res, 500, "Invalid/Expired id"),
    );
  }
};
