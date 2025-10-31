import { pool } from "../db";

const seedTodos = [
  { title: "Learn React Native", done: false },
  { title: "Set up backend API", done: false },
  { title: "Buy groceries", done: true },
];

async function runSeed() {
  console.log("Seeding todos...");

  try {
    await pool.query("BEGIN");

    await pool.query("DELETE FROM todos");

    for (const todo of seedTodos) {
      await pool.query("INSERT INTO todos (title, done) VALUES ($1, $2)", [
        todo.title,
        todo.done,
      ]);
    }

    await pool.query("COMMIT");
    console.log("Seed complete!");
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Seed failed", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

runSeed();
