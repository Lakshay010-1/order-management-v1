import e from "express";
import {
  addOrder,
  deleteOrder,
  getOrder,
  getOrders,
  updateOrder,
} from "../controllers/ordersController.js";
import orderServicesRouter from "./orderServicesRouter.js";
import orderMaterialsRouter from "./orderMaterialsRouter.js";
import orderPaymentTCsRouter from "./orderPaymentTcRouter.js";

const ordersRouter = e.Router();

ordersRouter.get("/", getOrders);

ordersRouter.get("/:id", getOrder);

ordersRouter.post("/", addOrder);

ordersRouter.put("/:id", updateOrder);

ordersRouter.delete("/:id", deleteOrder);

ordersRouter.use("/:order_id/services", orderServicesRouter);

ordersRouter.use("/:order_id/materials", orderMaterialsRouter);

ordersRouter.use("/:order_id/payment_tcs", orderPaymentTCsRouter);

export default ordersRouter;
