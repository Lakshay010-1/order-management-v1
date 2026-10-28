import type { DeliveryMedium } from "../types/DeliveryMedium";
import { getMethodCall } from "./method_calls/GetCall";
import { API_LINK } from "./URLs";

const Delivery_Mediums_API_LINK = () => {
  return `${API_LINK}/delivery_mediums`;
};

const getDeliveryMediums: () => Promise<Array<DeliveryMedium>> = async () => {
  return await getMethodCall(Delivery_Mediums_API_LINK());
};

export { getDeliveryMediums };
