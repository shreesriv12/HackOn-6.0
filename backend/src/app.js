import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { healthRouter } from "./routes/health.routes.js";
import { productRouter } from "./routes/product.routes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api", productRouter);
