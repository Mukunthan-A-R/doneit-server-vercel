const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

// Define your base configuration used in all environments
const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: isProduction
    ? { rejectUnauthorized: false }
    : { rejectUnauthorized: false },
};

// Automatically inject serverless optimizations ONLY when in production
if (isProduction) {
  poolConfig.max = 1; // Max 1 connection per serverless function instance
  poolConfig.idleTimeoutMillis = 10000; // Close idle clients quickly to free up database slots
  // poolConfig.connectionTimeoutMillis = 5000;
}

const pool = new Pool(poolConfig);

const connectDB = async () => {
  try {
    const client = await pool.connect(); // Get a client from the pool
    console.log("Connected to PostgreSQL");
    // client.release();
    return client;
  } catch (err) {
    console.error("Connection error", err.stack);
  }
};

const disconnectDB = async () => {
  try {
    await pool.end();
    console.log("Disconnected from PostgreSQL");
  } catch (err) {
    console.error("Disconnection error", err.stack);
  }
};

module.exports = {
  pool,
  connectDB,
  disconnectDB,
};
