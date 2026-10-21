import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type Request, type Response } from "express";
import { z } from "zod";
import { createNewUser, getUser } from "../services/authServices.js";
import type { User } from "../types/User.js";
import { apiResponse } from "../utils/apiResponse.js";
import type { AuthRequest } from "../types/AuthRequest.js";

const bodySchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().trim().min(1),
});

const validateUser = async (req: AuthRequest, res: Response) => {
  return apiResponse(res, 200, "Authrorized User", {
    username: req.user?.username,
  });
};

const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const paramsValid = bodySchema.safeParse({ username, password });
  if (paramsValid.success) {
    try {
      const userExists: User | undefined = await getUser(username);
      if (userExists) {
        return apiResponse(res, 400, "User already exists");
      }
      const hashedPassword: string = await bcrypt.hash(
        password,
        Number(process.env.PASSWORD_SALT!),
      );
      const userCreated = await createNewUser(username, hashedPassword);
      if (userCreated) {
        return apiResponse(
          res,
          201,
          "User registered successfully",
          userCreated,
        );
      } else {
        return apiResponse(res, 400, "Failed registering user", userCreated);
      }
    } catch (error) {
      return apiResponse(res, 400, "Error registering user");
    }
  } else {
    return apiResponse(res, 400, "Missing required fields");
  }
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const paramsValid = bodySchema.safeParse({ username, password });
  if (paramsValid.success) {
    try {
      const user: User | undefined = await getUser(username);
      if (!user) {
        return apiResponse(res, 401, "Failed validating user");
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return apiResponse(res, 400, "Invalid User");
      }

      const token = jwt.sign(
        {
          userName: user.username,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30d",
        },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return apiResponse(res, 200, "Valid User");
    } catch (error) {
      return apiResponse(res, 400, "Error validating user");
    }
  } else {
    return apiResponse(res, 400, "Missing required fields");
  }
};

const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "production",
    sameSite: "lax",
  });
  return apiResponse(res, 200, "Logged out successfully");
};

export { registerUser, loginUser, logoutUser, validateUser };
