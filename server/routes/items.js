import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createItem,
  getItemsByFolder,
  deleteItem,
} from "../controllers/items.controller.js";

const router = express.Router();

router.post("/create", auth, createItem);
router.get("/by-folder/:folderId", auth, getItemsByFolder);
router.delete("/delete", auth, deleteItem);

export default router;