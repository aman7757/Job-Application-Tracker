// server.js
// This is the entry point. It starts the server and connects to MongoDB.

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

// Middleware: lets us read JSON from request bodies, and allows frontend to call this API
app.use(express.json());
app.use(cors());

// Test route — visit this in browser to confirm server is alive
app.get('/', (req, res) => {
  res.send('Job Tracker API is running');
});

// All auth-related routes (register/login) live under /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/applications',applicationRoutes);

// Connect to MongoDB, then start the server only if connection succeeds
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });