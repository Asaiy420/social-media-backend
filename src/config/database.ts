import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import * as schema from "../db/schema.js";

// loading environment variables
config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is undefined");
}

// connecting to the database
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
