import sql from "mssql";
import { pool } from "../config/db.js";
import type { User } from "../types/User.js";

export const getUser: (username: string) => Promise<undefined | User> = async (
  username: string,
) => {
  const response = await pool!
    .request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM users WHERE username=@username");
  const { recordset } = response;
  if (recordset.length > 0) {
    return recordset[0];
  } else return undefined;
};

export const createNewUser: (
  username: string,
  password: string,
) => Promise<boolean> = async (username: string, password: string) => {
  const response = await pool!
    .request()
    .input("username", username)
    .input("password", password)
    .query(
      "INSERT INTO users (username,password) VALUES (@username,@password)",
    );
  const { rowsAffected } = response;
  return (rowsAffected[0] ?? 0) > 0;
};
