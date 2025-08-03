const express = require('express');
const router = express.Router();

// Middleware to check if coordinator is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isCoordinator) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Define time gaps for gap calculation
const timeGaps = [
  { from: '09:15 AM', to: '10:10 AM' },
  { from: '10:15 AM', to: '11:10 AM' },
  { from: '11:15 AM', to: '12:10 PM' },
  { from: '12:15 PM', to: '01:10 PM' },
  { from: '01:15 PM', to: '02:10 PM' },
  { from: '02:15 PM', to: '03:10 PM' },
  { from: '03:15 PM', to: '04:10 PM' },
  { from: '04:15 PM', to: '05:10 PM' }
];

// Calculate how many time gaps are covered by the selected time range
const getTimeGapCount = (timeFrom, timeTo) => {
  if (!timeFrom || !timeTo) return 0;
  
  const fromTime = new Date(`2000-01-01 ${timeFrom}`);
  const toTime = new Date(`2000-01-01 ${timeTo}`);
  
  let gapCount = 0;
  timeGaps.forEach(gap => {
    const gapFrom = new Date(`2000-01-01 ${gap.from}`);
    const gapTo = new Date(`2000-01-01 ${gap.to}`);
    
    // Check if this gap overlaps with the selected time range
    if (gapFrom < toTime && gapTo > fromTime) {
      gapCount++;
    }
  });
  
  return gapCount;
};

// POST /api/requests - Submit OD request (Public)
router.post('/requests', (req, res) => {
  try {
    const { name, enrollmentNumber, subjectCode, facultyCode, date, timeFrom, timeTo, reason } = req.body;
    
    if (!name || !enrollmentNumber || !subjectCode || !facultyCode || !date || !timeFrom || !timeTo || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    const gapCount = getTimeGapCount(timeFrom, timeTo);
    const subjectCodes = subjectCode.trim().split(/\s+/);
    const facultyCodes = facultyCode.trim().split(/\s+/);
    
    // Validate multiple entries if needed
    if (gapCount > 1) {
      if (subjectCodes.length !== gapCount) {
        return res.status(400).json({ error: `You selected ${gapCount} time gaps. Please enter ${gapCount} subject codes separated by spaces` });
      }
      if (facultyCodes.length !== gapCount) {
        return res.status(400).json({ error: `You selected ${gapCount} time gaps. Please enter ${gapCount} faculty codes separated by spaces` });
      }
    }
    
    // Create separate requests for each gap
    const createdRequests = [];
    
    for (let i = 0; i < gapCount; i++) {
      const request = {
        _id: global.requestId.toString(),
        name,
        enrollmentNumber,
        subjectCode: subjectCodes[i],
        facultyCode: facultyCodes[i],
        date,
        timeFrom,
        timeTo,
        reason,
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      global.requests.push(request);
      createdRequests.push(request);
      global.requestId++;
    }
    
    res.status(201).json({
      message: `Created ${gapCount} request(s)`,
      requests: createdRequests
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests - Get all OD requests (Coordinator only)
router.get('/requests', requireAuth, (req, res) => {
  try {
    // Filter out rejected requests since they are automatically deleted
    const requests = global.requests
      .filter(request => request.status !== 'Rejected')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    
    if (status === 'Rejected') {
      // Automatically delete rejected requests
      const deletedRequest = global.requests.splice(requestIndex, 1)[0];
      res.json({ 
        message: 'Request rejected and deleted',
        deletedRequest 
      });
    } else {
      // Update status for approved requests
      global.requests[requestIndex].status = status;
      global.requests[requestIndex].updatedAt = new Date();
      
      const updatedRequest = global.requests[requestIndex];
      res.json(updatedRequest);
    }
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 