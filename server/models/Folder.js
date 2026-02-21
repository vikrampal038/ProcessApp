import mongoose from "mongoose";

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

folderSchema.index({ owner: 1, createdAt: -1 });
folderSchema.index({ owner: 1, name: 1 }, { unique: true });

export default mongoose.model("Folder", folderSchema);