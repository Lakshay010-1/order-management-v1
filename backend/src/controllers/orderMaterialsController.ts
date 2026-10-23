import type { Request, Response } from "express";
import {
  putOrderMaterial,
  insertOrderMaterial,
  deleteOrderMaterial,
  fetchOrderMaterials,
} from "../services/orderMaterialService.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";
import { apiResponse } from "../utils/apiResponse.js";
import { z } from "zod";

const getOrderMaterials = async (req: Request, res: Response) => {
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
    const response = await fetchOrderMaterials(order_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch order materials");
    }
    return apiResponse(
      res,
      200,
      "Order materials fetched successfully",
      response,
    );
  } catch (error) {
    return apiResponse(res, 500, "Error fetching order materials");
  }
};

const removeOrderMaterial = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const order_material_id = Number(req.params.material_id);
  try {
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      isIdValid: isIdOrderItemValid,
      response: validIdOrderItemResponse,
    } = validateId(order_material_id, "Order Material", res);
    if (!isIdOrderItemValid) {
      return validIdOrderItemResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      order_material_id,
      "order_material",
      "OrderMaterial",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }
    const response = await deleteOrderMaterial(order_material_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete order material");
    }
    return apiResponse(res, 200, "Order Material deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: deleting order material");
  }
};

const addOrderMaterial = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const bodySchema = z.object({
    item_id: z.number(),
    quantity: z.number(),
    order_date: z.coerce.date(),
    purchase_date: z.coerce.date().optional(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required paramters");
  }
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
    const response = await insertOrderMaterial(order_id, {
      ...req.body,
      purchase_date: req.body.purchase_date ?? undefined,
    });
    if (!response) {
      return apiResponse(res, 400, "Failed to add order material");
    }
    return apiResponse(res, 200, "Order Material added successfully", response);
  } catch (error) {
    return apiResponse(res, 500, "Error: adding order material");
  }
};

const updateOrderMaterial = async (req: Request, res: Response) => {
  const order_id = Number(req.params.order_id);
  const order_material_id = Number(req.params.material_id);
  const bodySchema = z.object({
    quantity: z.number(),
    order_date: z.coerce.date(),
    purchase_date: z.coerce.date(),
    deliver_date: z.coerce.date(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required paramters");
  }
  try {
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      isIdValid: isIdOrderMaterialValid,
      response: validIdrderMaterialResponse,
    } = validateId(order_material_id, "Order Material", res);
    if (!isIdOrderMaterialValid) {
      return validIdrderMaterialResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      order_material_id,
      "order_material",
      "OrderMaterial",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }
    const response = await putOrderMaterial(
      order_material_id,
      paramsValid.data,
    );
    if (!response) {
      return apiResponse(res, 400, "Failed to update order material");
    }
    return apiResponse(res, 200, "Order Material updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: updating order material");
  }
};

export {
  removeOrderMaterial,
  addOrderMaterial,
  updateOrderMaterial,
  getOrderMaterials,
};
