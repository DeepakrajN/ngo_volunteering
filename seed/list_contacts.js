import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Contact from '../models/contact.js';

dotenv.config();

async function list() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const docs = await Contact.find().lean();
    console.log('Contacts:', docs);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

list();
