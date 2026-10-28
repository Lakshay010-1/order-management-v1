import type { PoType } from "../types/PoType";
import { getMethodCall } from "./method_calls/GetCall";
import { API_LINK } from "./URLs";

const PO_TYPES_API_LINK = () => {
  return `${API_LINK}/po_types`;
};

const getPoTypes: () => Promise<Array<PoType>> = async () => {
  return await getMethodCall(PO_TYPES_API_LINK());
};

export { getPoTypes };
