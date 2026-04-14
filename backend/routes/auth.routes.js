import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

// Example route for authentication
router.get("/test", (req, res) => {
  res.send("Testing authentication route");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;
