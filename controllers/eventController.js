import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'username');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, Headedby, image } = req.body;

    const event = new Event({
      title,
      description,
      date,
      location,
      Headedby,
      image,
      createdBy: req.admin._id,
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, location, Headedby, image } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, location, Headedby, image },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const { eventId, volunteerId, name, email, phone } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const alreadyRegistered = event.registeredVolunteers.some(v => v.volunteerId === volunteerId);
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    event.registeredVolunteers.push({ volunteerId, name, email, phone });
    await event.save();

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { eventId, volunteerId, status } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const volunteer = event.registeredVolunteers.find(v => v.volunteerId === volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not registered for this event' });
    }

    const existingAttendance = event.attendance.findIndex(a => a.volunteerId === volunteerId);
    if (existingAttendance >= 0) {
      event.attendance[existingAttendance].status = status;
      event.attendance[existingAttendance].markedAt = new Date();
    } else {
      event.attendance.push({
        volunteerId,
        name: volunteer.name,
        status,
        markedAt: new Date(),
      });
    }

    await event.save();
    res.json({ message: 'Attendance marked successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventAttendance = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ registeredVolunteers: event.registeredVolunteers, attendance: event.attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkInToEvent = async (req, res) => {
  try {
    const { eventId, volunteerId, location, photos, deviceInfo } = req.body;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const volunteer = event.registeredVolunteers.find(v => v.volunteerId === volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Not registered for this event' });
    }

    const existingCheckIn = event.attendance.find(a => a.volunteerId === volunteerId);
    if (existingCheckIn) {
      return res.status(400).json({ message: 'Already checked in' });
    }

    event.attendance.push({
      volunteerId,
      name: volunteer.name,
      status: 'present',
      markedAt: new Date(),
      checkInData: {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          timestamp: new Date(),
        },
        photos: photos || [],
        deviceInfo: deviceInfo || 'Unknown',
        ipAddress: req.ip || req.connection.remoteAddress,
      },
    });

    await event.save();

    // Auto-generate certificate
    try {
      const Certificate = (await import('../models/Certificate.js')).default;
      const existingCert = await Certificate.findOne({ eventId, volunteerId });
      console.log('Existing certificate check:', existingCert);
      
      if (!existingCert) {
        const certificateId = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
        const newCert = await Certificate.create({
          certificateId,
          volunteerId,
          volunteerName: volunteer.name,
          eventId,
          eventTitle: event.title,
          eventDate: event.date,
          eventOrganizer: event.Headedby,
          hoursContributed: 4,
          status: 'pending',
        });
        console.log('✅ Certificate created successfully:', newCert);
      } else {
        console.log('Certificate already exists for this volunteer and event');
      }
    } catch (certError) {
      console.error('❌ Error creating certificate:', certError);
    }

    res.json({ message: 'Check-in successful! Certificate generated and pending admin verification.', attendance: event.attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
