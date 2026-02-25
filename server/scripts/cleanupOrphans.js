import dotenv from "dotenv";
import mongoose from "mongoose";
import Item from "../models/Item.js";
import Folder from "../models/Folder.js";

dotenv.config();

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Missing MongoDB connection string in .env");
  process.exit(1);
}

const toIdList = (rows) => rows.map((row) => row._id);

async function cleanupOrphans() {
  await mongoose.connect(mongoUri);

  // Items whose folder no longer exists.
  const orphanItemsByFolder = await Item.aggregate([
    {
      $lookup: {
        from: "folders",
        localField: "folder",
        foreignField: "_id",
        as: "folderDoc",
      },
    },
    {
      $match: { folderDoc: { $size: 0 } },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  // Items whose owner and folder owner do not match.
  const orphanItemsByOwnerMismatch = await Item.aggregate([
    {
      $lookup: {
        from: "folders",
        localField: "folder",
        foreignField: "_id",
        as: "folderDoc",
      },
    },
    {
      $unwind: "$folderDoc",
    },
    {
      $match: {
        $expr: { $ne: ["$owner", "$folderDoc.owner"] },
      },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  const orphanItemIds = [
    ...toIdList(orphanItemsByFolder),
    ...toIdList(orphanItemsByOwnerMismatch),
  ];

  const uniqueItemIds = [...new Set(orphanItemIds.map(String))].map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  let deletedItemsCount = 0;
  if (uniqueItemIds.length > 0) {
    const itemResult = await Item.deleteMany({ _id: { $in: uniqueItemIds } });
    deletedItemsCount = itemResult.deletedCount || 0;
  }

  // Folders whose parent no longer exists (excluding root folders with parent null).
  const orphanFolders = await Folder.aggregate([
    {
      $match: { parent: { $ne: null } },
    },
    {
      $lookup: {
        from: "folders",
        localField: "parent",
        foreignField: "_id",
        as: "parentDoc",
      },
    },
    {
      $match: { parentDoc: { $size: 0 } },
    },
    {
      $project: { _id: 1 },
    },
  ]);

  const orphanFolderIds = toIdList(orphanFolders);
  let deletedFoldersCount = 0;
  if (orphanFolderIds.length > 0) {
    const folderResult = await Folder.deleteMany({ _id: { $in: orphanFolderIds } });
    deletedFoldersCount = folderResult.deletedCount || 0;
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        deletedItemsCount,
        deletedFoldersCount,
      },
      null,
      2
    )
  );

  await mongoose.disconnect();
}

cleanupOrphans().catch(async (err) => {
  console.error("Cleanup failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
