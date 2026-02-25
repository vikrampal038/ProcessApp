import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import folderRoutes from "./routes/folders.js";
import itemRoutes from "./routes/items.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server tools (curl/postman) that do not send Origin.
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS blocked for this origin"));
  },
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.get("/", (_req, res) => {
  res.send("ProcessApp backend is running 🚀");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true, service: "processapp-server" });
});

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/items", itemRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on ${port}`);
  });
});
