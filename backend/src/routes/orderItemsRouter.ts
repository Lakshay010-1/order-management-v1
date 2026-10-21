import e from "express";
import {
  addOrderItem,
  removeOrderItem,
  getOrderItems,
  updateOrderItem,
} from "../controllers/orderItemsController.js";

const orderItemsRouter = e.Router({ mergeParams: true });

orderItemsRouter.get("/", getOrderItems);

orderItemsRouter.post("/", addOrderItem);

orderItemsRouter.put("/:item_id", updateOrderItem);

orderItemsRouter.delete("/:item_id", removeOrderItem);

export default orderItemsRouter;
