import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ error: 'Unauthorized - no token provided' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    console.log(`process.env.JWT_SECRET: ${process.env.JWT_SECRET}`);
    if (!decoded || !decoded.userid) {
      return res.status(401).json({ error: 'Unauthorized - invalid token' });
    }
    const user = await User.findById(decoded.userid).select('-password -__v');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - user not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ error: 'internal server error' });
  }
};
