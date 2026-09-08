import { Router, Response } from 'express';
import { getDb } from '../database/db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;

  try {
    const result = await pool.query('SELECT * FROM notes WHERE id = $1 AND userId = $2', [req.params.id, userId]);
    const note = result.rows[0];

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      id: note.id,
      content: note.content,
      createdAt: note.createdat,
      taskId: note.taskid,
      userId: note.userid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const { content, taskId } = req.body;

  if (!content || !taskId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const taskRes = await pool.query('SELECT id FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);
    if (taskRes.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO notes (content, createdAt, taskId, userId) VALUES ($1, $2, $3, $4) RETURNING id',
      [content, new Date().toISOString(), taskId, userId]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Note created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const noteId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const existingRes = await pool.query('SELECT id FROM notes WHERE id = $1 AND userId = $2', [noteId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await pool.query('UPDATE notes SET content = $1 WHERE id = $2 AND userId = $3', [content, noteId, userId]);

    res.json({ message: 'Note updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const noteId = req.params.id;

  try {
    const existingRes = await pool.query('SELECT id FROM notes WHERE id = $1 AND userId = $2', [noteId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await pool.query('DELETE FROM notes WHERE id = $1 AND userId = $2', [noteId, userId]);

    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
