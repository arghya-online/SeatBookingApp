import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// If DATABASE_URL exists → use it (production)
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  : new Pool({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "seat_booking_db",
      password: process.env.DB_PASSWORD || "postgres",
      port: Number(process.env.DB_PORT || 5433),
    });

export default pool;
