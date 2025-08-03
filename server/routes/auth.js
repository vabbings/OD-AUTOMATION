const express = require('express');
const router = express.Router();

// Hardcoded coordinator password
const COORDINATOR_PASSWORD = 'admin123';

// POST /api/login - Coordinator login
router.post('/login', (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  
  if (password === COORDINATOR_PASSWORD) {
    req.session.isCoordinator = true;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// GET /api/check-auth - Check if coordinator is authenticated
router.get('/check-auth', (req, res) => {
  if (req.session.isCoordinator) {
    res.json({ isAuthenticated: true });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// POST /api/logout - Logout coordinator
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router; 