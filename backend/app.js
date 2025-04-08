import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// import userRouter from "./routes/userRoutes.js";
// import authRouter from "./routes/authRoute.js";
// import requestRouter from "./routes/requestRoutes.js";
// import supportRouter from "./routes/supportRoute.js";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
}));

app.use("/api/v1/admin", adminRouter);
// app.use("/api/v1/user", userRouter);
// app.use("/api/v1/requests", requestRouter);
// app.use("/api/v1/support", supportRouter);
// app.use("/api/v1/auth", authRouter);

export default app;
