import dotenv from "dotenv";
dotenv.config();

const raw = process.env.PORT ?? "4000";
export const PORT = Number(raw);
