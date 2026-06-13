const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getItems,
  createItem,
  getItem,
  claimItem,
  resolveItem,
  deleteItem,
} = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getItems);

router.post(
  '/',
  protect,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['electronics', 'stationery', 'clothing', 'id-card', 'other'])
      .withMessage('Invalid category'),
    body('type').isIn(['lost', 'found']).withMessage('Type must be lost or found'),
    body('location').trim().notEmpty().withMessage('Location is required'),
  ],
  createItem
);

router.get('/:id', getItem);
router.put('/:id/claim', protect, claimItem);
router.put('/:id/resolve', protect, resolveItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
