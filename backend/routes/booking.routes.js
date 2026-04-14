import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { bookSeat } from "../controllers/booking.controller.js";
import pool from "../db/db.js";

const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

// Get all seats
router.get("/seats", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM seats ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching seats" });
  }
});
// Book a seat
router.post("/book/:id", authMiddleware, bookSeat);

//Delete selected seat
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const seatId = req.params.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seatResult = await client.query("SELECT * FROM seats WHERE id = $1", [
      seatId,
    ]);

    if (seatResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Seat not found" });
    }

    await client.query("DELETE FROM bookings WHERE seat_id = $1", [seatId]);

    const result = await client.query(
      "UPDATE seats SET isbooked = 0 WHERE id = $1 RETURNING *",
      [seatId],
    );

    await client.query("COMMIT");

    res.json({ message: "Seat booking deleted", seat: result.rows[0] });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Ignore rollback errors to preserve original error response
    }
    console.log(err);
    res.status(500).json({
      message: "Error deleting seat booking",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

export default router;
