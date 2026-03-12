import Volunteer from '../models/volunteer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateVolunteerId = () => {
  const prefix = 'VOL';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

export const registerVolunteer = async (req, res) => {
  try {
    const { name, age, email, phone, bloodGroup, address, occupation, interests, availability, hobby, maritalStatus, educationalQualification, nativeLocation, currentLocation, password, photo } = req.body;

    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({ message: 'Volunteer already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const volunteerId = generateVolunteerId();

    const volunteer = new Volunteer({
      volunteerId,
      photo,
      name,
      age,
      email,
      phone,
      bloodGroup,
      address,
      occupation,
      interests,
      availability,
      hobby,
      maritalStatus,
      educationalQualification,
      nativeLocation,
      currentLocation,
      password: hashedPassword,
    });

    await volunteer.save();

  const token = jwt.sign({ id: volunteer._id, role: 'volunteer' }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'Volunteer registered successfully', 
      token,
      user: {
        id: volunteer._id,
        volunteerId: volunteer.volunteerId,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const volunteer = await Volunteer.findOne({ email });
    if (!volunteer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, volunteer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: volunteer._id, role: 'volunteer' }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '1h' });

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: volunteer._id, 
        volunteerId: volunteer.volunteerId,
        name: volunteer.name, 
        email: volunteer.email,
        phone: volunteer.phone
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().select('-password');
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVolunteerProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.volunteer._id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVolunteerProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this endpoint
    delete updates.email; // Prevent email update through this endpoint

    // Check if phone is being updated and if it's already taken by another user
    if (updates.phone) {
      const existingVolunteer = await Volunteer.findOne({
        phone: updates.phone,
        _id: { $ne: req.volunteer._id }
      });
      if (existingVolunteer) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.volunteer._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.json(volunteer);
  } catch (error) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    res.status(500).json({ message: error.message });
  }
};

export const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
