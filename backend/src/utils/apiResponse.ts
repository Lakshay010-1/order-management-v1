import { type Response } from "express";

export const apiResponse = <T>(
  res: Response,
  status: number,
  message: string,
  data?: T,
) => {
  return res
    .status(status)
    .json({ message, success: 200 <= status && status < 300, data });
};
