const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'ME', 'Civil', 'MBA', 'Other'],
      required: [true, 'Branch is required'],
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      required: [true, 'Year is required'],
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
      required: [true, 'Semester is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image', 'other'],
      default: 'other',
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
