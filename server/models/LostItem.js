const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ['electronics', 'stationery', 'clothing', 'id-card', 'other'],
      required: [true, 'Category is required'],
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Type (lost/found) is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    contact: {
      phone: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['open', 'claimed', 'resolved'],
      default: 'open',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostItem', lostItemSchema);
