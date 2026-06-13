const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  toggleRSVP,
  getAttendees,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');

router.get('/', getEvents);

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Event title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category')
      .isIn(['technical', 'cultural', 'sports', 'workshop', 'seminar', 'other'])
      .withMessage('Invalid category'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('venue').trim().notEmpty().withMessage('Venue is required'),
    body('organizer').trim().notEmpty().withMessage('Organizer is required'),
  ],
  createEvent
);

router.get('/:id', getEvent);
router.put('/:id', protect, adminOnly, upload.single('image'), updateEvent);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.post('/:id/rsvp', protect, toggleRSVP);
router.get('/:id/attendees', protect, adminOnly, getAttendees);

module.exports = router;
