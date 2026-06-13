/**
 * Seed script — creates an admin user and sample data
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Event = require('./models/Event');
const LostItem = require('./models/LostItem');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await LostItem.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@college.edu.in',
      password: '@Rihant9889',
      role: 'admin',
      branch: 'CSE',
      year: 4,
    });

    // Create student user
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@newhorizon.edu.in',
      password: 'Student@123',
      role: 'student',
      branch: 'CSE',
      year: 2,
    });

    // Create sample events
    await Event.create([
      {
        title: 'National Hackathon 2025',
        description: 'Annual 24-hour hackathon for all branches. Build innovative solutions to real-world problems.',
        category: 'technical',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '09:00 AM',
        venue: 'Main Auditorium, Block A',
        organizer: 'CSE Department',
        createdBy: admin._id,
      },
      {
        title: 'Annual Cultural Fest — Horizon 2025',
        description: 'Three-day cultural extravaganza featuring music, dance, drama, and art competitions.',
        category: 'cultural',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        venue: 'College Ground',
        organizer: 'Student Council',
        createdBy: admin._id,
      },
      {
        title: 'DBMS Workshop — Advanced SQL & NoSQL',
        description: 'Hands-on workshop covering advanced database concepts, indexing, and query optimization.',
        category: 'workshop',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        time: '02:00 PM',
        venue: 'Computer Lab 3, Block B',
        organizer: 'Dr. Priya Mehta',
        createdBy: admin._id,
      },
    ]);

    // Create sample lost/found items
    await LostItem.create([
      {
        title: 'Blue HP Laptop',
        description: 'HP Pavilion 15 blue color, has a sticker of "No War" on the lid. Lost near the canteen.',
        category: 'electronics',
        type: 'lost',
        location: 'Canteen Area',
        postedBy: student._id,
      },
      {
        title: 'College ID Card',
        description: 'Found a college ID card near the library. Name on card: Priya Joshi, ECE 3rd year.',
        category: 'id-card',
        type: 'found',
        location: 'Library Entrance',
        postedBy: student._id,
      },
    ]);

    console.log('🌱 Seed data created successfully!');
    console.log('Admin: admin@college.edu.in / @Rihant9889');
    console.log('Student: rahul@newhorizon.edu.in / Student@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
