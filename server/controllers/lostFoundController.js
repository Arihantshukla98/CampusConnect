const { validationResult } = require('express-validator');
const LostItem = require('../models/LostItem');

// @desc    Get all lost/found items
// @route   GET /api/lostfound
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, category, status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await LostItem.countDocuments(query);
    const items = await LostItem.find(query)
      .populate('postedBy', 'name avatar branch year')
      .populate('claimedBy', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        items,
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

// @desc    Create lost/found item
// @route   POST /api/lostfound
// @access  Protected
const createItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    const { title, description, category, type, location } = req.body;
    const image = req.file ? req.file.path : '';

    const item = await LostItem.create({
      title,
      description,
      category,
      type,
      location,
      image,
      postedBy: req.user._id,
    });

    await item.populate('postedBy', 'name avatar branch year');

    res.status(201).json({
      success: true,
      message: 'Item posted successfully',
      data: { item },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single item
// @route   GET /api/lostfound/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id)
      .populate('postedBy', 'name avatar branch year email')
      .populate('claimedBy', 'name avatar');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, data: { item } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Claim an item
// @route   PUT /api/lostfound/:id/claim
// @access  Protected
const claimItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot claim your own item' });
    }

    if (item.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Item is no longer available' });
    }

    item.status = 'claimed';
    item.claimedBy = req.user._id;
    await item.save();

    await item.populate('postedBy', 'name avatar');
    await item.populate('claimedBy', 'name avatar');

    res.json({ success: true, message: 'Item claimed successfully', data: { item } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve an item
// @route   PUT /api/lostfound/:id/resolve
// @access  Protected (poster or admin)
const resolveItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    item.status = 'resolved';
    await item.save();

    res.json({ success: true, message: 'Item marked as resolved', data: { item } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/lostfound/:id
// @access  Protected (poster or admin)
const deleteItem = async (req, res) => {
  try {
    const item = await LostItem.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const isOwner = item.postedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getItems, createItem, getItem, claimItem, resolveItem, deleteItem };
