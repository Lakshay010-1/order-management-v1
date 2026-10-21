import type { Request, Response } from "express";
import { pool } from "../config/db.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";
import { z } from "zod";

const getStatuses = async (req: Request, res: Response) => {
  try {
    const response = await pool.request().query("SELECT * FROM statuses");
    const { recordset } = response;
    if (recordset.length > 0) {
      return apiResponse(res, 200, "Successfully fetched statuses", recordset);
    } else {
      return apiResponse(res, 400, "Failed to fetch statuses");
    }
  } catch (error) {
    return apiResponse(res, 500, "Error fetching statuses");
  }
};

const createStatus = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    status: z.string().min(1),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required parameters");
  }
  try {
    const response = await pool
      .request()
      .input("status", paramsValid.data.status)
      .query(
        "INSERT INTO statuses (status) OUTPUT INSERTED.* VALUES (@status)",
      );
    const { recordset } = response;
    if (!recordset[0]) {
      return apiResponse(res, 400, "Failed to create status");
    }
    return apiResponse(res, 200, "Status created successfully", recordset[0]);
  } catch (error) {
    console.log(error);
    return apiResponse(res, 500, "Error creating status");
  }
};

const updateStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const bodySchema = z.object({
    status: z.string().min(1),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required parameters");
  }
  try {
    const { isIdValid: isIdStatusValid, response: validIdStatusResponse } =
      validateId(id, "Status", res);
    if (!isIdStatusValid) {
      return validIdStatusResponse;
    }
    const { success: statusSuccess, response: statusRecordResponse } =
      await validateRecordExistance(id, "statuses", "Status", res);
    if (!statusSuccess) {
      return statusRecordResponse;
    }
    const response = await pool
      .request()
      .input("id", id)
      .input("status", paramsValid.data.status)
      .query("UPDATE statuses SET status=@status WHERE id=@id");
    const { rowsAffected } = response;
    if ((rowsAffected[0] ?? 0) <= 0) {
      return apiResponse(res, 400, "Failed to update status");
    }
    return apiResponse(res, 200, "Status updated successfully");
  } catch (error) {
    console.log(error);
    return apiResponse(res, 500, "Error updating status");
  }
};

const deleteStatus = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { isIdValid: isIdStatusValid, response: validIdStatusResponse } =
      validateId(id, "Status", res);
    if (!isIdStatusValid) {
      return validIdStatusResponse;
    }
    const { success: statusSuccess, response: statusRecordResponse } =
      await validateRecordExistance(id, "statuses", "Status", res);
    if (!statusSuccess) {
      return statusRecordResponse;
    }
    const response = await pool
      .request()
      .input("id", id)
      .query("DELETE FROM statuses WHERE id=@id");
    const { rowsAffected } = response;
    if ((rowsAffected[0] ?? 0) == 0) {
      return apiResponse(res, 400, "Failed to delete status");
    }
    return apiResponse(res, 200, "Status deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting status");
  }
};

export { getStatuses, createStatus, updateStatus, deleteStatus };
