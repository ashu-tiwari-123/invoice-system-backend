import { body, validationResult } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isStrongPassword().withMessage('Password must be strong'),
  body('name').notEmpty().withMessage('Name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export const validateChangePassword = [
  body('oldPassword').notEmpty().withMessage('Old password is required'),
  body('newPassword').isStrongPassword().withMessage('New password must be strong'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Valid email is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];

export const validateResetPassword = [
  body('password').isStrongPassword().withMessage('Password must be strong'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
    next();
  }
];
