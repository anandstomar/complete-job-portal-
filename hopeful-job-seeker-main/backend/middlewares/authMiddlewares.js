import jwt from 'jsonwebtoken';
import User from '../models/authSchema.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JobPortalUsers");
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Aliases for compatibility with testRoutes
export const requireAuth = authenticateUser;
export const requireAdmin = [authenticateUser, isAdmin];