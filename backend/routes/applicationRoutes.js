// routes/applicationRoutes.js
// All routes here are PROTECTED — you must be logged in (valid JWT) to use them.

const express = require('express');
const Application = require('../models/Application');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const sendApplicationEmail = require('../utils/mailer');

const router = express.Router();

// Every route below runs authMiddleware FIRST.
// authMiddleware checks the JWT token and sets req.userId before letting the request continue.

// ---------- CREATE ----------
// POST /api/applications
// Headers: Authorization: Bearer <token>
// Body: { company, role, status, link, notes }
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { company, role, status, link, notes } = req.body;

    const newApplication = new Application({
      userId: req.userId,   // comes from the token, not from the request body — so users can't fake this
      company,
      role,
      status,
      link,
      notes,
    });

    await newApplication.save();

    // Fetch the user's email, then fire the confirmation email
    // (we don't 'await' blocking the response on this in a way that fails the request if email fails)
    const user = await User.findById(req.userId);
    if (user) {
      sendApplicationEmail(user.email, user.name, newApplication);
    }

    res.status(201).json(newApplication);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- READ (all of the logged-in user's applications) ----------
// GET /api/applications
// Optional query params: ?status=Interview  and  ?sort=oldest
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filter = { userId: req.userId };

    // If a status filter was passed in the URL, add it to the filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Default: newest first. If ?sort=oldest is passed, flip it.
    const sortOrder = req.query.sort === 'oldest' ? 1 : -1;

    const applications = await Application.find(filter).sort({ appliedDate: sortOrder });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- UPDATE ----------
// PUT /api/applications/:id
// Body: any fields you want to change, e.g. { status: "Interview" }
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params.id, userId: req.userId });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update only the fields that were sent in the request
    Object.assign(application, req.body);
    await application.save();

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ---------- DELETE ----------
// DELETE /api/applications/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;