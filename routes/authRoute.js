import express from 'express';

import {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  getActivity
} from '../controllers/user.controller.js';

import auth from '../middlewares/auth.js';
import {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword
} from '../middlewares/validateUser.js';

import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for sensitive routes
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });

// Registration
router.post('/register', validateRegister, registerUser);

// Login
router.post('/login', limiter, validateLogin, loginUser);

// Protected routes
router.get('/me', auth(), getProfile);
router.patch('/password', auth(), validateChangePassword, changePassword);
router.get('/activity', auth(), getActivity);

// Password reset
router.post('/forgot', limiter, validateForgotPassword, forgotPassword);
router.post('/reset/:token', validateResetPassword, resetPassword);

export default router;
