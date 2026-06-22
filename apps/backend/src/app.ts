import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "@/lib/env.ts";

import adminRoutes from "@/routes/admin.routes";
import authRoutes from "@/routes/auth.routes";
import todoRoutes from "@/routes/todo.routes";

const app = express();

app.use(
  cors({
    origin:
      env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.json({ status: "ok", message: "The server is up and running 🍀" });
});

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);

export default app;
