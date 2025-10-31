import express from "express";
import cors from "cors";
import { PORT } from "./env";
import todosRouter from "./routes/todos";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/todos", todosRouter);

// start
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
