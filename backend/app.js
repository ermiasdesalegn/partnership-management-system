// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import superAdminRoutes from './routes/superAdminRoutes.js';
import internalUserRoutes from './routes/internalUserRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import partnershipActivityRoutes from './routes/partnershipActivityRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import partnershipStatisticsRoutes from './routes/partnershipStatisticsRoutes.js';

dotenv.config();

const app = express();

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows images/resources to be loaded from localhost on different ports
}));

// Limit requests from same API
const limiter = rateLimit({
  max: 1000, // 1000 requests per hour
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use('/api', limiter);

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add this before your routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/api/v1/files', express.static(path.join(__dirname, 'public/uploads')));
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Routes
app.use("/api/v1/internal", internalUserRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/user", userRouter);
app.use('/api/v1/super-admin', superAdminRoutes);
app.use('/api/v1/partners', partnerRoutes);
app.use('/api/v1/partnership-activities', partnershipActivityRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/partnership-statistics', partnershipStatisticsRoutes);

export default app;
