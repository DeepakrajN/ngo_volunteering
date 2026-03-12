import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Club from './models/Club.js';

dotenv.config();

const sampleClubs = [
  {
    name: 'Environmental Club',
    description: 'Dedicated to environmental conservation, tree planting, and sustainability initiatives. Join us in making our planet greener!',
    category: 'Environment',
    members: [],
    meetings: [
      {
        title: 'Monthly Planning Meeting',
        date: new Date('2024-02-15'),
        location: 'Community Center Room 101',
        agenda: 'Discuss upcoming tree planting drive and waste management campaign',
      }
    ],
    activities: [
      {
        title: 'Beach Cleanup Drive',
        description: 'Cleaned 5km of coastline, collected 200kg of waste',
        date: new Date('2024-01-20'),
        status: 'Completed',
      },
      {
        title: 'Tree Planting Campaign',
        description: 'Plant 500 trees in local parks',
        date: new Date('2024-02-25'),
        status: 'Planned',
      }
    ],
    requirements: [
      {
        title: 'Gardening Tools',
        description: 'Need shovels, rakes, and watering cans for tree planting',
        priority: 'High',
      },
      {
        title: 'Volunteers for Weekend Drive',
        description: 'Looking for 20 volunteers for Saturday cleanup',
        priority: 'Medium',
      }
    ],
  },
  {
    name: 'Education Club',
    description: 'Focused on providing quality education through tutoring, literacy campaigns, and after-school programs for underprivileged children.',
    category: 'Education',
    members: [],
    meetings: [
      {
        title: 'Curriculum Planning Session',
        date: new Date('2024-02-10'),
        location: 'Library Conference Room',
        agenda: 'Plan syllabus for upcoming tutoring sessions',
      }
    ],
    activities: [
      {
        title: 'Free Tutoring Program',
        description: 'Providing math and science tutoring to 50 students',
        date: new Date('2024-01-15'),
        status: 'In Progress',
      },
      {
        title: 'Book Donation Drive',
        description: 'Collected 500 books for rural schools',
        date: new Date('2024-01-05'),
        status: 'Completed',
      }
    ],
    requirements: [
      {
        title: 'Study Materials',
        description: 'Need textbooks and notebooks for students',
        priority: 'High',
      },
      {
        title: 'Volunteer Teachers',
        description: 'Looking for volunteers with teaching experience',
        priority: 'High',
      }
    ],
  },
  {
    name: 'Health & Wellness Club',
    description: 'Organizing health camps, awareness programs, first-aid training, and promoting healthy living in communities.',
    category: 'Health',
    members: [],
    meetings: [
      {
        title: 'Health Camp Coordination',
        date: new Date('2024-02-18'),
        location: 'Medical Center Hall',
        agenda: 'Coordinate with doctors for upcoming free health camp',
      }
    ],
    activities: [
      {
        title: 'Free Health Checkup Camp',
        description: 'Provided free checkups to 200 people',
        date: new Date('2024-01-25'),
        status: 'Completed',
      },
      {
        title: 'First Aid Training Workshop',
        description: 'Training session for 30 volunteers',
        date: new Date('2024-02-20'),
        status: 'Planned',
      }
    ],
    requirements: [
      {
        title: 'Medical Supplies',
        description: 'Need basic medical supplies for health camps',
        priority: 'High',
      },
      {
        title: 'Volunteer Doctors',
        description: 'Looking for doctors to volunteer for health camps',
        priority: 'Medium',
      }
    ],
  },
];

async function seedClubs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ngo-volunteer');
    console.log('Connected to MongoDB');

    await Club.deleteMany({});
    console.log('Cleared existing clubs');

    await Club.insertMany(sampleClubs);
    console.log('Sample clubs seeded successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding clubs:', error);
    process.exit(1);
  }
}

seedClubs();
