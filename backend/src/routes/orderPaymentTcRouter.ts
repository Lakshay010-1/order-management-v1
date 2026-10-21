import e from "express";
import {
  getOrderPaymentTCs,
  addOrderPaymentTC,
  removeOrderPaymentTC,
  updateOrderPaymentTC,
} from "../controllers/orderPaymentTcController.js";

const orderPaymentTCsRouter = e.Router({ mergeParams: true });

orderPaymentTCsRouter.get("/", getOrderPaymentTCs);

orderPaymentTCsRouter.post("/", addOrderPaymentTC);

orderPaymentTCsRouter.put("/:payment_tc_id", updateOrderPaymentTC);

orderPaymentTCsRouter.delete("/:payment_tc_id", removeOrderPaymentTC);

export default orderPaymentTCsRouter;
