import express from "express";
import { connectDB } from "./config/db.js";
import "dotenv/config";
import mainRouter from "./routes/indexRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/", mainRouter);

try {
  await connectDB();
  app.listen(PORT, () => {
    console.log("Application started successfully.");
  });
} catch (error) {
  console.log("Connection failed!");
}
