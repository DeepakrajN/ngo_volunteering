import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Volunteer from '../models/Volunteer.js';
import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo-volunteer';
    await mongoose.connect(mongoUri);

    // Clear existing data
    await Admin.deleteMany();
    await Volunteer.deleteMany();
    await Event.deleteMany();
    await Announcement.deleteMany();

    // Create admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      username: 'admin',
      password: hashedPassword,
    });
    await admin.save();

    // Create sample volunteers
    const volunteers = [
      {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        phone: '9488868329',
        bloodGroup: 'O+',
        address: '123 Main St',
        occupation: 'Engineer',
        interests: ['Environment', 'Education'],
        availability: 'Weekends',
        hobby: 'Reading',
        maritalStatus: 'Single',
        educationalQualification: 'Bachelor\'s Degree',
        nativeLocation: 'City A',
        currentLocation: 'City B',
        password: await bcrypt.hash('password123', 10),
      },
      {
        name: 'Jane Smith',
        age: 30,
        email: 'jane@example.com',
        phone: '9488868329',
        bloodGroup: 'A+',
        address: '456 Elm St',
        occupation: 'Teacher',
        interests: ['Children', 'Health'],
        availability: 'Evenings',
        hobby: 'Painting',
        maritalStatus: 'Married',
        educationalQualification: 'Master\'s Degree',
        nativeLocation: 'City C',
        currentLocation: 'City D',
        password: await bcrypt.hash('password123', 10),
      },
    ];

    await Volunteer.insertMany(volunteers);

    // Create sample events
    const events = [
      {
        title: 'Community Clean-up',
        description: 'Join us for a community clean-up event.',
        date: new Date('2023-12-01'),
        location: 'Central Park',
        Headedby: 'John Doe',
        createdBy: admin._id,
      },
      {
        title: 'Blood Donation Camp',
        description: 'Donate blood and save lives.',
        date: new Date('2023-12-15'),
        location: 'City Hospital',
        Headedby: 'Jane Smith',
        createdBy: admin._id,
      },
    ];

    await Event.insertMany(events);

    // Create sample announcements
    const announcements = [
      {
        title: 'New Volunteer Program',
        content: 'We are launching a new volunteer program. Sign up now!',
        createdBy: admin._id,
      },
      {
        title: 'Holiday Schedule',
        content: 'Our office will be closed for holidays from Dec 25-31.',
        createdBy: admin._id,
      },
    ];

    await Announcement.insertMany(announcements);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
