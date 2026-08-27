import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDb } from '../database/db';
import { authenticate, AuthRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Name, username, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const pool = getDb();
  
  try {
    const existingUser = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const recoveryKey = crypto.randomBytes(16).toString('hex');

    await pool.query(
      'INSERT INTO users (name, username, password, recoveryKey, isDemo) VALUES ($1, $2, $3, $4, false)',
      [name, username, hashedPassword, recoveryKey]
    );

    res.status(201).json({
      message: 'Account created successfully',
      recoveryKey,
      note: 'Please save this recovery key. If you lose your password and this key, your account cannot be recovered.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const pool = getDb();

  try {
    const userRes = await pool.query('SELECT id, password, isDemo FROM users WHERE username = $1', [username]);
    const user = userRes.rows[0];
    
    if (!user || user.isdemo) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/explore', async (req, res) => {
  const pool = getDb();

  try {
    const demoUserRes = await pool.query('SELECT id FROM users WHERE isDemo = true LIMIT 1');
    const demoUser = demoUserRes.rows[0];
    if (!demoUser) {
      return res.status(500).json({ error: 'Demo mode is not available' });
    }

    const token = jwt.sign({ userId: demoUser.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      message: 'Entered Explore Mode. You are using isolated demo data.' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', authenticate, (req, res) => {
  // Since we use JWT, logout is primarily handled client-side by deleting the token.
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', authenticate, (req: AuthRequest, res) => {
  res.json({
    id: req.user?.id,
    name: req.user?.name,
    username: req.user?.username,
    isDemo: req.user?.isDemo
  });
});

router.patch('/me', authenticate, async (req: AuthRequest, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required' });
  }

  const pool = getDb();
  try {
    await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name.trim(), req.user?.id]);
    res.json({ message: 'Profile updated successfully', name: name.trim() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/me', authenticate, async (req: AuthRequest, res) => {
  const pool = getDb();
  const userId = req.user?.id;
  try {
    // Delete related data manually since ON DELETE CASCADE is not set for userId in original sqlite? 
    // Wait, in postgres we DO have ON DELETE CASCADE for users(id). But let's do it manually just in case.
    await pool.query('DELETE FROM attachments WHERE userId = $1', [userId]);
    await pool.query('DELETE FROM notes WHERE userId = $1', [userId]);
    await pool.query('DELETE FROM tasks WHERE userId = $1', [userId]);
    await pool.query('DELETE FROM projects WHERE userId = $1', [userId]);
    
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { username, recoveryKey, newPassword } = req.body;
  
  if (!username || !recoveryKey || !newPassword) {
    return res.status(400).json({ error: 'Username, recovery key, and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const pool = getDb();
  
  try {
    const userRes = await pool.query('SELECT id, recoveryKey FROM users WHERE username = $1', [username]);
    const user = userRes.rows[0];
    
    if (!user || user.recoverykey !== recoveryKey) {
      return res.status(401).json({ error: 'Invalid username or recovery key' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
