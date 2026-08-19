import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { getDb } from '../database';
import { authenticate, AuthRequest, JWT_SECRET } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
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
      'INSERT INTO users (username, password, recoveryKey, isDemo) VALUES (?, ?, ?, 0)',
      [username, hashedPassword, recoveryKey]
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
    username: req.user?.username,
    isDemo: req.user?.isDemo
  });
});

export default router;
