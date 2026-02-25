import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  deletePassword: {
    type: String,
    required: true, // ✅ must exist
  },
});

export default mongoose.model("User", userSchema);
