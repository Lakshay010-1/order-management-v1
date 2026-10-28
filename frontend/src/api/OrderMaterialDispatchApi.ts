import type { MaterialDispatch } from "../types/Material";
import { API_LINK } from "./URLs";
import { deleteMethodCall } from "./method_calls/DeleteCall";
import { getMethodCall } from "./method_calls/GetCall";
import { postMethodCall } from "./method_calls/PostCall";
import { putMethodCall } from "./method_calls/PutCall";

const ORDER_MATERIAL_DISPATCH_API_LINK: (
  order_id: number,
  material_id: number,
  material_dispatch_id?: number,
) => string = (order_id, material_id, material_dispatch_id) => {
  return `${API_LINK}/orders/${order_id}/materials/${material_id}/dispatch${material_dispatch_id ? "/" + material_dispatch_id : ""}`;
};

const addOrderMaterialDispatch: (
  order_id: number,
  material_id: number,
  details: MaterialDispatch,
) => Promise<MaterialDispatch> = async (order_id, material_id, details) => {
  return postMethodCall<MaterialDispatch>(
    ORDER_MATERIAL_DISPATCH_API_LINK(order_id, material_id),
    details,
  );
};

const getOrderMaterialDispatches: (
  order_id: number,
  material_id: number,
) => Promise<Array<MaterialDispatch>> = async (order_id, material_id) => {
  return getMethodCall<Array<MaterialDispatch>>(
    ORDER_MATERIAL_DISPATCH_API_LINK(order_id, material_id),
  );
};

const putOrderMaterialDispatch: (
  order_id: number,
  material_id: number,
  material_dispatch_id: number,
  details: MaterialDispatch,
) => Promise<boolean> = async (
  order_id,
  material_id,
  material_dispatch_id,
  details,
) => {
  return putMethodCall(
    ORDER_MATERIAL_DISPATCH_API_LINK(
      order_id,
      material_id,
      material_dispatch_id,
    ),
    details,
  );
};

const deleteOrderMaterialDispatch: (
  order_id: number,
  material_id: number,
  material_dispatch_id: number,
) => Promise<boolean> = async (order_id, material_id, material_dispatch_id) => {
  return deleteMethodCall(
    ORDER_MATERIAL_DISPATCH_API_LINK(
      order_id,
      material_id,
      material_dispatch_id,
    ),
  );
};

export {
  addOrderMaterialDispatch,
  deleteOrderMaterialDispatch,
  getOrderMaterialDispatches,
  putOrderMaterialDispatch,
};
