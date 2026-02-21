import bcrypt from "bcrypt";
import Item from "../models/Item.js";
import User from "../models/User.js";
import Folder from "../models/Folder.js";

export const createItem = async (req, res) => {
  try {
    const { name, folderId } = req.body;

    if (!name || !folderId) {
      return res.status(400).json({ message: "Name and folderId required" });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      owner: req.user._id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const item = await Item.create({
      name,
      folder: folderId,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      item,
      message: "Item created successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemsByFolder = async (req, res) => {
  try {
    const { folderId } = req.params;

    const items = await Item.find({
      folder: folderId,
      owner: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { deletePassword } = req.body;

    if (!deletePassword) {
      return res.status(400).json({ message: "Delete password required" });
    }

    const user = await User.findById(req.user._id);
    const isOk = await bcrypt.compare(deletePassword, user.deletePassword);

    if (!isOk) {
      return res.status(401).json({ message: "Wrong delete password" });
    }

    const item = await Item.findOneAndDelete({
      _id: itemId,
      owner: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};