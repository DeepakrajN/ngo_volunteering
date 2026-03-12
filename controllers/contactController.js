import Contact from '../models/contact.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }
    const doc = await Contact.create({ name, email, phone, message });
    res.status(201).json({ message: 'Contact submitted', id: doc._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
