const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Helper to safely read JSON
function readJson(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return defaultValue;
  }
}

// Helper to safely write JSON
function writeJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Initialize seed data
const initialGuestbook = [
  {
    id: "gb_seed_1",
    name: "Pondicherry Tech Forum",
    role: "Community Peer",
    badge: "Collaborator",
    message: "Mayank's hardware debugging and Arduino prototyping skills are genuinely impressive. Great teammate on ECE projects!",
    date: "2026-03-15T10:30:00Z"
  },
  {
    id: "gb_seed_2",
    name: "Hackathon Judging Panel",
    role: "Green Tech Reviewer",
    badge: "Mentor",
    message: "Green Garuda Co. had one of the clearest circular-economy IoT architectures presented at the event.",
    date: "2026-04-02T14:15:00Z"
  }
];

const initialStats = {
  views: 142,
  uniqueVisitors: 98,
  lastUpdated: new Date().toISOString()
};

readJson(MESSAGES_FILE, []);
readJson(GUESTBOOK_FILE, initialGuestbook);
readJson(STATS_FILE, initialStats);

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// Simple sanitize helper
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>]/g, '').trim();
}

// Simple email check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: 'full-stack',
    version: '2.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Portfolio Live Telemetry / IoT Simulated Sensor Stream
app.get('/api/telemetry', (req, res) => {
  // Realistic hardware jitter simulation
  const baseVoltage = 5.0;
  const jitter = (Math.random() * 0.14 - 0.07).toFixed(2);
  const voltage = (baseVoltage + parseFloat(jitter)).toFixed(2);
  const temp = (27.2 + (Math.random() * 1.6 - 0.8)).toFixed(1);
  const current = (142 + Math.floor(Math.random() * 18)).toString();

  res.json({
    device: "ATmega328P / ESP32 Node",
    status: "ONLINE",
    baudRate: 9600,
    voltage: `${voltage}V`,
    currentMa: `${current}mA`,
    temperatureC: `${temp}°C`,
    signalRssi: `-${52 + Math.floor(Math.random() * 8)} dBm`,
    i2cBus: "ACK (0x3C Display, 0x68 MPU)",
    lastSync: new Date().toLocaleTimeString()
  });
});

// Contact Form Submission
app.post('/api/contact', (req, res) => {
  try {
    const name = sanitize(req.body.name);
    const email = sanitize(req.body.email);
    const subject = sanitize(req.body.subject) || 'General Inquiry';
    const message = sanitize(req.body.message);
    const interest = sanitize(req.body.interest) || 'General';

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (min 2 characters).' });
    }
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!message || message.length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters long.' });
    }

    const messages = readJson(MESSAGES_FILE, []);
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      email,
      subject,
      interest,
      message,
      createdAt: new Date().toISOString(),
      read: false,
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
    };

    messages.unshift(newMessage);
    writeJson(MESSAGES_FILE, messages);

    console.log(`[Contact] New message received from "${name}" <${email}> - Subject: ${subject}`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been saved and Mayank will get back to you soon.',
      id: newMessage.id
    });
  } catch (err) {
    console.error('Contact endpoint error:', err);
    res.status(500).json({ error: 'Internal server error while saving message.' });
  }
});

// View Contact Messages (with optional key or demo access)
app.get('/api/contact/messages', (req, res) => {
  const key = req.headers['x-admin-key'] || req.query.key;
  const messages = readJson(MESSAGES_FILE, []);
  
  // Return message list (in real production, a secret key protects this)
  res.json({
    total: messages.length,
    messages
  });
});

// Delete message by ID (for admin management)
app.delete('/api/contact/messages/:id', (req, res) => {
  const { id } = req.params;
  let messages = readJson(MESSAGES_FILE, []);
  const initialLength = messages.length;
  messages = messages.filter(m => m.id !== id);
  
  if (messages.length === initialLength) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  writeJson(MESSAGES_FILE, messages);
  res.json({ success: true, message: 'Message removed successfully.' });
});

// Guestbook: Read
app.get('/api/guestbook', (req, res) => {
  const guestbook = readJson(GUESTBOOK_FILE, initialGuestbook);
  res.json(guestbook);
});

// Guestbook: Create
app.post('/api/guestbook', (req, res) => {
  try {
    const name = sanitize(req.body.name);
    const role = sanitize(req.body.role) || 'Visitor';
    const message = sanitize(req.body.message);
    const badge = sanitize(req.body.badge) || 'Peer';

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }
    if (!message || message.length < 3) {
      return res.status(400).json({ error: 'Please enter a short endorsement or note (min 3 characters).' });
    }

    const guestbook = readJson(GUESTBOOK_FILE, initialGuestbook);
    const newEntry = {
      id: `gb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      role,
      badge,
      message,
      date: new Date().toISOString()
    };

    guestbook.unshift(newEntry);
    writeJson(GUESTBOOK_FILE, guestbook);

    res.status(201).json({
      success: true,
      message: 'Thank you for signing the guestbook!',
      entry: newEntry
    });
  } catch (err) {
    console.error('Guestbook endpoint error:', err);
    res.status(500).json({ error: 'Failed to save guestbook entry.' });
  }
});

// Stats: Read and increment
app.get('/api/stats', (req, res) => {
  const stats = readJson(STATS_FILE, initialStats);
  const messages = readJson(MESSAGES_FILE, []);
  const guestbook = readJson(GUESTBOOK_FILE, []);

  res.json({
    views: stats.views,
    messagesCount: messages.length,
    endorsementsCount: guestbook.length,
    projectsCount: 3,
    status: "online",
    serverUptime: Math.floor(process.uptime())
  });
});

app.post('/api/stats/visit', (req, res) => {
  const stats = readJson(STATS_FILE, initialStats);
  stats.views = (stats.views || 0) + 1;
  stats.lastUpdated = new Date().toISOString();
  writeJson(STATS_FILE, stats);
  res.json({ success: true, views: stats.views });
});

// Fallback for unknown API routes or client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Mayank Portfolio Full-Stack Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`⚙️  API Status: http://localhost:${PORT}/api/health`);
    console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
