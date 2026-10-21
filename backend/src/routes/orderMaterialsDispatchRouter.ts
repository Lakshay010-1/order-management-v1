import e from "express";
import {
  getOrderMaterialDispatches,
  addOrderMaterialDispatch,
  removeOrderMaterialDispatch,
  updateOrderMaterialDispatch,
} from "../controllers/orderMaterialsDispatchController.js";

const orderMaterialsDispatchRouter = e.Router({ mergeParams: true });

orderMaterialsDispatchRouter.get("/", getOrderMaterialDispatches);

orderMaterialsDispatchRouter.post("/", addOrderMaterialDispatch);

orderMaterialsDispatchRouter.put(
  "/:material_dispatch_id",
  updateOrderMaterialDispatch,
);

orderMaterialsDispatchRouter.delete(
  "/:material_dispatch_id",
  removeOrderMaterialDispatch,
);

export default orderMaterialsDispatchRouter;
