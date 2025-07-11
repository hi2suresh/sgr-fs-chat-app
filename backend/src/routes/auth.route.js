import express from 'express';
const authRouter = express.Router();
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
// Define routes for authentication
// POST /api/auth/signup - User registration
authRouter.post('/signup', signup);
// POST /api/auth/login - User login
authRouter.post('/login', login);
// POST /api/auth/logout - User logout
authRouter.post('/logout', logout);
// PUT /api/auth/update-profile - Update user profile
authRouter.put('/update-profile', protectRoute, updateProfile);

authRouter.get('/check', protectRoute, checkAuth);
export default authRouter;
