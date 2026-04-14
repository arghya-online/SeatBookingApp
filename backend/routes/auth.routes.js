import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.middleware.js";

const router = express.Router();

// Example route for authentication
router.get("/test", (req, res) => {
  res.send("Testing authentication route");
});

router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 chars"),
  ],
  validate,
  registerUser,
);

router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  validate,
  loginUser,
);

export default router;
