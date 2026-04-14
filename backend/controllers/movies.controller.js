import pool from "../db/db.js";

export async function getMovies(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT id, title, rating::TEXT AS rating, image_url AS img
        FROM movies
        ORDER BY id ASC
      `,
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movies" });
  }
}

export async function getMovieSeats(req, res) {
  const movieId = Number(req.params.movieId);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return res.status(400).json({ message: "Invalid movie id" });
  }

  try {
    const movieResult = await pool.query(
      "SELECT id FROM movies WHERE id = $1",
      [movieId],
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const result = await pool.query(
      `
        SELECT id, seat_number, is_booked AS isbooked
        FROM movie_seats
        WHERE movie_id = $1
        ORDER BY seat_number ASC
      `,
      [movieId],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching movie seats" });
  }
}

export async function bookMovieSeat(req, res) {
  const movieId = Number(req.params.movieId);
  const seatId = Number(req.params.seatId);
  const userId = req.user.id;

  if (!Number.isInteger(movieId) || !Number.isInteger(seatId)) {
    return res.status(400).json({ message: "Invalid request params" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seatResult = await client.query(
      `
        SELECT id, is_booked
        FROM movie_seats
        WHERE id = $1 AND movie_id = $2
        FOR UPDATE
      `,
      [seatId, movieId],
    );

    if (seatResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Seat not found for movie" });
    }

    if (seatResult.rows[0].is_booked) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Seat already booked" });
    }

    await client.query(
      "INSERT INTO movie_bookings (user_id, movie_id, seat_id) VALUES ($1, $2, $3)",
      [userId, movieId, seatId],
    );

    await client.query(
      "UPDATE movie_seats SET is_booked = TRUE WHERE id = $1",
      [seatId],
    );

    await client.query("COMMIT");
    return res.json({ message: "Seat booked successfully" });
  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === "23505") {
      return res.status(400).json({ message: "Seat already booked" });
    }

    console.error(error);
    return res.status(500).json({ message: "Error booking seat" });
  } finally {
    client.release();
  }
}

export async function unbookMovieSeat(req, res) {
  const movieId = Number(req.params.movieId);
  const seatId = Number(req.params.seatId);
  const userId = req.user.id;

  if (!Number.isInteger(movieId) || !Number.isInteger(seatId)) {
    return res.status(400).json({ message: "Invalid request params" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const seatResult = await client.query(
      `
        SELECT id, is_booked
        FROM movie_seats
        WHERE id = $1 AND movie_id = $2
        FOR UPDATE
      `,
      [seatId, movieId],
    );

    if (seatResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Seat not found for movie" });
    }

    const bookingResult = await client.query(
      `
        SELECT id, user_id
        FROM movie_bookings
        WHERE movie_id = $1 AND seat_id = $2
        FOR UPDATE
      `,
      [movieId, seatId],
    );

    if (bookingResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Seat is not booked" });
    }

    if (bookingResult.rows[0].user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "You can only cancel your own booking",
      });
    }

    await client.query("DELETE FROM movie_bookings WHERE id = $1", [
      bookingResult.rows[0].id,
    ]);

    await client.query(
      "UPDATE movie_seats SET is_booked = FALSE WHERE id = $1",
      [seatId],
    );

    await client.query("COMMIT");
    return res.json({ message: "Seat booking deleted" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    return res.status(500).json({ message: "Error deleting seat booking" });
  } finally {
    client.release();
  }
}
