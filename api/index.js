import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== Health Check =====
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ===== API Routes - Lazy Load =====
app.use('/api/volunteers', async (req, res, next) => {
  try {
    const routes = await import('../routes/volunteers.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading volunteers route:', error);
    res.status(500).json({ error: 'Failed to load volunteers' });
  }
});

app.use('/api/events', async (req, res, next) => {
  try {
    const routes = await import('../routes/events.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading events route:', error);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

app.use('/api/admin', async (req, res, next) => {
  try {
    const routes = await import('../routes/admin.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading admin route:', error);
    res.status(500).json({ error: 'Failed to load admin' });
  }
});

app.use('/api/announcements', async (req, res, next) => {
  try {
    const routes = await import('../routes/announcements.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading announcements route:', error);
    res.status(500).json({ error: 'Failed to load announcements' });
  }
});

app.use('/api/contact', async (req, res, next) => {
  try {
    const routes = await import('../routes/contact.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading contact route:', error);
    res.status(500).json({ error: 'Failed to load contact' });
  }
});

app.use('/api/gallery', async (req, res, next) => {
  try {
    const routes = await import('../routes/gallery.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading gallery route:', error);
    res.status(500).json({ error: 'Failed to load gallery' });
  }
});

app.use('/api/clubs', async (req, res, next) => {
  try {
    const routes = await import('../routes/clubs.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading clubs route:', error);
    res.status(500).json({ error: 'Failed to load clubs' });
  }
});

app.use('/api/certificates', async (req, res, next) => {
  try {
    const routes = await import('../routes/certificates.js');
    routes.default(req, res, next);
  } catch (error) {
    console.error('Error loading certificates route:', error);
    res.status(500).json({ error: 'Failed to load certificates' });
  }
});

// ===== Serve React Build =====
const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
}

// ===== SPA Fallback =====
app.get('/', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({ 
      message: 'Helping Hands - NGO Volunteer Platform API',
      endpoints: {
        api: '/api/*',
        health: '/health'
      }
    });
  }
});

// ===== React SPA Routes Fallback =====
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    status: err.status || 500,
  });
});

// ===== MongoDB Connection (Async, Non-blocking) =====
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('⚠️ MONGODB_URI not set, database features disabled');
      return;
    }
    
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 5,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ MongoDB connected');
    }
  } catch (error) {
    console.warn('⚠️ MongoDB connection failed:', error.message);
    // Don't crash the function - continue without DB
  }
};

// Try to connect to DB, but don't block startup
connectDB().catch(err => {
  console.warn('⚠️ Initial DB connection error:', err.message);
});

// ===== Export for Vercel =====
export default app;
