import pool from "./db.js";
import { seedMovies } from "../data/movies.seed.js";

const DEFAULT_SEATS_PER_MOVIE = Number(process.env.SEATS_PER_MOVIE || 40);

export async function initializeDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(160) NOT NULL UNIQUE,
        rating NUMERIC(3, 1) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS movie_seats (
        id SERIAL PRIMARY KEY,
        movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        seat_number INTEGER NOT NULL,
        is_booked BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (movie_id, seat_number)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS movie_bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
        seat_id INTEGER NOT NULL REFERENCES movie_seats(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        UNIQUE (movie_id, seat_id)
      )
    `);

    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_movie_seats_movie_id ON movie_seats(movie_id)",
    );
    await client.query(
      "CREATE INDEX IF NOT EXISTS idx_movie_bookings_user_id ON movie_bookings(user_id)",
    );

    for (const movie of seedMovies) {
      await client.query(
        `
          INSERT INTO movies (title, rating, image_url)
          VALUES ($1, $2, $3)
          ON CONFLICT (title)
          DO UPDATE SET rating = EXCLUDED.rating, image_url = EXCLUDED.image_url
        `,
        [movie.title, movie.rating, movie.imageUrl],
      );
    }

    await client.query(
      `
        INSERT INTO movie_seats (movie_id, seat_number)
        SELECT m.id, gs.seat_number
        FROM movies m
        CROSS JOIN generate_series(1, $1) AS gs(seat_number)
        ON CONFLICT (movie_id, seat_number) DO NOTHING
      `,
      [DEFAULT_SEATS_PER_MOVIE],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
