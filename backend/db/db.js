import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "seat_booking_db",
  password: "postgres",
  port: 5433,
});

export default pool;
