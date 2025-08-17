const express = require('express');
const router = express.Router();
const Coordinator = require('../models/Coordinator');

// POST /api/login - Coordinator login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  try {
    // Find coordinator by username
    const coordinator = await Coordinator.findOne({ username });
    
    if (!coordinator) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Compare passwords
    const isMatch = await coordinator.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Set session
    req.session.isCoordinator = true;
    req.session.coordinatorId = coordinator._id;
    
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
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