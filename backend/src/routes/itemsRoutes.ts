import e from "express";
import {
  createItem,
  deleteItem,
  getItems,
  updateItem,
} from "../controllers/itemsController.js";

const itemsRouter = e.Router();

itemsRouter.get("/", getItems);

itemsRouter.post("/", createItem);

itemsRouter.put("/:id", updateItem);

itemsRouter.delete("/:id", deleteItem);

export default itemsRouter;
