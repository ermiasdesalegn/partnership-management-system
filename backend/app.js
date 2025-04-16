// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this before your routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);

export default app;
