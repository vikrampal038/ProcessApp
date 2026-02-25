import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 150,
    },
    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    file: {
      name: { type: String, default: "" },
      mimeType: { type: String, default: "" },
      data: { type: String, default: "" },
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
      index: true,
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

itemSchema.index({ folder: 1, owner: 1, createdAt: -1 });

export default mongoose.model("Item", itemSchema);
