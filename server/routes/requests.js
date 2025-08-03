const express = require('express');
const router = express.Router();

// Middleware to check if coordinator is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isCoordinator) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// POST /api/requests - Submit OD request (Public)
router.post('/requests', (req, res) => {
  try {
    const { name, enrollmentNumber, subjectCode, facultyCode, slotId } = req.body;
    
    if (!name || !enrollmentNumber || !subjectCode || !facultyCode || !slotId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if slot exists
    const slot = global.slots.find(s => s._id === slotId);
    if (!slot) {
      return res.status(404).json({ error: 'Slot not found' });
    }
    
    const request = {
      _id: global.requestId.toString(),
      name,
      enrollmentNumber,
      subjectCode,
      facultyCode,
      slotId,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    global.requests.push(request);
    global.requestId++;
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests - Get all OD requests (Coordinator only)
router.get('/requests', requireAuth, (req, res) => {
  try {
    const requests = global.requests.map(request => {
      const slot = global.slots.find(s => s._id === request.slotId);
      return {
        ...request,
        slotId: slot || { title: 'Unknown', date: new Date(), time: 'Unknown' }
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/requests/:id - Approve/Reject request (Coordinator only)
router.put('/requests/:id', requireAuth, (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "Approved" or "Rejected"' });
    }
    
    const requestIndex = global.requests.findIndex(r => r._id === req.params.id);
    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    global.requests[requestIndex].status = status;
    global.requests[requestIndex].updatedAt = new Date();
    
    const updatedRequest = global.requests[requestIndex];
    const slot = global.slots.find(s => s._id === updatedRequest.slotId);
    
    res.json({
      ...updatedRequest,
      slotId: slot || { title: 'Unknown', date: new Date(), time: 'Unknown' }
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 