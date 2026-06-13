const { validationResult } = require('express-validator');
const StudyMaterial = require('../models/StudyMaterial');

// @desc    Get all materials
// @route   GET /api/materials
// @access  Public
const getMaterials = async (req, res) => {
  try {
    const { branch, year, subject, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (branch) query.branch = branch;
    if (year) query.year = parseInt(year);
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await StudyMaterial.countDocuments(query);
    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name avatar branch year')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        materials,
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

// @desc    Upload study material
// @route   POST /api/materials
// @access  Protected
const uploadMaterial = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File is required' });
    }

    const { title, description, subject, branch, year, semester } = req.body;
    const fileUrl = req.file.path;
    const mimeType = req.file.mimetype;
    const fileType = mimeType === 'application/pdf' ? 'pdf' : mimeType.startsWith('image/') ? 'image' : 'other';

    const material = await StudyMaterial.create({
      title,
      description,
      subject,
      branch,
      year: parseInt(year),
      semester: parseInt(semester),
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
    });

    await material.populate('uploadedBy', 'name avatar branch year');

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      data: { material },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single material
// @route   GET /api/materials/:id
// @access  Public
const getMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id).populate(
      'uploadedBy',
      'name avatar branch year'
    );
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    res.json({ success: true, data: { material } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Increment download count and return file URL
// @route   POST /api/materials/:id/download
// @access  Protected
const downloadMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    res.json({
      success: true,
      message: 'Download initiated',
      data: { fileUrl: material.fileUrl, downloads: material.downloads },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Protected (uploader or admin)
const deleteMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id);
    if (!material) return res.status(404).json({ success: false, message: 'Material not found' });

    const isOwner = material.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await material.deleteOne();
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMaterials, uploadMaterial, getMaterial, downloadMaterial, deleteMaterial };
