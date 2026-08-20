import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDb } from '../database';
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

  const db = getDb();
  
  try {
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const recoveryKey = crypto.randomBytes(16).toString('hex');

    const result = await db.run(
      'INSERT INTO users (name, username, password, recoveryKey, isDemo) VALUES (?, ?, ?, ?, 0)',
      [name, username, hashedPassword, recoveryKey]
    );

    res.status(201).json({
      message: 'Account created successfully',
      recoveryKey,
      note: 'Please save this recovery key. If you lose your password and this key, your account cannot be recovered.'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = getDb();

  try {
    const user = await db.get('SELECT id, password, isDemo FROM users WHERE username = ?', [username]);
    
    if (!user || user.isDemo) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/explore', async (req, res) => {
  const db = getDb();

  try {
    const demoUser = await db.get('SELECT id FROM users WHERE isDemo = 1 LIMIT 1');
    if (!demoUser) {
      return res.status(500).json({ error: 'Demo mode is not available' });
    }

    const token = jwt.sign({ userId: demoUser.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      message: 'Entered Explore Mode. You are using isolated demo data.' 
    });
  } catch (error) {
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

  const db = getDb();
  try {
    await db.run('UPDATE users SET name = ? WHERE id = ?', [name.trim(), req.user?.id]);
    res.json({ message: 'Profile updated successfully', name: name.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/me', authenticate, async (req: AuthRequest, res) => {
  const db = getDb();
  const userId = req.user?.id;
  try {
    // Delete related data manually since ON DELETE CASCADE is not set for userId
    await db.run('DELETE FROM attachments WHERE userId = ?', [userId]);
    await db.run('DELETE FROM notes WHERE userId = ?', [userId]);
    await db.run('DELETE FROM tasks WHERE userId = ?', [userId]);
    await db.run('DELETE FROM projects WHERE userId = ?', [userId]);
    
    await db.run('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
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

  const db = getDb();
  
  try {
    const user = await db.get('SELECT id, recoveryKey FROM users WHERE username = ?', [username]);
    
    if (!user || user.recoveryKey !== recoveryKey) {
      return res.status(401).json({ error: 'Invalid username or recovery key' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
