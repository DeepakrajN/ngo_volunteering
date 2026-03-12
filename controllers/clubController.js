import Club from '../models/Club.js';

export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const joinClub = async (req, res) => {
  try {
    const { clubId, volunteerId, name, email, phone } = req.body;
    const club = await Club.findById(clubId);
    
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    const alreadyMember = club.members.some(m => m.volunteerId === volunteerId);
    if (alreadyMember) {
      return res.status(400).json({ message: 'Already a member of this club' });
    }

    club.members.push({ volunteerId, name, email, phone });
    await club.save();
    
    res.json({ message: 'Successfully joined the club', club });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyClubs = async (req, res) => {
  try {
    const { volunteerId } = req.query;
    const clubs = await Club.find();
    
    const joinedClubs = clubs.filter(club => 
      club.members.some(m => m.volunteerId === volunteerId)
    );
    
    const notJoinedClubs = clubs.filter(club => 
      !club.members.some(m => m.volunteerId === volunteerId)
    );
    
    res.json({ joinedClubs, notJoinedClubs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createClub = async (req, res) => {
  try {
    console.log('Received club data:', req.body);
    const { name, description, category, image } = req.body;
    
    if (!name || !description || !category) {
      return res.status(400).json({ message: 'Name, description, and category are required' });
    }
    
    const club = new Club({ name, description, category, image, members: [], meetings: [], activities: [], requirements: [] });
    await club.save();
    console.log('Club created successfully:', club);
    res.status(201).json(club);
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({ message: error.message || 'Something went wrong!' });
  }
};

export const updateClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteClub = async (req, res) => {
  try {
    const club = await Club.findByIdAndDelete(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json({ message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
