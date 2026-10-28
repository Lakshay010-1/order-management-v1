import type { NewOrderService, OrderService } from "../types/OrderService";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";
import { API_LINK } from "./URLs";

const ORDER_SERVICES_API_LINK = (order_id: number, service_id?: number) => {
  return `${API_LINK}/orders/${order_id}/services${service_id ? `/${service_id}` : ""}`;
};

const getOrderServices: (
  order_id: number,
) => Promise<Array<OrderService>> = async (order_id) => {
  return await getMethodCall(ORDER_SERVICES_API_LINK(order_id));
};

const addOrderService: (
  order_id: number,
  details: NewOrderService,
) => Promise<OrderService> = async (order_id, details) => {
  return await postMethodCall(ORDER_SERVICES_API_LINK(order_id), details);
};

const putOrderService: (
  order_id: number,
  service_id: number,
  details: NewOrderService,
) => Promise<boolean> = async (order_id, service_id, details) => {
  return await putMethodCall(
    ORDER_SERVICES_API_LINK(order_id, service_id),
    details,
  );
};

const deleteOrderService: (
  order_id: number,
  service_id: number,
) => Promise<boolean> = async (order_id, service_id) => {
  return await deleteMethodCall(ORDER_SERVICES_API_LINK(order_id, service_id));
};

export {
  getOrderServices,
  addOrderService,
  putOrderService,
  deleteOrderService,
};
