import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function migrate() {
  console.log('Starting migration from SQLite to PostgreSQL...');

  const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  const sqliteDb = await open({
    filename: path.join(__dirname, '../../backend/database.sqlite'),
    driver: sqlite3.Database
  });

  try {
    // 1. Users
    const users = await sqliteDb.all('SELECT * FROM users');
    for (const u of users) {
      await pgPool.query(
        `INSERT INTO users (id, name, username, password, recoveryKey, isDemo) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [u.id, u.name, u.username, u.password, u.recoveryKey, Boolean(u.isDemo)]
      );
    }
    console.log(`Migrated ${users.length} users.`);

    // 2. Projects
    const projects = await sqliteDb.all('SELECT * FROM projects');
    for (const p of projects) {
      await pgPool.query(
        `INSERT INTO projects (id, name, description, dueDate, cancelled, techStack, userId) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [p.id, p.name, p.description, p.dueDate, Boolean(p.cancelled), p.techStack, p.userId]
      );
    }
    console.log(`Migrated ${projects.length} projects.`);

    // 3. Tasks
    const tasks = await sqliteDb.all('SELECT * FROM tasks');
    for (const t of tasks) {
      await pgPool.query(
        `INSERT INTO tasks (id, name, projectId, status, priority, dueDate, description, userId) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.name, t.projectId, t.status, t.priority, t.dueDate, t.description, t.userId]
      );
    }
    console.log(`Migrated ${tasks.length} tasks.`);

    // 4. Notes
    const notes = await sqliteDb.all('SELECT * FROM notes');
    for (const n of notes) {
      await pgPool.query(
        `INSERT INTO notes (id, content, createdAt, taskId, userId) 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO NOTHING`,
        [n.id, n.content, n.createdAt, n.taskId, n.userId]
      );
    }
    console.log(`Migrated ${notes.length} notes.`);

    // 5. Attachments
    const attachments = await sqliteDb.all('SELECT * FROM attachments');
    for (const a of attachments) {
      await pgPool.query(
        `INSERT INTO attachments (id, name, type, projectId, filePath, userId) 
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [a.id, a.name, a.type, a.projectId, a.filePath, a.userId]
      );
    }
    console.log(`Migrated ${attachments.length} attachments.`);

    // Update sequences
    await pgPool.query(`SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false)`);
    await pgPool.query(`SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 0) + 1, false)`);
    await pgPool.query(`SELECT setval('tasks_id_seq', COALESCE((SELECT MAX(id) FROM tasks), 0) + 1, false)`);
    await pgPool.query(`SELECT setval('notes_id_seq', COALESCE((SELECT MAX(id) FROM notes), 0) + 1, false)`);
    await pgPool.query(`SELECT setval('attachments_id_seq', COALESCE((SELECT MAX(id) FROM attachments), 0) + 1, false)`);
    
    console.log('Migration completed successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await sqliteDb.close();
    await pgPool.end();
  }
}

migrate();
