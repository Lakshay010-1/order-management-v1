import { z } from "zod";
import { type Request, type Response } from "express";
import {
  fetchItems,
  insertItem,
  removeItem,
  putItem,
} from "../services/itemServices.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";

const getItems = async (req: Request, res: Response) => {
  const item: string | undefined =
    typeof req.query.name === "string" ? req.query.name : undefined;
  try {
    const response = await fetchItems(item ? item : "");
    if (!response) {
      return apiResponse(res, 404, "Failed to fetch items");
    }
    return apiResponse(res, 200, "Items fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 404, "Error fetching items");
  }
};

const createItem = async (req: Request, res: Response) => {
  const { item } = req.body;
  const bodySchema = z.object({
    item: z.string().min(1),
  });
  const paramsValid = bodySchema.safeParse({ item });
  if (paramsValid.success) {
    try {
      const response = await insertItem(item);
      if (!response) {
        return apiResponse(res, 400, "Failed to insert item");
      }
      return apiResponse(res, 201, "Item inserted successfully", response);
    } catch (error) {
      return apiResponse(res, 500, "Error inserting item");
    }
  }
  return apiResponse(res, 404, "Missing requred fields");
};

const updateItem = async (req: Request, res: Response) => {
  const { item } = req.body;
  const bodySchema = z.object({
    item: z.string().min(1),
  });
  const paramsValid = bodySchema.safeParse({ item });
  const id = Number(req.params.id);
  if (!paramsValid.success) {
    return apiResponse(res, 404, "Missing requred fields");
  }
  try {
    const { isIdValid: isIdItemValid, response: validIdItemResponse } =
      validateId(id, "Item", res);
    if (!isIdItemValid) {
      return validIdItemResponse;
    }
    const { success: itemSuccess, response: itemRecordResponse } =
      await validateRecordExistance(id, "items", "Item", res);
    if (!itemSuccess) {
      return itemRecordResponse;
    }
    const response = await putItem(id, item);
    if (!response) {
      return apiResponse(res, 400, "Failed to update item");
    }
    return apiResponse(res, 201, "Item updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error updating item");
  }
};

const deleteItem = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { isIdValid: isIdItemValid, response: validIdItemResponse } =
      validateId(id, "Item", res);
    if (!isIdItemValid) {
      return validIdItemResponse;
    }
    const { success: itemSuccess, response: itemRecordResponse } =
      await validateRecordExistance(id, "items", "Item", res);
    if (!itemSuccess) {
      return itemRecordResponse;
    }
    const response = await removeItem(id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete item");
    }
    return apiResponse(res, 200, "Item deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting item");
  }
};

export { getItems, createItem, deleteItem, updateItem };
