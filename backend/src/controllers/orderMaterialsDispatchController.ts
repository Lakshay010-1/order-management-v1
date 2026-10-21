import type { Request, Response } from "express";
import {
  putOrderMaterialDispatch,
  insertOrderMaterialDispatch,
  deleteOrderMaterialDispatch,
  fetchOrderMaterialsDispatch,
} from "../services/orderMaterialService.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";
import { z } from "zod";

const getOrderMaterialDispatches = async (req: Request, res: Response) => {
  const material_id = Number(req.params.material_id);
  const order_id = Number(req.params.order_id);
  try {
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }
    const {
      isIdValid: isIdOrderMaterialValid,
      response: validIdOrderMaterialResponse,
    } = validateId(material_id, "Material", res);
    if (!isIdOrderMaterialValid) {
      return validIdOrderMaterialResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      material_id,
      "order_material",
      "Material",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }

    const response = await fetchOrderMaterialsDispatch(material_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch order material dispatch");
    }
    return apiResponse(
      res,
      200,
      "Order material dispatch fetched successfully",
      response,
    );
  } catch (error) {
    return apiResponse(res, 500, "Error:fetching Order material dispatch");
  }
};
const removeOrderMaterialDispatch = async (req: Request, res: Response) => {
  const material_id = Number(req.params.material_id);
  const material_dispatch_id = Number(req.params.material_dispatch_id);
  const order_id = Number(req.params.order_id);
  try {
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }
    const {
      isIdValid: isIdOrderMaterialValid,
      response: validIdOrderMaterialResponse,
    } = validateId(material_id, "Material", res);
    if (!isIdOrderMaterialValid) {
      return validIdOrderMaterialResponse;
    }
    const {
      isIdValid: isIdOrderMaterialDispatchValid,
      response: validIdOrderMaterialDispatchResponse,
    } = validateId(material_dispatch_id, "MaterialDispatch", res);
    if (!isIdOrderMaterialDispatchValid) {
      return validIdOrderMaterialDispatchResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      material_id,
      "order_material",
      "Material",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }
    const {
      success: orderMaterialDispatchSuccess,
      response: orderMaterialDispatchRecordResponse,
    } = await validateRecordExistance(
      material_dispatch_id,
      "order_material_dispatch",
      "Order Material Dispatch",
      res,
    );
    if (!orderMaterialDispatchSuccess) {
      return orderMaterialDispatchRecordResponse;
    }
    const response = await deleteOrderMaterialDispatch(material_dispatch_id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete order material dispatch");
    }
    return apiResponse(
      res,
      200,
      "Order material dispatch deleted successfully",
    );
  } catch (error) {
    return apiResponse(res, 500, "Error: deleting Order material dispatch");
  }
};

const addOrderMaterialDispatch = async (req: Request, res: Response) => {
  const material_id = Number(req.params.material_id);
  const order_id = Number(req.params.order_id);
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
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }
    const {
      isIdValid: isIdOrderMaterialValid,
      response: validIdOrderMaterialResponse,
    } = validateId(material_id, "Material", res);
    if (!isIdOrderMaterialValid) {
      return validIdOrderMaterialResponse;
    }
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      material_id,
      "order_material",
      "Material",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }

    const response = await insertOrderMaterialDispatch(
      material_id,
      quantity,
      date,
    );
    if (!response) {
      return apiResponse(res, 400, "Failed to insert order material dispatch");
    }
    return apiResponse(
      res,
      200,
      "Order material dispatch inserted successfully",
      response,
    );
  } catch (error) {
    return apiResponse(res, 500, "Error: inserting Order material dispatch");
  }
};

const updateOrderMaterialDispatch = async (req: Request, res: Response) => {
  const material_id = Number(req.params.material_id);
  const material_dispatch_id = Number(req.params.material_dispatch_id);
  const order_id = Number(req.params.order_id);
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
    const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
      validateId(order_id, "Order", res);
    if (!isIdOrderValid) {
      return validIdOrderResponse;
    }

    const {
      isIdValid: isIdOrderMaterialValid,
      response: validIdOrderMaterialResponse,
    } = validateId(material_id, "Material", res);
    if (!isIdOrderMaterialValid) {
      return validIdOrderMaterialResponse;
    }

    const {
      isIdValid: isIdOrderMaterialDispatchValid,
      response: validIdOrderMaterialDispatchResponse,
    } = validateId(material_dispatch_id, "MaterialDispatch", res);
    if (!isIdOrderMaterialDispatchValid) {
      return validIdOrderMaterialDispatchResponse;
    }

    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(order_id, "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }
    const {
      success: orderMaterialSuccess,
      response: orderMaterialRecordResponse,
    } = await validateRecordExistance(
      material_id,
      "order_material",
      "Material",
      res,
    );
    if (!orderMaterialSuccess) {
      return orderMaterialRecordResponse;
    }
    const {
      success: orderMaterialDispatchSuccess,
      response: orderMaterialDispatchRecordResponse,
    } = await validateRecordExistance(
      material_dispatch_id,
      "order_material_dispatch",
      "Order Material Dispatch",
      res,
    );
    if (!orderMaterialDispatchSuccess) {
      return orderMaterialDispatchRecordResponse;
    }
    const response = await putOrderMaterialDispatch(
      material_dispatch_id,
      quantity,
      date,
    );
    if (!response) {
      return apiResponse(res, 400, "Failed to update order material dispatch");
    }
    return apiResponse(res, 200, "Order material dispatch update successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: updating Order material dispatch");
  }
};

export {
  getOrderMaterialDispatches,
  removeOrderMaterialDispatch,
  addOrderMaterialDispatch,
  updateOrderMaterialDispatch,
};
