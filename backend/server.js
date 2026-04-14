import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import pool from "./db/db.js";
import bookingRoutes from "./routes/booking.routes.js";
import moviesRoutes from "./routes/movies.routes.js";
import helmet from "helmet";
import { errorHandler } from "./middleware/error.middleware.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(rateLimiter);

app.use(
  cors({
    origin: ["http://localhost:5173", "https://seat-booking-app-xi.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json()); //backend can read json data from frontend
app.use(helmet());
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/movies", moviesRoutes);
app.use(errorHandler);

async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
}

startServer();

app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error connecting to the database");
  }
});
