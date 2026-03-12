import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    unique: true,
    required: true,
  },
  volunteerId: {
    type: String,
    required: true,
  },
  volunteerName: {
    type: String,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventTitle: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventOrganizer: {
    type: String,
  },
  hoursContributed: {
    type: Number,
    default: 0,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
  verifiedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

const Certificate = mongoose.model('Certificate', certificateSchema);

export default Certificate;
