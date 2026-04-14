import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { bookSeat } from "../controllers/booking.controller.js";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

router.post("/book/:id", authMiddleware, bookSeat);

export default router;
