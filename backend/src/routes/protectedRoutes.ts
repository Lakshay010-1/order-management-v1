import e from "express";
import ordersRouter from "./ordersRoutes.js";
import itemsRouter from "./itemsRoutes.js";
import partyRouter from "./partyRoutes.js";
import statusRouter from "./statusRoutes.js";

const ProtectRouter = e.Router();

ProtectRouter.use("/orders", ordersRouter);

ProtectRouter.use("/items", itemsRouter);

ProtectRouter.use("/parties", partyRouter);

ProtectRouter.use("/statuses", statusRouter);

export { ProtectRouter };
