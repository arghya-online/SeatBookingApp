import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getMovies,
  getMovieSeats,
  bookMovieSeat,
  unbookMovieSeat,
} from "../controllers/movies.controller.js";

const router = express.Router();

router.get("/", getMovies);
router.get("/:movieId/seats", getMovieSeats);
router.post("/:movieId/seats/:seatId/book", authMiddleware, bookMovieSeat);
router.delete("/:movieId/seats/:seatId/book", authMiddleware, unbookMovieSeat);

export default router;
