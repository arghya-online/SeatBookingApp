import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const isSslEnabled = process.env.DB_SSL === "true";

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "seat_booking_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: Number(process.env.DB_PORT || 5433),
  ssl: isSslEnabled ? { rejectUnauthorized: false } : false,
});

export default pool;
