const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('branch').notEmpty().withMessage('Branch is required'),
    body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be between 1 and 4'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;
