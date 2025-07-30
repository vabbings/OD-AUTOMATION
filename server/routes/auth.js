const express = require('express');
const router = express.Router();

// Hardcoded coordinator password
const COORDINATOR_PASSWORD = 'admin123';

// Simple authentication state (for serverless compatibility)
let isAuthenticated = false;

// POST /api/login - Coordinator login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  if (password === COORDINATOR_PASSWORD) {
    isAuthenticated = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// POST /api/logout - Coordinator logout
router.post('/logout', (req, res) => {
  isAuthenticated = false;
  res.json({ success: true, message: 'Logout successful' });
});

// GET /api/check-auth - Check if coordinator is authenticated
router.get('/check-auth', (req, res) => {
  res.json({ isAuthenticated });
});

module.exports = router; 