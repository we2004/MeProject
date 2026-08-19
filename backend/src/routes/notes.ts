import { Router, Response } from 'express';
import { getDb } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;

  try {
    const note = await db.get('SELECT * FROM notes WHERE id = ? AND userId = ?', [req.params.id, userId]);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const { content, taskId } = req.body;

  if (!content || !taskId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const task = await db.get('SELECT id FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const result = await db.run(
      'INSERT INTO notes (content, createdAt, taskId, userId) VALUES (?, ?, ?, ?)',
      [content, new Date().toISOString(), taskId, userId]
    );

    res.status(201).json({ id: result.lastID, message: 'Note created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const noteId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const existing = await db.get('SELECT id FROM notes WHERE id = ? AND userId = ?', [noteId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await db.run('UPDATE notes SET content = ? WHERE id = ? AND userId = ?', [content, noteId, userId]);

    res.json({ message: 'Note updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const noteId = req.params.id;

  try {
    const existing = await db.get('SELECT id FROM notes WHERE id = ? AND userId = ?', [noteId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await db.run('DELETE FROM notes WHERE id = ? AND userId = ?', [noteId, userId]);

    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
