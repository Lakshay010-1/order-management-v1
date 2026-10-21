import type { Request, Response } from "express";
import { z } from "zod";
import {
  putOrderPaymentTC,
  insertOrderPaymentTC,
  deleteOrderPaymentTC,
  fetchOrderPaymentTCs,
} from "../services/orderPaymentTCServices.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";

const getOrderPaymentTCs = async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }

  try {
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(Number(order_id), "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }

    const response = await fetchOrderPaymentTCs(Number(order_id));
    if (!response) {
      return apiResponse(
        res,
        400,
        "Failed to fetch order payment terms and conditions",
      );
    }
    return apiResponse(
      res,
      200,
      "Order payment terms and conditions fetched successfully",
      response,
    );
  } catch (error) {
    return apiResponse(
      res,
      500,
      "Error fetching order payment terms and conditions",
    );
  }
};

const removeOrderPaymentTC = async (req: Request, res: Response) => {
  const { order_id, payment_tc_id } = req.params;
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const {
    isIdValid: isIdOrderPaymentTCValid,
    response: validIdOrderPaymentTCResponse,
  } = validateId(payment_tc_id, "Order_Payment_T&C", res);
  if (!isIdOrderPaymentTCValid) {
    return validIdOrderPaymentTCResponse;
  }
  try {
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(Number(order_id), "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }

    const { success: paymentTCSuccess, response: paymentTCRecordResponse } =
      await validateRecordExistance(
        Number(payment_tc_id),
        "order_payment_terms",
        "Order_Payment_T&C",
        res,
      );
    if (!paymentTCSuccess) {
      return paymentTCRecordResponse;
    }

    const response = await deleteOrderPaymentTC(Number(payment_tc_id));
    if (!response) {
      return apiResponse(res, 400, "Failed to delete order payment T&C");
    }
    return apiResponse(res, 200, "Order payment T&C deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting order payment T&C");
  }
};

const addOrderPaymentTC = async (req: Request, res: Response) => {
  const { order_id } = req.params;
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const bodySchema = z.object({
    term: z.string().min(1),
    fulfilled: z.boolean(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing Required Parameters");
  }
  const { term, fulfilled } = req.body;
  try {
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(Number(order_id), "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }

    const response = await insertOrderPaymentTC(
      Number(order_id),
      term,
      fulfilled ? 1 : 0,
    );
    if (!response) {
      return apiResponse(res, 400, "Failed to add Order payment T&C");
    }
    return apiResponse(
      res,
      201,
      "Order payment T&C added successfully",
      response,
    );
  } catch (error) {
    return apiResponse(res, 500, "Error: inserting order payment T&C");
  }
};

const updateOrderPaymentTC = async (req: Request, res: Response) => {
  const { order_id, payment_tc_id } = req.params;
  const bodySchema = z.object({
    term: z.string().min(1),
    fulfilled: z.boolean(),
  });
  const { isIdValid: isIdOrderValid, response: validIdOrderResponse } =
    validateId(order_id, "Order", res);
  if (!isIdOrderValid) {
    return validIdOrderResponse;
  }
  const {
    isIdValid: isIdOrderPaymentTCValid,
    response: validIdOrderPaymentTCResponse,
  } = validateId(payment_tc_id, "Order_Payment_T&C", res);
  if (!isIdOrderPaymentTCValid) {
    return validIdOrderPaymentTCResponse;
  }
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing Required Parameters");
  }
  const { term, fulfilled } = req.body;
  try {
    const { success: orderSuccess, response: orderRecordResponse } =
      await validateRecordExistance(Number(order_id), "orders", "Order", res);
    if (!orderSuccess) {
      return orderRecordResponse;
    }

    const { success: partySuccess, response: partyRecordResponse } =
      await validateRecordExistance(
        Number(payment_tc_id),
        "order_payment_terms",
        "Order_Payment_T&C",
        res,
      );
    if (!partySuccess) {
      return partyRecordResponse;
    }

    const response = await putOrderPaymentTC(
      Number(payment_tc_id),
      term,
      fulfilled ? 1 : 0,
    );
    if (!response) {
      return apiResponse(res, 400, "Failed to update Order payment T&C");
    }
    return apiResponse(res, 200, "Order payment T&C updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error: updating order payment T&C");
  }
};

export {
  getOrderPaymentTCs,
  removeOrderPaymentTC,
  addOrderPaymentTC,
  updateOrderPaymentTC,
};
