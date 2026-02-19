import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

export default mongoose.model("Test", testSchema);
