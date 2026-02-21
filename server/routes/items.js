// routes/items.js
import express from "express";
import bcrypt from "bcryptjs";
import Item from "../models/Item.js";
import User from "../models/User.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

// CREATE ITEM
router.post("/create", auth, async (req, res) => {
  try {
    const { name, folderId } = req.body;

    if (!name || !folderId) {
      return res.status(400).json({ message: "name & folderId required" });
    }

    const item = await Item.create({
      name,
      folder: folderId,
      owner: req.user.id,
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE ITEM
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

    const item = await Item.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;