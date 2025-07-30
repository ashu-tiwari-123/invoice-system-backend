import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/user.model.js';

const auth = (allowedRoles = []) => async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ error: 'Authentication required' });

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(401).json({ error: 'User not found' });

    // Check token invalidation on password change
    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ error: 'Session expired. Please login again.' });
    }

    // Check role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
    }

    req.user = user; // Attach user to req
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default auth;
