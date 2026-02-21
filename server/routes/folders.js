// routes/folder.js
import express from "express";
import bcrypt from "bcryptjs";
import Folder from "../models/Folder.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE FOLDER
router.post("/create", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name required" });
    }

    const folder = await Folder.create({
      name,
      owner: req.user.id,
    });

    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET ALL FOLDERS
router.get("/", auth, async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE FOLDER (with deletePassword)
router.delete("/:id", auth, async (req, res) => {
  try {
    const { deletePassword } = req.body;

    if (!deletePassword) {
      return res.status(400).json({ message: "deletePassword required" });
    }

    const user = await User.findById(req.user.id);

    if (!user || !user.deletePassword) {
      return res.status(400).json({ message: "Delete password not set for user" });
    }

    const isMatch = await bcrypt.compare(deletePassword, user.deletePassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong delete password" });
    }

    // Delete all items inside this folder
    await Item.deleteMany({ folder: req.params.id, owner: req.user.id });

    // Delete the folder
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder and its items deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;