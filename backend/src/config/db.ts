import sql from "mssql";
import "dotenv/config";
import { type DBConfig } from "../types/dbConfig.js";
import { validateNumEnv, validateStrEnv } from "../utils/validateEnv.js";

const config: DBConfig = {
  user: validateStrEnv("DB_USER"),
  password: validateStrEnv("DB_PASSWORD"),
  server: validateStrEnv("DB_SERVER"),
  database: validateStrEnv("DB_DATABASE"),
  port: validateNumEnv("DB_PORT"),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};
const pool: sql.ConnectionPool = new sql.ConnectionPool(config);
const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Database successfully connected");
  } catch (error) {
    console.log("Database connection failed!");
    throw error;
  }
};

export { connectDB, pool };
