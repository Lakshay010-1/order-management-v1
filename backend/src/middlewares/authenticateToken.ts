import jwt from "jsonwebtoken";
import { type Response, type NextFunction } from "express";
import { type AuthRequest } from "../types/AuthRequest.js";
import type { User } from "../types/User.js";
import { getUser } from "../services/authServices.js";
import { apiResponse } from "../utils/apiResponse.js";
import type { JwtPayload } from "jsonwebtoken";

interface AuthJwtPayload extends JwtPayload {
  userName: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as AuthJwtPayload;
    const user: User | undefined =
      decoded.userName == undefined
        ? undefined
        : await getUser(decoded.userName);
    if (!user) {
      return apiResponse(res, 401, "Unauthorized User");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid/Expired token" });
  }
};
