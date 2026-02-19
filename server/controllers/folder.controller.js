import Folder from "../models/Folder.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

// CREATE FOLDER
export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    const folder = await Folder.create({
      name,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Folder created",
      data: folder,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL FOLDERS (USER KE)
export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ owner: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: folders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE FOLDER (PASSWORD CONFIRM)
export const deleteFolder = async (req, res) => {
  try {
    const { folderId, password } = req.body;

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Delete password wrong ❌" });
    }

    await Folder.findOneAndDelete({ _id: folderId, owner: req.user.id });

    res.json({
      success: true,
      message: "Folder deleted successfully ✅",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
