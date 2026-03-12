import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== Import Routes =====
const volunteerRoutes = await import('../routes/volunteers.js').then(m => m.default);
const adminRoutes = await import('../routes/admin.js').then(m => m.default);
const eventRoutes = await import('../routes/events.js').then(m => m.default);
const announcementRoutes = await import('../routes/announcements.js').then(m => m.default);
const contactRoutes = await import('../routes/contact.js').then(m => m.default);
const galleryRoutes = await import('../routes/gallery.js').then(m => m.default);
const clubRoutes = await import('../routes/clubs.js').then(m => m.default);
const certificateRoutes = await import('../routes/certificates.js').then(m => m.default);

// ===== API Routes =====
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/certificates', certificateRoutes);

// ===== Serve React Build =====
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  
  // SPA fallback
  app.get('/', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.json({ message: 'Helping Hands - NGO Volunteer Platform API' });
    }
  });
}

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== MongoDB Connection =====
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set, skipping database connection');
      return;
    }
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 5,
        minPoolSize: 1,
      });
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

connectDB().catch(console.error);

// ===== Error Handling =====
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// ===== Export for Vercel =====
export default app;
