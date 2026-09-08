import { Router, Response } from 'express';
import { getDb } from '../database/db';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

function computeProjectStatus(project: any) {
  if (project.cancelled) return 'cancelled';
  if (parseInt(project.totaltasks) > 0 && parseInt(project.totaltasks) === parseInt(project.completedtasks)) return 'completed';
  if (new Date(project.duedate) < new Date(new Date().toDateString())) return 'overdue';
  return 'active';
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const filter = req.query.filter as string || 'all';
  const sortOrder = req.query.sortOrder === 'desc' ? 'desc' : 'asc';

  try {
    const query = `
      SELECT p.*,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id) as totaltasks,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id AND status = 'completed') as completedtasks
      FROM projects p
      WHERE p.userId = $1
    `;

    const result = await pool.query(query, [userId]);
    const projects = result.rows;
    
    // Parse techStack back to array for each project, and compute derivedStatus
    let processed = projects.map(p => {
      const derivedStatus = computeProjectStatus(p);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        dueDate: p.duedate,
        cancelled: Boolean(p.cancelled),
        techStack: typeof p.techstack === 'string' ? JSON.parse(p.techstack) : p.techstack,
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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;

  try {
    const query = `
      SELECT p.*,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id) as totaltasks,
        (SELECT COUNT(*) FROM tasks WHERE projectId = p.id AND status = 'completed') as completedtasks
      FROM projects p
      WHERE p.id = $1 AND p.userId = $2
    `;

    const result = await pool.query(query, [req.params.id, userId]);
    const p = result.rows[0];

    if (!p) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      id: p.id,
      name: p.name,
      description: p.description,
      dueDate: p.duedate,
      cancelled: Boolean(p.cancelled),
      techStack: typeof p.techstack === 'string' ? JSON.parse(p.techstack) : p.techstack,
      derivedStatus: computeProjectStatus(p)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const { name, description, dueDate, cancelled, techStack } = req.body;

  if (!name || !description || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (techStack && !Array.isArray(techStack)) {
    return res.status(400).json({ error: 'techStack must be an array' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO projects (name, description, dueDate, cancelled, techStack, userId) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [
        name,
        description,
        dueDate,
        cancelled ? true : false,
        JSON.stringify(techStack || []),
        userId
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Project created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;
  const { name, description, dueDate, cancelled, techStack } = req.body;

  try {
    const existingRes = await pool.query('SELECT id FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await pool.query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description), dueDate = COALESCE($3, dueDate), cancelled = COALESCE($4, cancelled), techStack = COALESCE($5, techStack) WHERE id = $6 AND userId = $7',
      [
        name,
        description,
        dueDate,
        cancelled !== undefined ? (cancelled ? true : false) : null,
        techStack ? JSON.stringify(techStack) : null,
        projectId,
        userId
      ]
    );

    res.json({ message: 'Project updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;

  try {
    const existingRes = await pool.query('SELECT id FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);
    if (existingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Manual cleanup of files
    const attachmentsRes = await pool.query('SELECT filePath FROM attachments WHERE projectId = $1 AND userId = $2', [projectId, userId]);
    
    // Postgres with ON DELETE CASCADE will handle the database rows
    await pool.query('DELETE FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);

    // Delete actual files
    const fs = require('fs');
    // For supabase storage, we would ideally need a client instance, but since it's just cleanup and we might not have the client initialized here without importing it.
    // I'll import createClient if needed, or just let cron/cleanup handle it. Let's try to do it properly.
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
    const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

    for (const att of attachmentsRes.rows) {
      if (att.filepath.startsWith('supabase://') && supabase) {
        const pathInBucket = att.filepath.replace('supabase://', '');
        await supabase.storage.from('attachments').remove([pathInBucket]);
      } else if (!att.filepath.startsWith('supabase://') && fs.existsSync(att.filepath)) {
        fs.unlinkSync(att.filepath);
      }
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/attachments', async (req: AuthRequest, res: Response) => {
  const pool = getDb();
  const userId = req.user!.id;
  const projectId = req.params.id;

  try {
    const projectRes = await pool.query('SELECT id FROM projects WHERE id = $1 AND userId = $2', [projectId, userId]);
    if (projectRes.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found or unauthorized' });
    }

    const attachmentsRes = await pool.query('SELECT id, name, type, projectId FROM attachments WHERE projectId = $1 AND userId = $2', [projectId, userId]);
    
    const mapped = attachmentsRes.rows.map(att => ({
      id: att.id,
      name: att.name,
      type: att.type,
      projectId: att.projectid
    }));
    
    res.json(mapped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
