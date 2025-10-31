import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) throw new Error("DATABASE_URL not set");

export const pool = new Pool({ connectionString: DATABASE_URL });
