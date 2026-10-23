import type { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import { fetchPoTypes } from "../services/poTypeServices.js";

const getPoTypes = async (req: Request, res: Response) => {
  try {
    const response = await fetchPoTypes();
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch po types");
    }
    return apiResponse(res, 200, "Successfully fetched po types", response);
  } catch (error) {
    return apiResponse(res, 500, "Error fetching po types");
  }
};

export { getPoTypes };
