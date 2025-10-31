import dotenv from "dotenv";
dotenv.config();

const connectionString =
  process.env.DRIZZLE_DB_URL || process.env.DATABASE_URL;

console.log("🔍 Using connection string for Drizzle =", connectionString);

export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: connectionString,
  },
};
