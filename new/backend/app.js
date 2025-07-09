require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes    = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const resumeRoutes  = require('./routes/resume');
const pdfRoutes     = require('./routes/pdf');
const aiRoutes      = require('./routes/ai');
const pricingRoutes = require('./routes/pricing');
const purchaseRoutes= require('./routes/purchase');

const app = express();

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS — all your frontends in one call
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'],
  credentials: true,
}));

// MongoDB connection
mongoose
  .connect("mongodb+srv://user:hCPW9g1jKMkRt3iY@cluster0.tmfdszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Resume Builder API');
});

// Mount your feature routes
app.use('/api/auth',    authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/resume',  resumeRoutes);
app.use('/api/pdf',     pdfRoutes);
app.use('/api/ai',      aiRoutes);
app.use('/api/plans',   pricingRoutes);
app.use('/api/purchase',purchaseRoutes);

// 404 handler (if no route matched)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// **Global error handler** — must come _after_ all routes!
app.use((err, req, res, next) => {
  console.error(err);
  // If err.status is set anywhere (e.g. from custom errors), use it.
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
