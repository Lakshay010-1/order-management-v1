import type { Material } from "../types/Material";
import type { NewOrderMaterial } from "../types/NewOrderMaterial";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ORDER_MATERIAL_API_LINK: (
  order_id: number,
  material_id?: number,
) => string = (order_id, material_id) => {
  return `${API_LINK}/orders/${order_id}/materials${material_id ? "/" + material_id : ""}`;
};

const addOrderMaterial: (
  order_id: number,
  details: NewOrderMaterial,
) => Promise<Material> = async (order_id, details) => {
  return postMethodCall<Material>(ORDER_MATERIAL_API_LINK(order_id), details);
};

const getOrderMaterials: (
  order_id: number,
) => Promise<Array<Material>> = async (order_id) => {
  return getMethodCall<Array<Material>>(ORDER_MATERIAL_API_LINK(order_id));
};

const putOrderMaterial: (
  order_id: number,
  material_id: number,
  details: { quantity: number; date: Date },
) => Promise<boolean> = async (order_id, material_id, details) => {
  return putMethodCall(ORDER_MATERIAL_API_LINK(order_id, material_id), details);
};

const deleteOrderMaterial: (
  order_id: number,
  material_id: number,
) => Promise<boolean> = async (order_id, material_id) => {
  return deleteMethodCall(ORDER_MATERIAL_API_LINK(order_id, material_id));
};

export {
  addOrderMaterial,
  deleteOrderMaterial,
  getOrderMaterials,
  putOrderMaterial,
};
