import e from "express";
import {
  createStatus,
  deleteStatus,
  getStatuses,
  updateStatus,
} from "../controllers/statusesController.js";

const statusRouter = e.Router();

statusRouter.get("/", getStatuses);

statusRouter.post("/", createStatus);

statusRouter.put("/:id", updateStatus);

statusRouter.delete("/:id", deleteStatus);

export default statusRouter;
