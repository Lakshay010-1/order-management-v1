import e from "express";
import { getDeliveryMediums } from "../controllers/deliveryMediumsController.js";

const router = e.Router();

router.get("/", getDeliveryMediums);

export default router;