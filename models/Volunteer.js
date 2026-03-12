import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  volunteerId: {
    type: String,
    unique: true,
    required: true,
  },
  photo: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  bloodGroup: {
    type: String,
  },
  address: {
    type: String,
  },
  occupation: {
    type: String,
  },
  interests: {
    type: [String],
  },
  availability: {
    type: String,
  },
  hobby: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  educationalQualification: {
    type: String,
  },
  nativeLocation: {
    type: String,
  },
  currentLocation: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
