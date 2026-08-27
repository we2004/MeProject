import { Router, Response } from 'express';
import { getDb } from '../database/db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const projectId = req.query.projectId as string;
  const status = req.query.status as string || 'all';
  const priority = req.query.priority as string || 'all';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM tasks WHERE userId = $1';
    const params: any[] = [userId];
    let paramIndex = 2;

    if (projectId) {
      query += ` AND projectId = $${paramIndex}`;
      params.push(projectId);
      paramIndex++;
    }

    if (priority !== 'all') {
      query += ` AND priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    const result = await pool.query(query, params);
    
    // Convert column names from lowercase if needed
    const tasks = result.rows.map(r => ({
      id: r.id,
      name: r.name,
      projectId: r.projectid,
      status: r.status,
      priority: r.priority,
      dueDate: r.duedate,
      description: r.description,
      userId: r.userid
    }));

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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;

  try {
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1 AND userId = $2', [req.params.id, userId]);
    const task = result.rows[0];

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      id: task.id,
      name: task.name,
      projectId: task.projectid,
      status: task.status,
      priority: task.priority,
      dueDate: task.duedate,
      description: task.description,
      userId: task.userid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
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
    const projectRes = await pool.query('SELECT id FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);
    if (projectRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (name, projectId, status, priority, dueDate, description, userId) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [name, projectId, status, priority, dueDate, description, userId]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Task created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
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
    const existingRes = await pool.query('SELECT id, projectId FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (projectId && projectId !== existingRes.rows[0].projectid) {
      const projectRes = await pool.query('SELECT id FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);
      if (projectRes.rows.length === 0) {
        return res.status(404).json({ error: 'Target project not found or unauthorized' });
      }
    }

    await pool.query(
      'UPDATE tasks SET name = COALESCE($1, name), projectId = COALESCE($2, projectId), status = COALESCE($3, status), priority = COALESCE($4, priority), dueDate = COALESCE($5, dueDate), description = COALESCE($6, description) WHERE id = $7 AND userId = $8',
      [name, projectId, status, priority, dueDate, description, taskId, userId]
    );

    res.json({ message: 'Task updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const taskId = req.params.id;

  try {
    const existingRes = await pool.query('SELECT id FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/notes', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const taskId = req.params.id;

  try {
    const taskRes = await pool.query('SELECT id FROM tasks WHERE id = $1 AND userId = $2', [taskId, userId]);
    if (taskRes.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    const notesRes = await pool.query('SELECT * FROM notes WHERE taskId = $1 AND userId = $2 ORDER BY createdAt DESC', [taskId, userId]);
    const notes = notesRes.rows.map(r => ({
      id: r.id,
      content: r.content,
      createdAt: r.createdat,
      taskId: r.taskid,
      userId: r.userid
    }));
    res.json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
