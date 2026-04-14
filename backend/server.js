import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import pool from "./db/db.js";
import bookingRoutes from "./routes/booking.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); //backend can read json data from frontend
app.use("/api/auth", authRoutes);
app.use("/api/booking", bookingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

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
