import type { Request, Response } from "express";
import {
  fetchOrderItems,
  putOrderItem,
  deleteOrderItem,
  insertOrderItem,
} from "../services/orderItemService.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";
import { apiResponse } from "../utils/apiResponse.js";
import { z } from "zod";

const getOrderItems = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  try {
    const { isIdValid, response: validIdResponse } = validateId(
      order_id,
      "Order",
      res,
    );
    if (!isIdValid) {
      return validIdResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const response = await fetchOrderItems(order_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch order items");
    }
    return apiResponse(res, 200, "Order Items fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error fetching order items");
  }
};

const addOrderItem = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const bodySchema = z.object({
    item_id: z.number(),
    quantity: z.number(),
    date: z.coerce.date(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required paramters");
  }
  const { item_id, quantity, date } = paramsValid.data;
  try {
    const { isIdValid, response: validIdResponse } = validateId(
      order_id,
      "Order",
      res,
    );
    if (!isIdValid) {
      return validIdResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const response = await insertOrderItem(order_id, item_id, quantity, date);
    if (!response) {
      return apiResponse(res, 400, "Failed to add order item");
    }
    return apiResponse(res, 200, "Order Item added successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error: adding order item");
  }
};

const removeOrderItem = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const order_item_id = Number(req.params.item_id);
  try {
    const { isIdValid: isIdValOrderid, response: validOrderIdResponse } =
      validateId(order_id, "Order", res);
    if (!isIdValOrderid) {
      return validOrderIdResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      isIdValid: isIdValOrderItemid,
      response: valOrderItemidIdResponse,
    } = validateId(order_item_id, "Order Item", res);
    if (!isIdValOrderItemid) {
      return valOrderItemidIdResponse;
    }
    const { success: orderItemSuccess, response: orderItemRecordResponse } =
      await validateRecordExistance(
        order_item_id,
        "order_items",
        "OrderItem",
        res,
      );
    if (!orderItemSuccess) {
      return orderItemRecordResponse;
    }
    const response = await deleteOrderItem(order_item_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete order item");
    }
    return apiResponse(res, 200, "Order Item deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: deleting order item");
  }
};

const updateOrderItem = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const order_item_id = Number(req.params.item_id);
  const bodySchema = z.object({
    quantity: z.number(),
    date: z.coerce.date(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required paramters");
  }
  const { quantity, date } = paramsValid.data;
  try {
    const { isIdValid: isIdValOrderid, response: validOrderIdResponse } =
      validateId(order_id, "Order", res);
    if (!isIdValOrderid) {
      return validOrderIdResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      isIdValid: isIdValOrderItemid,
      response: valOrderItemidIdResponse,
    } = validateId(order_item_id, "Order Item", res);
    if (!isIdValOrderItemid) {
      return valOrderItemidIdResponse;
    }
    const { success: orderItemSuccess, response: orderItemRecordResponse } =
      await validateRecordExistance(
        order_item_id,
        "order_items",
        "OrderItem",
        res,
      );
    if (!orderItemSuccess) {
      return orderItemRecordResponse;
    }
    const response = await putOrderItem(order_item_id, quantity, date);
    if (!response) {
      return apiResponse(res, 400, "Failed to update order item");
    }
    return apiResponse(res, 200, "Order Item updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: updating order item");
  }
};

export { removeOrderItem, addOrderItem, updateOrderItem, getOrderItems };
