import type { NewOrderItem } from "../types/NewOrderItem";
import type { OrderItem } from "../types/OrderItem";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ORDER_ITEMS_API_LINK = (
  order_id: number,
  order_item_id?: number,
): string => {
  return `${API_LINK}/orders/${order_id}/items${!order_item_id ? "" : "/" + order_item_id}`;
};

const addOrderItem: (
  order_id: number,
  details: NewOrderItem,
) => Promise<OrderItem> = (order_id, details) => {
  return postMethodCall<OrderItem>(ORDER_ITEMS_API_LINK(order_id), details);
};

const getOrderItems: (order_id: number) => Promise<Array<OrderItem>> = (
  order_id,
) => {
  return getMethodCall<Array<OrderItem>>(ORDER_ITEMS_API_LINK(order_id));
};

const putOrderItem: (
  order_id: number,
  order_item_id: number,
  details: { quantity: number; date: Date },
) => Promise<boolean> = (order_id, order_item_id, details) => {
  return putMethodCall(ORDER_ITEMS_API_LINK(order_id, order_item_id), details);
};

const deleteOrderItem: (
  order_id: number,
  order_item_id: number,
) => Promise<boolean> = (order_id, order_item_id) => {
  return deleteMethodCall(ORDER_ITEMS_API_LINK(order_id, order_item_id));
};

export { addOrderItem, getOrderItems, putOrderItem, deleteOrderItem };
