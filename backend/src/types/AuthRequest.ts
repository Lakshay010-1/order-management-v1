import type { Request } from "express";
import type { User } from "./User.js";

export interface AuthRequest extends Request {
  user?: User;
}
