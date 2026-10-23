import type { Request, Response } from "express";
import { z } from "zod";
import { apiResponse } from "../utils/apiResponse.js";
import {
  deleteOrderService,
  fetchOrderServices,
  insertOrderService,
  putOrderService,
} from "../services/orderServicesServices.js";
import { validateId } from "../utils/validateId.js";

const getOrderServices = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  try {
    const response = await fetchOrderServices(order_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch services");
    }
    return apiResponse(res, 200, "Services fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error fetching services");
  }
};

const createOrderService = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const bodySchema = z.object({
    description: z.string().optional(),
    date: z.coerce.date(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 404, "Missing required parameters");
  }
  try {
    const response = await insertOrderService(order_id, {
      ...paramsValid.data,
      description: paramsValid.data.description ?? "",
    });
    if (!response) {
      return apiResponse(res, 400, "Failed to add service");
    }
    return apiResponse(res, 200, "Service added successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error adding service");
  }
};

const updateOrderService = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const service_id = Number(req.params.service_id);
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const {
    isIdValid: isIdOrderServiceValid,
    response: validIdOrderServiceResponse,
  } = validateId(service_id, "Order Service", res);
  if (!isIdOrderServiceValid) {
    return validIdOrderServiceResponse;
  }
  const bodySchema = z.object({
    description: z.string().optional(),
    date: z.coerce.date(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 404, "Missing required parameters");
  }
  try {
    const response = await putOrderService(service_id, {
      ...paramsValid.data,
      description: paramsValid.data.description ?? "",
    });
    if (!response) {
      return apiResponse(res, 400, "Failed to update service");
    }
    return apiResponse(res, 200, "Service updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error updating service");
  }
};

const removeOrderService = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const service_id = Number(req.params.service_id);
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const {
    isIdValid: isIdOrderServiceValid,
    response: validIdOrderServiceResponse,
  } = validateId(service_id, "Order Service", res);
  if (!isIdOrderServiceValid) {
    return validIdOrderServiceResponse;
  }
  try {
    const response = await deleteOrderService(service_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete service");
    }
    return apiResponse(res, 200, "Service deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting service");
  }
};

export {
  getOrderServices,
  createOrderService,
  updateOrderService,
  removeOrderService,
};
