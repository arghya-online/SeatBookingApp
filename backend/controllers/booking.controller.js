import pool from "../db/db.js";

export async function bookSeat(req, res) {
  const seatId = req.params.id;
  const userId = req.user.id;

  const client = await pool.connect();

  try {
    // 1. Start transaction
    await client.query("BEGIN");

    // 2. Check if seat exists
    const seatCheck = await client.query("SELECT * FROM seats WHERE id = $1", [
      seatId,
    ]);

    if (seatCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Seat not found" });
    }

    // 3. Check if already booked (lock row)
    const seatResult = await client.query(
      "SELECT * FROM seats WHERE id = $1 AND isbooked = 0 FOR UPDATE",
      [seatId],
    );

    if (seatResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Seat already booked" });
    }

    // 4. Double check in bookings table
    const alreadyBooked = await client.query(
      "SELECT * FROM bookings WHERE seat_id = $1",
      [seatId],
    );

    if (alreadyBooked.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Seat already booked" });
    }

    // 5. Insert booking
    await client.query(
      "INSERT INTO bookings (user_id, seat_id) VALUES ($1, $2)",
      [userId, seatId],
    );

    // 6. Update seat
    await client.query("UPDATE seats SET isbooked = 1 WHERE id = $1", [seatId]);

    // 7. Commit
    await client.query("COMMIT");

    client.release();

    return res.json({ message: "Seat booked successfully" });
  } catch (error) {
    // Rollback on error

    await client.query("ROLLBACK");
    client.release();
    console.log(error);

    return res.status(500).json({ message: error.message });
  }
}
