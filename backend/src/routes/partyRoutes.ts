import e from "express";
import {
  createParty,
  deleteParty,
  getParties,
  updateParty,
} from "../controllers/partyController.js";

const partyRouter = e.Router();

partyRouter.get("/", getParties);

partyRouter.put("/:id", updateParty);

partyRouter.post("/", createParty);

partyRouter.delete("/:id", deleteParty);

export default partyRouter;
