import { Router, Response } from 'express';
import { getDb } from '../database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

function computeProjectStatus(project: any) {
  if (project.cancelled) return 'cancelled';
  if (project.totalTasks > 0 && project.totalTasks === project.completedTasks) return 'completed';
  if (new Date(project.dueDate) < new Date(new Date().toDateString())) return 'overdue';
  return 'active';
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const filter = req.query.filter as string || 'all';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  try {
    const query = `
      SELECT p.*,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id) as totalTasks,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id AND status = 'completed') as completedTasks
      FROM projects p
      WHERE p.userId = ?
    `;

    const projects = await db.all(query, [userId]);
    
    // Parse techStack back to array for each project, and compute derivedStatus
    let processed = projects.map(p => {
      const derivedStatus = computeProjectStatus(p);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        dueDate: p.dueDate,
        cancelled: Boolean(p.cancelled),
        techStack: JSON.parse(p.techStack),
        derivedStatus
      };
    });

    if (filter !== 'all') {
      processed = processed.filter(p => p.derivedStatus === filter);
    }

    processed.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    res.json(processed);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;

  try {
    const query = `
      SELECT p.*,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id) as totalTasks,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id AND status = 'completed') as completedTasks
      FROM projects p
      WHERE p.id = ? AND p.userId = ?
    `;

    const p = await db.get(query, [req.params.id, userId]);

    if (!p) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      id: p.id,
      name: p.name,
      description: p.description,
      dueDate: p.dueDate,
      cancelled: Boolean(p.cancelled),
      techStack: JSON.parse(p.techStack),
      derivedStatus: computeProjectStatus(p)
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const { name, description, dueDate, cancelled, techStack } = req.body;

  if (!name || !description || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (techStack && !Array.isArray(techStack)) {
    return res.status(400).json({ error: 'techStack must be an array' });
  }

  try {
    const result = await db.run(
      'INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) VALUES (?, ?, ?, ?, ?, ?)',
      [
        name,
        description,
        dueDate,
        cancelled ? 1 : 0,
        JSON.stringify(techStack || []),
        userId
      ]
    );

    res.status(201).json({ id: result.lastID, message: 'Project created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;
  const { name, description, dueDate, cancelled, techStack } = req.body;

  try {
    const existing = await db.get('SELECT id FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await db.run(
      'UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description), dueDate = COALESCE(?, dueDate), cancelled = COALESCE(?, cancelled), techStack = COALESCE(?, techStack) WHERE id = ? AND userId = ?',
      [
        name,
        description,
        dueDate,
        cancelled !== undefined ? (cancelled ? 1 : 0) : undefined,
        techStack ? JSON.stringify(techStack) : undefined,
        projectId,
        userId
      ]
    );

    res.json({ message: 'Project updated' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;

  try {
    const existing = await db.get('SELECT id FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);
    if (!existing) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Since we delete the project, we should manually clean up attachments files from the filesystem before deleting from DB
    const attachments = await db.all('SELECT filePath FROM attachments WHERE projectId = ? AND userId = ?', [projectId, userId]);
    
    // SQLite with PRAGMA foreign_keys = ON handles cascading delete if configured
    await db.run('DELETE FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);

    // Delete actual files
    const fs = require('fs');
    attachments.forEach(att => {
      if (fs.existsSync(att.filePath)) {
        fs.unlinkSync(att.filePath);
      }
    });

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/attachments', async (req: AuthRequest, res: Response) => {
  const db = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;

  try {
    const project = await db.get('SELECT id FROM projects WHERE id = ? AND userId = ?', [projectId, userId]);
    if (!project) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    const attachments = await db.all('SELECT id, name, type, projectId FROM attachments WHERE projectId = ? AND userId = ?', [projectId, userId]);
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
