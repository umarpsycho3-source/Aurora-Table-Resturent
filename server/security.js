import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from './storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret-change-me';

export const hashPassword = (password) => bcrypt.hash(password, 12);

export const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

export const createToken = (user) => jwt.sign(
  { id: user.id, role: user.role, email: user.email, name: user.name },
  JWT_SECRET,
  { expiresIn: '7d' }
);

export const authenticate = (req, res, next) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = authenticate.decode(header.slice(7));
    const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(payload.id);
    if (!user) return res.status(401).json({ error: 'User account not found.' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

authenticate.decode = (token) => jwt.verify(token, JWT_SECRET);

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required.' });
  next();
};
