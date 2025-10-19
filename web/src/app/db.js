import mysql from 'mysql2';

// Create a connection pool
export const db = mysql.createPool({
  host: 'localhost',     // or your MySQL host
  user: 'root',          // your MySQL username
  password: 'KI101chris.',  // your MySQL password
  database: 'clubfinder_db',     // your database name
});