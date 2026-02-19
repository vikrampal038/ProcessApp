import express from "express";
import { createFolder, getFolders, deleteFolder } from "../controllers/folder.controller.js";
import  protect  from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, createFolder);
router.get("/all", protect, getFolders);
router.delete("/delete", protect, deleteFolder);

export default router;
