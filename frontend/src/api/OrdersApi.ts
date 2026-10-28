import type { NewOrder_a, NewOrder_b } from "../types/Order";
import type { Order } from "../types/Order";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ORDERS_API_LINK = API_LINK + "/orders";

const addOrder: (details: NewOrder_b) => Promise<Order> = (details) => {
  return postMethodCall<Order>(ORDERS_API_LINK, details);
};

const getOrder: (id: number) => Promise<Order> = (id) => {
  return getMethodCall<Order>(`${ORDERS_API_LINK}/${id}`);
};

const getOrders: () => Promise<Array<Order>> = () => {
  return getMethodCall<Array<Order>>(ORDERS_API_LINK);
};

const putOrder: (id: number, details: NewOrder_a) => Promise<boolean> = (
  id,
  details,
) => {
  return putMethodCall(`${ORDERS_API_LINK}/${id}`, details);
};

const deleteOrder: (id: number) => Promise<boolean> = (id) => {
  return deleteMethodCall(`${ORDERS_API_LINK}/${id}`);
};

export { addOrder, getOrder, getOrders, putOrder, deleteOrder };
