import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

let db: Database<sqlite3.Database, sqlite3.Statement>;

export const getDb = () => db;

export async function initDb() {
  db = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      recoveryKey TEXT NOT NULL,
      isDemo BOOLEAN DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      cancelled BOOLEAN NOT NULL DEFAULT 0,
      techStack TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      projectId INTEGER NOT NULL,
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      description TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      taskId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks (id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users (id)
    );

    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      projectId INTEGER NOT NULL,
      filePath TEXT NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (projectId) REFERENCES projects (id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  // Handle migration for existing databases: add 'name' column if it doesn't exist
  const tableInfo = await db.all("PRAGMA table_info(users)");
  const hasNameColumn = tableInfo.some((col: any) => col.name === 'name');
  if (!hasNameColumn) {
    await db.exec(`ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT 'User'`);
  }

  // Create or reset Demo User
  await db.exec(`DELETE FROM users WHERE isDemo = 1`);
  
  // Since we deleted the demo user, cascading delete wouldn't work on SQLite by default without PRAGMA foreign_keys = ON;
  // Let's enable foreign keys first.
  await db.exec(`PRAGMA foreign_keys = ON;`);

  // Clean up any orphaned resources just in case
  await db.exec(`DELETE FROM projects WHERE userId NOT IN (SELECT id FROM users)`);
  await db.exec(`DELETE FROM tasks WHERE userId NOT IN (SELECT id FROM users)`);
  await db.exec(`DELETE FROM notes WHERE userId NOT IN (SELECT id FROM users)`);
  await db.exec(`DELETE FROM attachments WHERE userId NOT IN (SELECT id FROM users)`);
  
  const demoHashedPassword = await bcrypt.hash('demo', 10);
  const demoResult = await db.run(
    'INSERT INTO users (name, username, password, recoveryKey, isDemo) VALUES (?, ?, ?, ?, ?)',
    ['Demo User', 'demo_user', demoHashedPassword, 'demo_recovery_key', 1]
  );
  
  const demoUserId = demoResult.lastID;

  // Seed demo data
  const project1 = await db.run(
    'INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) VALUES (?, ?, ?, ?, ?, ?)',
    ['E-commerce Website', 'Build a modern e-commerce platform', new Date(Date.now() + 864000000).toISOString().split('T')[0], 0, JSON.stringify(['React', 'Node.js']), demoUserId]
  );

  const project2 = await db.run(
    'INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) VALUES (?, ?, ?, ?, ?, ?)',
    ['Mobile App', 'Develop a fitness tracking app', new Date(Date.now() - 864000000).toISOString().split('T')[0], 0, JSON.stringify(['Flutter', 'Firebase']), demoUserId]
  );

  await db.run(
    'INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Design UI', project1.lastID, 'open', 'high', new Date(Date.now() + 86400000).toISOString().split('T')[0], 'Create Figma mockups', demoUserId]
  );
  
  const task1 = await db.run(
    'INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
    ['Setup Backend', project1.lastID, 'completed', 'medium', new Date(Date.now() - 86400000).toISOString().split('T')[0], 'Initialize Node project', demoUserId]
  );

  await db.run(
    'INSERT INTO notes (content, createdAt, taskId, userId) VALUES (?, ?, ?, ?)',
    ['Make sure to use Express', new Date().toISOString(), task1.lastID, demoUserId]
  );

}
