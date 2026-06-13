const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getMaterials,
  uploadMaterial,
  getMaterial,
  downloadMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getMaterials);

router.post(
  '/',
  protect,
  upload.single('file'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('branch')
      .isIn(['CSE', 'ECE', 'ME', 'Civil', 'MBA', 'Other'])
      .withMessage('Invalid branch'),
    body('year').isInt({ min: 1, max: 4 }).withMessage('Year must be 1-4'),
    body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be 1-8'),
  ],
  uploadMaterial
);

router.get('/:id', getMaterial);
router.post('/:id/download', protect, downloadMaterial);
router.delete('/:id', protect, deleteMaterial);

module.exports = router;
