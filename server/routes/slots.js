const express = require('express');
const router = express.Router();

// Middleware to check if coordinator is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isCoordinator) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// POST /api/slots - Create a new slot (Coordinator only)
router.post('/slots', requireAuth, (req, res) => {
  try {
    const { title, date, time } = req.body;
    
    if (!title || !date || !time) {
      return res.status(400).json({ error: 'Title, date, and time are required' });
    }
    
    const slot = {
      _id: Date.now().toString(),
      title,
      date: new Date(date),
      time,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    global.slots.push(slot);
    res.status(201).json(slot);
  } catch (error) {
    console.error('Error creating slot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/slots - Get all slots (Public)
router.get('/slots', (req, res) => {
  try {
    const slots = global.slots.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/slots/:id - Delete a slot (Coordinator only)
router.delete('/slots/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the slot index
    const slotIndex = global.slots.findIndex(slot => slot._id === id);
    
    if (slotIndex === -1) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    // Check if there are any pending requests for this slot
    const pendingRequests = global.requests.filter(request => 
      request.slotId === id && request.status === 'Pending'
    );
    
    if (pendingRequests.length > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete slot. There are pending requests for this slot.' 
      });
    }
    
    // Remove the slot
    global.slots.splice(slotIndex, 1);
    
    res.json({ message: 'Slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting slot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 