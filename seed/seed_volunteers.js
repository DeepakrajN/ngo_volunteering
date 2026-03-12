import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Volunteer from '../models/volunteer.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not set in .env');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB for seeding');

    const existing = await Volunteer.countDocuments();
    if (existing > 0) {
      console.log(`Database already has ${existing} volunteers. Skipping seed.`);
      process.exit(0);
    }

    const password = await bcrypt.hash('Testpass123', 10);

    const docs = [
      {
        name: 'Alice Doe',
        age: 28,
        email: 'alice@example.com',
        phone: '1111111111',
        bloodGroup: 'A+',
        address: '1 Main St',
        occupation: 'Teacher',
        interests: ['teaching', 'community'],
        availability: 'weekdays',
        hobby: 'reading',
        maritalStatus: 'single',
        educationalQualification: "Bachelor's",
        nativeLocation: 'CityA',
        currentLocation: 'CityA',
        password,
      },
      {
        name: 'Bob Smith',
        age: 35,
        email: 'bob@example.com',
        phone: '2222222222',
        bloodGroup: 'O+',
        address: '2 Main St',
        occupation: 'Engineer',
        interests: ['logistics', 'fundraising'],
        availability: 'weekends',
        hobby: 'hiking',
        maritalStatus: 'married',
        educationalQualification: "Master's",
        nativeLocation: 'CityB',
        currentLocation: 'CityB',
        password,
      },
    ];

    await Volunteer.insertMany(docs);
    console.log('Seeded volunteers successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
