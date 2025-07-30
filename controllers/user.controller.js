import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';
import { generateResetToken } from '../utils/generateToken.js';

// Helper to hash string
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// Register new user
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, name });

    logger.info(`User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Login user with lockout logic
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn(`Failed login attempt for unknown email: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      logger.warn(`Locked login attempt: ${email}`);
      return res.status(423).json({ error: 'Account locked due to multiple failed attempts. Try later.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
        logger.warn(`User locked out: ${email}`);
      }
      await user.save();
      logger.warn(`Failed login for: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Reset login attempts on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: '12h' }
    );

    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

// Get logged-in user's profile
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });
  } catch (err) {
    next(err);
  }
};

// Change password with old password check
export const changePassword = async (req, res, next) => {
  try {
    const user = req.user;
    const { oldPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Old password incorrect' });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.passwordChangedAt = new Date();
    await user.save();

    logger.info(`User password changed: ${user.email}`);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

// Forgot password - generate reset token
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(200).json({ message: 'If email exists, reset instructions sent' }); // Prevent email enumeration

    const token = generateResetToken();
    user.resetToken = hashToken(token);
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour expiry
    await user.save();

    // TODO: send reset token via email - for now just log it
    logger.info(`Password reset token for ${email}: ${token}`);

    res.json({ message: 'Password reset instructions sent to email' });
  } catch (err) {
    next(err);
  }
};

// Reset password using token
export const resetPassword = async (req, res, next) => {
  try {
    const resetTokenHash = hashToken(req.params.token);
    const user = await User.findOne({
      resetToken: resetTokenHash,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired password reset token' });

    const { password } = req.body;
    user.passwordHash = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.passwordChangedAt = new Date();

    await user.save();

    logger.info(`Password reset successful for user: ${user.email}`);
    res.json({ message: 'Password has been reset' });
  } catch (err) {
    next(err);
  }
};

// User activity endpoint (example)
export const getActivity = async (req, res, next) => {
  try {
    const user = req.user;
    res.json({
      lastLogin: user.lastLogin,
      loginAttempts: user.loginAttempts,
      lockUntil: user.lockUntil
    });
  } catch (err) {
    next(err);
  }
};
