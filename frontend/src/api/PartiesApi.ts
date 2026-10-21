import type { Party } from "../types/Party";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const Parties_API_LINK = API_LINK + "/parties";

const getParties: () => Promise<Array<Party>> = async () => {
  return getMethodCall<Array<Party>>(Parties_API_LINK);
};

const addParty: (partyData: Partial<Party>) => Promise<Party> = async (partyData) => {
  return postMethodCall<Party>(Parties_API_LINK, partyData);
};

const deleteParty: (id: number) => Promise<boolean> = async (id) => {
  return deleteMethodCall(Parties_API_LINK + `/${id}`);
};

const patchParty: (id: number, details: Party) => Promise<boolean> = async (
  id,
  details,
) => {
  return putMethodCall(Parties_API_LINK + `/${id}`, details);
};

export { getParties, addParty, deleteParty, patchParty };
