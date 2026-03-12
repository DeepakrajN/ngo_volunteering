import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Load routes dynamically
async function setupRoutes() {
  try {
    const volunteerRoutes = (await import('../routes/volunteers.js')).default;
    const adminRoutes = (await import('../routes/admin.js')).default;
    const eventRoutes = (await import('../routes/events.js')).default;
    const announcementRoutes = (await import('../routes/announcements.js')).default;
    const contactRoutes = (await import('../routes/contact.js')).default;
    const galleryRoutes = (await import('../routes/gallery.js')).default;
    const clubRoutes = (await import('../routes/clubs.js')).default;
    const certificateRoutes = (await import('../routes/certificates.js')).default;

    app.use('/api/volunteers', volunteerRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/announcements', announcementRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/gallery', galleryRoutes);
    app.use('/api/clubs', clubRoutes);
    app.use('/api/certificates', certificateRoutes);

    console.log('✅ All routes loaded successfully');
  } catch (error) {
    console.error('⚠️ Error loading routes:', error.message);
  }
}

// Serve React build
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

// SPA fallback - serve index.html for all non-API routes
app.get(['/', '/volunteer*', '/admin*', '/event*', '/club*', '/certificate*', '/gallery*', '/announcements*'], (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ 
      message: 'Helping Hands - NGO Volunteer Platform',
      api: '/api/*',
      status: 'running'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// Setup routes on startup
setupRoutes().catch(err => {
  console.error('Failed to setup routes:', err.message);
});

export default app;
