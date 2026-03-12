import Certificate from '../models/Certificate.js';
import Event from '../models/Event.js';

export const generateCertificate = async (req, res) => {
  try {
    const { eventId, volunteerId, volunteerName, hoursContributed } = req.body;
    
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendance = event.attendance.find(a => a.volunteerId === volunteerId && a.status === 'present');
    if (!attendance) {
      return res.status(400).json({ message: 'Volunteer did not attend this event' });
    }

    const existingCert = await Certificate.findOne({ eventId, volunteerId });
    if (existingCert) {
      return res.status(400).json({ message: 'Certificate request already exists' });
    }

    const certificateId = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    const certificate = new Certificate({
      certificateId,
      volunteerId,
      volunteerName,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      hoursContributed: hoursContributed || 0,
      status: 'pending',
    });

    await certificate.save();
    res.status(201).json({ message: 'Certificate request submitted for admin verification', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCertificatesByVolunteer = async (req, res) => {
  try {
    const certificates = await Certificate.find({ volunteerId: req.params.volunteerId, status: 'verified' }).populate('eventId');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCertificatesByVolunteer = async (req, res) => {
  try {
    const certificates = await Certificate.find({ volunteerId: req.params.volunteerId }).populate('eventId');
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.certificateId }).populate('eventId');
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingCertificates = async (req, res) => {
  try {
    console.log('📋 Fetching pending certificates...');
    const certificates = await Certificate.find({ status: 'pending' });
    console.log(`Found ${certificates.length} pending certificates:`, certificates);
    res.json(certificates);
  } catch (error) {
    console.error('❌ Error fetching pending certificates:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'verified',
        verifiedBy: req.admin._id,
        verifiedAt: new Date(),
      },
      { new: true }
    );
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate verified successfully', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }
    res.json({ message: 'Certificate rejected', certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
