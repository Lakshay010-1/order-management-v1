import { z } from "zod";
import type { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse.js";
import {
  fetchParties,
  insertParty,
  removeParty,
  patchParty,
} from "../services/partyServices.js";
import { validateId } from "../utils/validateId.js";
import { validateRecordExistance } from "../utils/validateExistance.js";

const partyFields = [
  "id",
  "party",
  "contact_person",
  "contact_num",
  "contact_email",
];

const getParties = async (req: Request, res: Response) => {
  const party: string | undefined =
    typeof req.query.name === "string" ? req.query.name : undefined;
  try {
    const response = await fetchParties(party ? party : "");
    if (!response) {
      return apiResponse(res, 404, "Failed to fetch parties");
    }
    return apiResponse(res, 200, "Parties fetched successfully", response);
  } catch (error) {
    return apiResponse(res, 404, "Error fetching parties");
  }
};

const createParty = async (req: Request, res: Response) => {
  const bodySchema = z.object({
    party: z.string(),
    contact_person: z.string().optional(),
    contact_num: z.string().optional(),
    contact_email: z.string().optional(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  const validBody: Record<string, string> = {};
  if (paramsValid.success) {
    try {
      for (const field of partyFields) {
        validBody[field] =
          paramsValid.data[field as keyof typeof paramsValid.data] ?? "";
      }
      const response = await insertParty(validBody);
      if (!response) {
        return apiResponse(res, 400, "Failed to insert party");
      }
      return apiResponse(res, 201, "Party inserted successfully", response);
    } catch (error) {
      return apiResponse(res, 500, "Error inserting party");
    }
  }
  return apiResponse(res, 404, "Missing requred fields");
};

const deleteParty = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const { isIdValid: isIdPartyValid, response: validIdPartyResponse } =
      validateId(id, "Party", res);
    if (!isIdPartyValid) {
      return validIdPartyResponse;
    }
    const { success: partySuccess, response: partyRecordResponse } =
      await validateRecordExistance(id, "parties", "Party", res);
    if (!partySuccess) {
      return partyRecordResponse;
    }
    const response = await removeParty(id);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete party");
    }
    return apiResponse(res, 200, "Party deleted successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error deleting party");
  }
};

const updateParty = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const bodySchema = z.object({
    party: z.string().optional(),
    contact_person: z.string().optional(),
    contact_num: z.string().optional(),
    contact_email: z.string().optional(),
  });
  const paramsValid = bodySchema.safeParse(req.body);
  if (!paramsValid.success) {
    return apiResponse(res, 400, "Missing required parameters");
  }
  try {
    const { isIdValid: isIdPartyValid, response: validIdPartyResponse } =
      validateId(id, "Party", res);
    if (!isIdPartyValid) {
      return validIdPartyResponse;
    }
    const { success: partySuccess, response: partyRecordResponse } =
      await validateRecordExistance(id, "parties", "Party", res);
    if (!partySuccess) {
      return partyRecordResponse;
    }
    const response = await patchParty(id, req.body);
    if (!response) {
      return apiResponse(res, 400, "Failed to delete party");
    }
    return apiResponse(res, 200, "Party updated successfully");
  } catch (error) {
    return apiResponse(res, 500, "Error updating party");
  }
};

export { getParties, createParty, deleteParty, updateParty };
