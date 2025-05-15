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
import superAdminRoutes from './routes/superAdminRoutes.js';
import internalUserRoutes from './routes/internalUserRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this before your routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/v1/files', express.static(path.join(__dirname, 'public/uploads')));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/internal", internalUserRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use('/api/v1/super-admin', superAdminRoutes);
app.use('/api/v1/partners', partnerRoutes);

export default app;
