import { Router, Response } from 'express';
import { getDb } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const projectId = req.query.projectId as string;
  const status = req.query.status as string || 'all';
  const priority = req.query.priority as string || 'all';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM tasks WHERE userId = ?';
    const params: any[] = [userId];

    if (projectId) {
      query += ' AND projectId = ?';
      params.push(projectId);
    }

    if (priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    const tasks = await db.all(query, params);

    // In-memory filter for status derived from dates
    let filtered = tasks;
    const today = new Date(new Date().toDateString());

    if (status === 'completed') {
      filtered = tasks.filter(t => t.status === 'completed');
    } else if (status === 'overdue') {
      filtered = tasks.filter(t => t.status === 'open' && new Date(t.dueDate) < today);
    } else if (status === 'open') {
      filtered = tasks.filter(t => t.status === 'open' && new Date(t.dueDate) >= today);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedTasks = filtered.slice(offset, offset + limit);

    res.json({
      data: paginatedTasks,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;

  try {
    const task = await db.get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [req.params.id, userId]);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const { name, projectId, status, priority, dueDate, description } = req.body;

  if (!name || !projectId || !status || !priority || !dueDate || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (status !== 'open' && status !== 'completed') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (!['high', 'medium', 'low'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  try {
    const project = await db.get('SELECT id FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    const result = await db.run(
      'INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, projectId, status, priority, dueDate, description, userId]
    );

    res.status(201).json({ id: result.lastID, message: 'Task created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const taskId = req.params.id;
  const { name, projectId, status, priority, dueDate, description } = req.body;

  if (status && status !== 'open' && status !== 'completed') {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (priority && !['high', 'medium', 'low'].includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority' });
  }

  try {
    const existing = await db.get('SELECT id, projectId FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (projectId && projectId !== existing.projectId) {
      const project = await db.get('SELECT id FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);
      if (!project) {
        return res.status(404).json({ error: 'Target project not found or unauthorized' });
      }
    }

    await db.run(
      'UPDATE tasks SET name = COALESCE(?, name), projectId = COALESCE(?, projectId), status = COALESCE(?, status), priority = COALESCE(?, priority), dueDate = COALESCE(?, dueDate), description = COALESCE(?, description) WHERE id = ? AND userId = ?',
      [name, projectId, status, priority, dueDate, description, taskId, userId]
    );

    res.json({ message: 'Task updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const taskId = req.params.id;

  try {
    const existing = await db.get('SELECT id FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/notes', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const taskId = req.params.id;

  try {
    const task = await db.get('SELECT id FROM tasks WHERE id = ? AND userId = ?', [taskId, userId]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const notes = await db.all('SELECT * FROM notes WHERE taskId = ? AND userId = ? ORDER BY createdAt DESC', [taskId, userId]);
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
