import mysql from 'mysql2';

// Create a connection pool
export const db = mysql.createPool({
  host: 'localhost',     // or your MySQL host
  user: 'root',          // your MySQL username
  password: 'KI101chris.',  // your MySQL password
  database: 'clubfinder_db',     // your database name
});

import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "clubfinder.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  clubSlug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

export default db;
