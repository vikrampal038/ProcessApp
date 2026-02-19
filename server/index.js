import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// 🔥 THIS MUST BE CALLED
connectDB();

// routes
import authRoutes from "./routes/auth.js";
import folderRoutes from "./routes/folder.js";
import itemsRoutes from "./routes/items.js";

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/items", itemsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
