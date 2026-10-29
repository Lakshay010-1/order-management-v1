import { response, type Request, type Response } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import {
  fetchOrder,
  fetchOrders,
  insertOrder,
  putOrder,
  removeOrder,
} from "../services/orderServices.js";
import { validateNum } from "../utils/validateNumber.js";
import { z } from "zod";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";

const getOrders = async (req: Request, res: Response) => {
  try {
    const response = await fetchOrders();
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch orders");
    }
    return apiResponse(res, 200, "Orders fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error fetching orders");
  }
};

const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!validateNum(id)) {
    return apiResponse(res, 404, "Invalid id");
  }
  try {
    const response = await fetchOrder(Number(id));
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch order");
    }
    return apiResponse(res, 200, "Order fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error fetching order");
  }
};

const addOrder = async (req: Request, res: Response) => {
  const bodySchema1 = z.object({
    po_date: z.coerce.date(),
    po_number: z.number(),
    po_type_id: z.number(),
    status_id: z.number(),
    party_id: z.number(),
    payment_tcs: z.array(
      z.object({
        term: z.string(),
        fulfilled: z.boolean(),
      }),
    ),
  });
  const validParmas_overview = bodySchema1.safeParse(req.body);
  if (!validParmas_overview.success) {
    return apiResponse(res, 400, "Invalid request parameters");
  }
  const bodySchema_service = z.object({
    total_services: z.number(),
    services: z.array(
      z.object({ description: z.string(), date: z.coerce.date() }),
    ),
  });
  const bodySchema_installation = z.object({
    hardware_installation_date: z.coerce.date().optional(),
    hardware_installation_expected_date: z.coerce.date(),
    hardware_installation_status_id: z.number(),
    software_installation_date: z.coerce.date().optional(),
    software_installation_expected_date: z.coerce.date(),
    software_installation_status_id: z.number(),
    materials: z.array(
      z.object({
        item_id: z.number(),
        quantity: z.number(),
        order_date: z.coerce.date(),
      }),
    ),
  });
  const po_type_id = Number(req.body.po_type_id);
  const paramsValid_installation = bodySchema_installation.safeParse(req.body);
  const paramsValid_service = bodySchema_service.safeParse(req.body);
  if (po_type_id == 1) {
    if (!paramsValid_installation.success) {
      return apiResponse(res, 400, "Invalid request parameters");
    }
  } else if (po_type_id == 2) {
    if (!paramsValid_service.success) {
      return apiResponse(res, 400, "Invalid request parameters");
    }
  } else {
    return apiResponse(res, 400, "Invalid PO Type");
  }
  try {
    const response = await insertOrder(req.body);
    if (!response) {
      return apiResponse(res, 400, "Failed to add order");
    }
    return apiResponse(res, 201, "Order added successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error adding order");
  }
};

const updateOrder = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    po_date: z.coerce.date(),
    hardware_installation_date: z.coerce.date(),
    hardware_installation_status_id: z.number(),
    software_installation_date: z.coerce.date(),
    software_installation_status_id: z.number(),
    status_id: z.number(),
    party_id: z.number(),
    po_number: z.number(),
    po_type_id: z.number(),
    total_services: z.number().optional(),
    hardware_installation_expected_date: z.coerce.date(),
    software_installation_expected_date: z.coerce.date(),
  });
  const { id } = req.params;
  if (!validateNum(id)) {
    return apiResponse(res, 404, "Invalid id");
  }
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required paramters");
  }
  try {
    const response = await putOrder(Number(id), paramsValid.data);
    if (!response) {
      return apiResponse(res, 400, "Failed to update order");
    }
    return apiResponse(res, 200, "Order updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error updating order");
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { isIdValid: isIdValOrderid, response: validOrderIdResponse } =
      validateId(id, "Order", res);
    if (!isIdValOrderid) {
      return validOrderIdResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const response = await removeOrder(Number(id));
    if (!response) {
      return apiResponse(res, 400, "Failed to delete order");
    }
    return apiResponse(res, 200, "Order deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting order");
  }
};

export { getOrders, getOrder, addOrder, updateOrder, deleteOrder };
