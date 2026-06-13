const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'other'],
      required: [true, 'Category is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    registrationLink: {
      type: String,
      default: '',
    },
    rsvpList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
