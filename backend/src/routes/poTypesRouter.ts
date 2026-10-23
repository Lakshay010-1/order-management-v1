import e from "express";
import { getPoTypes } from "../controllers/poTypeController.js";

const router = e.Router();

router.get("/", getPoTypes);

export default router;
