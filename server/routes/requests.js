const express = require('express');
const router = express.Router();
const ODRequest = require('../models/ODRequest');
const { sendApprovalEmail, sendRejectionEmail } = require('../services/emailService');

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

// Helper function to convert 24-hour format to 12-hour format
const convertTo12HourFormat = (time) => {
  if (!time) return time;
  
  // If already in 12-hour format (contains AM/PM), return as is
  if (time.includes('AM') || time.includes('PM')) {
    return time;
  }
  
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
};

// Calculate how many time gaps are covered by the selected time range
const getTimeGapCount = (timeFrom, timeTo) => {
  if (!timeFrom || !timeTo) return 0;
  
  // Convert to 12-hour format for comparison
  const timeFrom12 = convertTo12HourFormat(timeFrom);
  const timeTo12 = convertTo12HourFormat(timeTo);
  
  const fromTime = new Date(`2000-01-01 ${timeFrom12}`);
  const toTime = new Date(`2000-01-01 ${timeTo12}`);
  
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
router.post('/requests', async (req, res) => {
  try {
    const { name, enrollmentNumber, email, subjectCode, facultyCode, date, timeFrom, timeTo, reason } = req.body;
    
    if (!name || !enrollmentNumber || !email || !subjectCode || !facultyCode || !date || !timeFrom || !timeTo || !reason) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
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
    
    // Convert times to 12-hour format for storage
    const timeFrom12 = convertTo12HourFormat(timeFrom);
    const timeTo12 = convertTo12HourFormat(timeTo);
    
    // If no gaps found, create a single request
    if (gapCount === 0) {
      const requestData = {
        name,
        enrollmentNumber,
        email,
        subjectCode: subjectCode.trim(),
        facultyCode: facultyCode.trim(),
        date,
        timeFrom: timeFrom12,
        timeTo: timeTo12,
        reason,
        status: 'Pending'
      };
      
      const newRequest = new ODRequest(requestData);
      await newRequest.save();
      createdRequests.push(newRequest);
    } else {
      // Create separate requests for each gap with proper time slot mapping
      const timeSlots = [];
      
      // Generate the actual time slots based on the selected range
      const fromTime = new Date(`2000-01-01 ${timeFrom12}`);
      const toTime = new Date(`2000-01-01 ${timeTo12}`);
      
      timeGaps.forEach(gap => {
        const gapFrom = new Date(`2000-01-01 ${gap.from}`);
        const gapTo = new Date(`2000-01-01 ${gap.to}`);
        
        // Check if this gap overlaps with the selected time range
        if (gapFrom < toTime && gapTo > fromTime) {
          timeSlots.push({
            from: gap.from,
            to: gap.to
          });
        }
      });
      
      // Create a request for each time slot with its corresponding subject and faculty code
      for (let i = 0; i < timeSlots.length; i++) {
        const requestData = {
          name,
          enrollmentNumber,
          email,
          subjectCode: subjectCodes[i],
          facultyCode: facultyCodes[i],
          date,
          timeFrom: timeSlots[i].from,
          timeTo: timeSlots[i].to,
          reason,
          status: 'Pending'
        };
        
        const newRequest = new ODRequest(requestData);
        await newRequest.save();
        createdRequests.push(newRequest);
      }
    }
    
    res.status(201).json({
      message: `Created ${createdRequests.length} request(s)`,
      requests: createdRequests
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/requests - Get all requests (Coordinator only)
router.get('/requests', requireAuth, async (req, res) => {
  try {
    const requests = await ODRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/requests/:id/approve - Approve request (Coordinator only)
router.put('/requests/:id/approve', requireAuth, async (req, res) => {
  try {
    const request = await ODRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    console.log('Approving request:', request._id, 'for student:', request.email);
    
    request.status = 'Approved';
    await request.save();
    
    // Send approval email to student
    try {
      console.log('Attempting to send approval email to:', request.email);
      const emailResult = await sendApprovalEmail(request.email, request);
      console.log('Approval email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ success: true, request });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/requests/:id/reject - Reject request (Coordinator only)
router.put('/requests/:id/reject', requireAuth, async (req, res) => {
  try {
    const request = await ODRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    console.log('Rejecting request:', request._id, 'for student:', request.email);
    
    request.status = 'Rejected';
    await request.save();
    
    // Send rejection email to student
    try {
      console.log('Attempting to send rejection email to:', request.email);
      const emailResult = await sendRejectionEmail(request.email, request);
      console.log('Rejection email result:', emailResult);
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.json({ success: true, request });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;