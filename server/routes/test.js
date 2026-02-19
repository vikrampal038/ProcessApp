import express from "express";
const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({ success: true, message: "API working fine 🚀" });
});

export default router;  // 👈 IMPORTANT
