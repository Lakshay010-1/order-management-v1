import e from "express";
import authRouter from "./authRoutes.js";

const UnprotectRouter = e.Router();

UnprotectRouter.use("/auth", authRouter);

export { UnprotectRouter };
