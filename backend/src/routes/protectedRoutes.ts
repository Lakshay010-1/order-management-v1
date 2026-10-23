import e from "express";
import ordersRouter from "./ordersRoutes.js";
import itemsRouter from "./itemsRoutes.js";
import partyRouter from "./partyRoutes.js";
import statusRouter from "./statusRoutes.js";
import deliveryMediumsRouter from "./deliveryMediumsRouter.js";
import poTypesRouter from "./poTypesRouter.js";

const ProtectRouter = e.Router();

ProtectRouter.use("/orders", ordersRouter);

ProtectRouter.use("/items", itemsRouter);

ProtectRouter.use("/parties", partyRouter);

ProtectRouter.use("/statuses", statusRouter);

ProtectRouter.use("/delivery_mediums", deliveryMediumsRouter);

ProtectRouter.use("/po_types", poTypesRouter);

export { ProtectRouter };
