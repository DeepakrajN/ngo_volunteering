import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import volunteerRoutes from "./routes/volunteers.js";
import adminRoutes from "./routes/admin.js";
import eventRoutes from "./routes/events.js";
import announcementRoutes from "./routes/announcements.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
const app = express();

const registerStyle = `<style> body { background-color: #2d3748; color: white; font-family: Arial, sans-serif; padding: 20px; } h1 { color: #63b3ed; } form { max-width: 400px; margin: 0 auto; } label { display: block; margin-bottom: 10px; } input { width: 100%; padding: 8px; margin-bottom: 10px; background-color: white; color: black; border: 1px solid #ccc; border-radius: 4px; } button { background-color: #3182ce; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; } button:hover { background-color: #2c5282; } </style>`;

// ===== Middleware =====
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve legacy static pages from project root `public/` if present
import path from 'path';
const __dirname = path.resolve();
// Serve legacy static pages from project root `public/` if present
app.use(express.static(path.join(__dirname, 'public')));

// If a production React build exists at client/build, serve it as the SPA.
// Register static middleware for the build path so files are served if/when the build is created.
const clientBuildPath = path.join(__dirname, 'client', 'build');
import fs from 'fs';
app.use(express.static(clientBuildPath));

// For any other path not handled by API, attempt to return the React app's index.html if it exists.
app.get('*', (req, res, next) => {
  // skip API routes
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(clientBuildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  // Serve registration flow directly at root when no build exists
  if (req.path === '/') {
    res.send(`
      ${registerStyle}
      <h1>Register - Step 1</h1>
      <form method="POST" action="/register-flow">
        <input type="hidden" name="step" value="1" />
        <label>Name: <input name="name" required></label><br/>
        <label>Email: <input name="email" type="email" required></label><br/>
        <button type="submit">Next</button>
      </form>
    `);
  } else {
    res.redirect('/register-flow');
  }
});

// ===== MongoDB Connection (supports in-memory fallback) =====
async function connectDb() {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('No MONGODB_URI provided — starting in-memory MongoDB for demo/testing...');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('✅ In-memory MongoDB started and connected');
    }
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    throw err;
  }
}

// seed a default admin user if none exists
async function seedAdmin() {
  try {
    const Admin = (await import('./models/admin.js')).default;
    const bcrypt = (await import('bcryptjs')).default;
    const count = await Admin.countDocuments();
    if (count === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await Admin.create({ username: 'admin', password: passwordHash });
      console.log('✨ Seeded default admin (username: admin, password: admin123)');
    }
  } catch (err) {
    console.warn('⚠️ Admin seeding failed:', err.message || err);
  }
}

// connect and seed before starting server
connectDb().then(() => seedAdmin()).catch(() => {/* errors already logged */});

// ===== Routes =====
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/announcements", announcementRoutes);
import contactRoutes from './routes/contact.js';
import galleryRoutes from './routes/gallery.js';
import clubRoutes from './routes/clubs.js';
import certificateRoutes from './routes/certificates.js';
app.use('/api/contact', contactRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/certificates', certificateRoutes);

// ===== Root route =====
// Note: if a client build exists we serve it above; otherwise the root route returns a small message.

// --- Multi-step registration flow using POST to move to next step ---
app.get('/register-flow', (req, res) => {
  // Step 1: basic info
  res.send(`
    ${registerStyle}
    <h1>Register - Step 1</h1>
    <form method="POST" action="/register-flow">
      <input type="hidden" name="step" value="1" />
      <label>Name: <input name="name" required></label><br/>
      <label>Email: <input name="email" type="email" required></label><br/>
      <button type="submit">Next</button>
    </form>
  `);
});

// Alias under /api to avoid proxy/static interception
app.get('/api/register-flow', (req, res) => {
  // Step 1: basic info
  res.send(`
    ${registerStyle}
    <h1>Register - Step 1</h1>
    <form method="POST" action="/api/register-flow">
      <input type="hidden" name="step" value="1" />
      <label>Name: <input name="name" required></label><br/>
      <label>Email: <input name="email" type="email" required></label><br/>
      <button type="submit">Next</button>
    </form>
  `);
});

app.post('/register-flow', express.urlencoded({ extended: true }), async (req, res) => {
  const step = req.body.step || '1';
  if (step === '1') {
    // Render step 2 and carry previous fields as hidden inputs
    res.send(`
      ${registerStyle}
      <h1>Register - Step 2</h1>
      <form method="POST" action="/register-flow">
        <input type="hidden" name="step" value="2" />
        <input type="hidden" name="name" value="${req.body.name || ''}" />
        <input type="hidden" name="email" value="${req.body.email || ''}" />
        <label>Phone: <input name="phone" required></label><br/>
        <label>Password: <input name="password" type="password" required></label><br/>
        <button type="submit">Next</button>
      </form>
    `);
  } else if (step === '2') {
    // Render step 3
    res.send(`
      ${registerStyle}
      <h1>Register - Step 3</h1>
      <form method="POST" action="/register-flow">
        <input type="hidden" name="step" value="3" />
        <input type="hidden" name="name" value="${req.body.name || ''}" />
        <input type="hidden" name="email" value="${req.body.email || ''}" />
        <input type="hidden" name="phone" value="${req.body.phone || ''}" />
        <input type="hidden" name="password" value="${req.body.password || ''}" />
        <label>City: <input name="city"></label><br/>
        <label>Skills: <input name="skills"></label><br/>
        <button type="submit">Finish</button>
      </form>
    `);
  } else if (step === '3') {
    // Final step: collect all fields, POST internally to API to create volunteer
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      city: req.body.city,
      skills: req.body.skills,
    };

    try {
      const apiUrl = (process.env.BASE_API_URL || `http://localhost:${process.env.PORT || 5000}`) + '/api/volunteers/register';
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await r.json();
      if (!r.ok) {
        return res.status(400).send(`${registerStyle}<h1>Registration failed</h1><pre>${JSON.stringify(json)}</pre>`);
      }
      res.send(`${registerStyle}<h1>Registration successful</h1><p>Welcome, ${json.name || payload.name}</p>`);
    } catch (err) {
      res.status(500).send(`${registerStyle}<h1>Server error</h1><pre>${err.message}</pre>`);
    }
  } else {
    res.redirect('/register-flow');
  }
});

app.post('/api/register-flow', express.urlencoded({ extended: true }), async (req, res) => {
  const step = req.body.step || '1';
  if (step === '1') {
    res.send(`
      ${registerStyle}
      <h1>Register - Step 2</h1>
      <form method="POST" action="/api/register-flow">
        <input type="hidden" name="step" value="2" />
        <input type="hidden" name="name" value="${req.body.name || ''}" />
        <input type="hidden" name="email" value="${req.body.email || ''}" />
        <label>Phone: <input name="phone" required></label><br/>
        <label>Password: <input name="password" type="password" required></label><br/>
        <button type="submit">Next</button>
      </form>
    `);
  } else if (step === '2') {
    res.send(`
      ${registerStyle}
      <h1>Register - Step 3</h1>
      <form method="POST" action="/api/register-flow">
        <input type="hidden" name="step" value="3" />
        <input type="hidden" name="name" value="${req.body.name || ''}" />
        <input type="hidden" name="email" value="${req.body.email || ''}" />
        <input type="hidden" name="phone" value="${req.body.phone || ''}" />
        <input type="hidden" name="password" value="${req.body.password || ''}" />
        <label>City: <input name="city"></label><br/>
        <label>Skills: <input name="skills"></label><br/>
        <button type="submit">Finish</button>
      </form>
    `);
  } else if (step === '3') {
    const payload = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      city: req.body.city,
      skills: req.body.skills,
    };

    try {
      const apiUrl = (process.env.BASE_API_URL || `http://localhost:${process.env.PORT || 5000}`) + '/api/volunteers/register';
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await r.json();
      if (!r.ok) {
        return res.status(400).send(`${registerStyle}<h1>Registration failed</h1><pre>${JSON.stringify(json)}</pre>`);
      }
      res.send(`${registerStyle}<h1>Registration successful</h1><p>Welcome, ${json.name || payload.name}</p>`);
    } catch (err) {
      res.status(500).send(`${registerStyle}<h1>Server error</h1><pre>${err.message}</pre>`);
    }
  } else {
    res.redirect('/api/register-flow');
  }
});

// ===== Error Handler =====
app.use(errorHandler);

// ===== Start Server =====
const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = (port) => {
  const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);
