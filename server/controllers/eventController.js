const { validationResult } = require('express-validator');
const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, upcoming, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (upcoming === 'true') query.date = { $gte: new Date() };
    else if (upcoming === 'false') query.date = { $lt: new Date() };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .populate('createdBy', 'name avatar')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Admin only
const createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { title, description, category, date, time, venue, organizer, registrationLink } = req.body;
    const image = req.file ? req.file.path : '';

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      venue,
      organizer,
      registrationLink,
      image,
      createdBy: req.user._id,
    });

    await event.populate('createdBy', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name avatar')
      .populate('rsvpList', 'name avatar branch year');

    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, data: { event, rsvpCount: event.rsvpList.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit event
// @route   PUT /api/events/:id
// @access  Admin only
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const updates = req.body;
    if (req.file) updates.image = req.file.path;

    const updated = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name avatar');

    res.json({ success: true, message: 'Event updated', data: { event: updated } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin only
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle RSVP
// @route   POST /api/events/:id/rsvp
// @access  Protected
const toggleRSVP = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const userId = req.user._id.toString();
    const alreadyRSVPed = event.rsvpList.some((id) => id.toString() === userId);

    if (alreadyRSVPed) {
      event.rsvpList = event.rsvpList.filter((id) => id.toString() !== userId);
    } else {
      event.rsvpList.push(req.user._id);
    }

    await event.save();

    res.json({
      success: true,
      message: alreadyRSVPed ? 'RSVP removed' : 'RSVP confirmed',
      data: { rsvpCount: event.rsvpList.length, isRSVPed: !alreadyRSVPed },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendees list
// @route   GET /api/events/:id/attendees
// @access  Admin only
const getAttendees = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('rsvpList', 'name email avatar branch year');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    res.json({ success: true, data: { attendees: event.rsvpList, count: event.rsvpList.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getEvents, createEvent, getEvent, updateEvent, deleteEvent, toggleRSVP, getAttendees };
