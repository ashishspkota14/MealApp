import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

export default {
  schema: "./backend/src/db/schema.js",
  out: "./backend/src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
