import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  Headedby:
  {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  registeredVolunteers: [{
    volunteerId: {
      type: String,
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  attendance: [{
    volunteerId: String,
    name: String,
    status: {
      type: String,
      enum: ['present', 'absent'],
      default: 'absent',
    },
    markedAt: Date,
    checkInData: {
      location: {
        latitude: Number,
        longitude: Number,
        accuracy: Number,
        timestamp: Date,
      },
      photos: [String],
      deviceInfo: String,
      ipAddress: String,
    },
  }],
}, {
  timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
