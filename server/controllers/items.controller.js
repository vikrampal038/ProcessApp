import Item from "../models/Item.js";
import Folder from "../models/Folder.js";

export const createItem = async (req, res) => {
  try {
    const { folderId, title, content } = req.body;

    if (!folderId || !title) {
      return res.status(400).json({ message: "folderId and title required" });
    }

    const folder = await Folder.findOne({
      _id: folderId,
      owner: req.user._id, // 🔥 FIXED
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const item = await Item.create({
      title,
      content,
      folder: folderId,
      owner: req.user._id, // 🔥 FIXED
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemsByFolder = async (req, res) => {
  const items = await Item.find({
    folder: req.params.folderId,
    user: req.user.id,
  });

  res.json({ success: true, data: items });
};

export const deleteItem = async (req, res) => {
  const { itemId, password } = req.body;

  const user = req.userDoc;
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Wrong delete password" });
  }

  await Item.findOneAndDelete({ _id: itemId, user: req.user.id });

  res.json({ success: true, message: "Item deleted" });
};
