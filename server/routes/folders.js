// routes/folder.js
import express from "express";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Folder from "../models/Folder.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE FOLDER
router.post("/create", auth, async (req, res) => {
  try {
    const { name, parentId = null } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name required" });
    }

    if (parentId) {
      const parentFolder = await Folder.findOne({
        _id: parentId,
        owner: req.user.id,
      });

      if (!parentFolder) {
        return res.status(404).json({ message: "Parent folder not found" });
      }
    }

    const folder = await Folder.create({
      name,
      owner: req.user.id,
      parent: parentId,
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

    const rootFolder = await Folder.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!rootFolder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const folders = await Folder.find({ owner: req.user.id }).select("_id parent");
    const byParent = new Map();

    for (const f of folders) {
      const key = f.parent ? String(f.parent) : "root";
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(String(f._id));
    }

    const toDelete = [];
    const queue = [String(rootFolder._id)];

    while (queue.length) {
      const currentId = queue.shift();
      toDelete.push(currentId);
      const children = byParent.get(currentId) || [];
      queue.push(...children);
    }

    const folderObjectIds = toDelete.map(
      (id) => new mongoose.Types.ObjectId(String(id))
    );

    const deletedItems = await Item.deleteMany({
      folder: { $in: folderObjectIds },
      owner: req.user.id,
    });
    const deletedFolders = await Folder.deleteMany({
      _id: { $in: folderObjectIds },
      owner: req.user.id,
    });

    res.json({
      success: true,
      message: "Folder tree and items deleted successfully",
      deletedFolders: deletedFolders.deletedCount || 0,
      deletedItems: deletedItems.deletedCount || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
