import { apiResponse } from "./apiResponse.js";
import { validateNum } from "./validateNumber.js";
import { type Response } from "express";

export const validateId = (
  order_id: any,
  record_type: string,
  res: Response,
) => {
  if (!validateNum(order_id)) {
    return {
      isIdValid: false,
      response: apiResponse(res, 400, `Invalid ${record_type} id`),
    };
  }
  return {
    isIdValid: true,
    response: null,
  };
};
