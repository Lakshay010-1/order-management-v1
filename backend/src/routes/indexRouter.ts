import e from "express";
import { UnprotectRouter } from "./unprotectedRoutes.js";
import { ProtectRouter } from "./protectedRoutes.js";
import { authenticate } from "../middlewares/authenticateToken.js";

const mainRouter = e.Router();

mainRouter.get("/", (req, res) => {
  res.status(200).json({ message: "API running successfully" });
});

mainRouter.use("/", UnprotectRouter);

mainRouter.use("/api", authenticate, ProtectRouter);

export default mainRouter;
