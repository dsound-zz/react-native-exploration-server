import { Router } from "express";
import { pool } from "../db";

const router = Router();

// GET all
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// POST new
router.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Title is required" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// PATCH update
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;
  if (!id) return res.status(400).json({ error: "Missing id" });
  if (title === undefined && done === undefined)
    return res.status(400).json({ error: "Nothing to update" });

  try {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(title);
    }
    if (done !== undefined) {
      fields.push(`done = $${idx++}`);
      values.push(done);
    }
    values.push(id);

    const sql = `
      UPDATE todos
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;
    const result = await pool.query(sql, values);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Todo not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Missing id" });

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Todo not found" });
    res.json({ deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
