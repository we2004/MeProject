import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import path from 'path';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedDemoData() {
  console.log('Starting demo data seed process...');

  try {
    // 1. Clean up existing demo user (this will cascade delete all associated data)
    console.log('Cleaning up existing demo data...');
    await pool.query('DELETE FROM users WHERE isDemo = true');

    // 2. Create the demo user
    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash('demo', 10);
    const recoveryKey = crypto.randomBytes(16).toString('hex');

    const userRes = await pool.query(
      `INSERT INTO users (name, username, password, recoveryKey, isDemo) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ['Demo User', 'demo', hashedPassword, recoveryKey, true]
    );
    const demoUserId = userRes.rows[0].id;

    // 3. Create demo projects
    console.log('Creating demo projects...');
    const projectRes1 = await pool.query(
      `INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'Personal Portfolio',
        'Build a modern portfolio website to showcase my skills.',
        new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0], // 15 days in future
        false,
        JSON.stringify(['React', 'TypeScript', 'Tailwind CSS']),
        demoUserId
      ]
    );
    const p1Id = projectRes1.rows[0].id;

    const projectRes2 = await pool.query(
      `INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'MeProject',
        'A full-stack task management application.',
        new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        false,
        JSON.stringify(['Node.js', 'Express', 'PostgreSQL']),
        demoUserId
      ]
    );
    const p2Id = projectRes2.rows[0].id;

    const projectRes3 = await pool.query(
      `INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [
        'AI Assistant',
        'An experimental AI chatbot.',
        new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], // 5 days ago (overdue)
        false,
        JSON.stringify(['Python', 'LangChain', 'OpenAI']),
        demoUserId
      ]
    );
    const p3Id = projectRes3.rows[0].id;

    // 4. Create demo tasks
    console.log('Creating demo tasks...');
    const taskRes1 = await pool.query(
      `INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Design UI Mockups',
        p1Id,
        'completed',
        'high',
        new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        'Create Figma mockups for the portfolio landing page.',
        demoUserId
      ]
    );
    const t1Id = taskRes1.rows[0].id;

    const taskRes2 = await pool.query(
      `INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Setup Backend Database',
        p2Id,
        'open',
        'high',
        new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        'Initialize PostgreSQL and configure the connection pool.',
        demoUserId
      ]
    );
    const t2Id = taskRes2.rows[0].id;

    const taskRes3 = await pool.query(
      `INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        'Fix Prompt Injection Bug',
        p3Id,
        'open',
        'medium',
        new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], // Overdue
        'Ensure user input is properly sanitized before passing to the LLM.',
        demoUserId
      ]
    );
    const t3Id = taskRes3.rows[0].id;

    // 5. Create demo notes
    console.log('Creating demo notes...');
    await pool.query(
      `INSERT INTO notes (content, createdAt, taskId, userId) VALUES ($1, $2, $3, $4)`,
      [
        'Remember to use a dark mode color palette.',
        new Date(Date.now() - 3 * 86400000).toISOString(),
        t1Id,
        demoUserId
      ]
    );

    await pool.query(
      `INSERT INTO notes (content, createdAt, taskId, userId) VALUES ($1, $2, $3, $4)`,
      [
        'Use pg for connection pooling.',
        new Date().toISOString(),
        t2Id,
        demoUserId
      ]
    );

    console.log('Demo data seed completed successfully!');
    console.log(`Created 1 Demo User, 3 Projects, 3 Tasks, 2 Notes.`);
  } catch (error) {
    console.error('Failed to seed demo data:', error);
  } finally {
    await pool.end();
  }
}

seedDemoData();
