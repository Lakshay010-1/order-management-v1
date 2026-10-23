import express from "express";
import {
  createOrderService,
  getOrderServices,
  removeOrderService,
  updateOrderService,
} from "../controllers/orderServicesController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getOrderServices);

router.post("/", createOrderService);

router.put("/:service_id", updateOrderService);

router.delete("/:service_id", removeOrderService);

export default router;
