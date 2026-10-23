import type { Request, Response } from "express";
import { fetchDeliveryMediums } from "../services/deliveryMediumsService.js";
import { apiResponse } from "../utils/apiResponse.js";

const getDeliveryMediums = async (req: Request, res: Response) => {
  try {
    const response = await fetchDeliveryMediums();
    if (!response) {
      return apiResponse(res, 400, "Failed to fetch delivery mediums");
    }
    return apiResponse(
      res,
      200,
      "Successfully fetched delivery mediums",
      response,
    );
  } catch (error) {
    return apiResponse(res, 500, "Error fetching delivery mediums");
  }
};

export { getDeliveryMediums };
