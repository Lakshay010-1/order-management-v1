import e from "express";
import {
  addOrderMaterial,
  removeOrderMaterial,
  updateOrderMaterial,
  getOrderMaterials,
} from "../controllers/orderMaterialsController.js";
import orderMaterialsDispatchRouter from "./orderMaterialsDispatchRouter.js";

const orderMaterialsRouter = e.Router({ mergeParams: true });

orderMaterialsRouter.get("/", getOrderMaterials);

orderMaterialsRouter.post("/", addOrderMaterial);

orderMaterialsRouter.put("/:material_id", updateOrderMaterial);

orderMaterialsRouter.delete("/:material_id", removeOrderMaterial);

orderMaterialsRouter.use(
  "/:material_id/dispatch",
  orderMaterialsDispatchRouter, 
);

export default orderMaterialsRouter;
