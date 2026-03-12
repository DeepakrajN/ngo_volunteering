import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  members: [{
    volunteerId: {
      type: String,
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  meetings: [{
    title: String,
    date: Date,
    location: String,
    agenda: String,
    attendees: [String],
  }],
  activities: [{
    title: String,
    description: String,
    date: Date,
    status: String,
  }],
  requirements: [{
    title: String,
    description: String,
    priority: String,
  }],
}, {
  timestamps: true,
});

const Club = mongoose.model('Club', clubSchema);

export default Club;
