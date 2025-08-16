const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const ODRequest = require('../models/ODRequest');
const { sendReportEmail } = require('../services/emailService');

// Middleware to check if coordinator is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isCoordinator) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Configure email transporter with better error handling
const createTransporter = () => {
  // For development/testing, use a more permissive configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      pass: process.env.EMAIL_PASS || 'mvrh ylun pkxh gtnz' // App Password for Gmail
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug logs
    logger: true // Enable logger
  });
};

// Helper function to create Excel file
const createExcelFile = async (approvedRequests) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Approved OD Requests');

  // Define columns
  worksheet.columns = [
    { header: 'Faculty Code', key: 'facultyCode', width: 15 },
    { header: 'Subject Code', key: 'subjectCode', width: 15 },
    { header: 'Student Name', key: 'name', width: 25 },
    { header: 'Enrollment Number', key: 'enrollmentNumber', width: 20 },
    { header: 'Time From', key: 'timeFrom', width: 15 },
    { header: 'Time To', key: 'timeTo', width: 15 },
    { header: 'Reason for OD', key: 'reason', width: 40 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add summary information at the top
  const summaryRow1 = worksheet.addRow({
    facultyCode: 'SUMMARY:',
    subjectCode: '',
    name: '',
    enrollmentNumber: '',
    timeFrom: '',
    timeTo: '',
    reason: '',
    status: ''
  });
  summaryRow1.font = { bold: true, size: 12 };
  summaryRow1.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD4EDDA' } // Light green background
  };

  // Group requests by time slot for summary
  const timeSlotGroups = {};
  approvedRequests.forEach(request => {
    const timeSlot = `${request.timeFrom}-${request.timeTo}`;
    if (!timeSlotGroups[timeSlot]) {
      timeSlotGroups[timeSlot] = [];
    }
    timeSlotGroups[timeSlot].push(request);
  });

  // Add summary details
  Object.keys(timeSlotGroups).forEach(timeSlot => {
    const [timeFrom, timeTo] = timeSlot.split('-');
    const facultyCodes = [...new Set(timeSlotGroups[timeSlot].map(r => r.facultyCode))];
    const subjectCodes = [...new Set(timeSlotGroups[timeSlot].map(r => r.subjectCode))];
    
    const summaryRow = worksheet.addRow({
      facultyCode: `Time: ${timeFrom} to ${timeTo}`,
      subjectCode: `Faculty Codes: ${facultyCodes.join(', ')}`,
      name: `Students: ${timeSlotGroups[timeSlot].length}`,
      enrollmentNumber: `Subject Codes: ${subjectCodes.join(', ')}`,
      timeFrom: '',
      timeTo: '',
      reason: '',
      status: ''
    });
    summaryRow.font = { italic: true };
    summaryRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF8F9FA' } // Very light gray
    };
  });

  // Add empty row after summary
  worksheet.addRow({});

  // Sort approved requests by time slot first, then by faculty code within each time slot
  const sortedRequests = approvedRequests.sort((a, b) => {
    // First, compare by time slot (timeFrom and timeTo)
    const timeSlotA = `${a.timeFrom}-${a.timeTo}`;
    const timeSlotB = `${b.timeFrom}-${b.timeTo}`;
    
    if (timeSlotA !== timeSlotB) {
      return timeSlotA.localeCompare(timeSlotB);
    }
    
    // If time slots are the same, then sort by faculty code
    const facultyCodeA = (a.facultyCode || '').toString().toLowerCase();
    const facultyCodeB = (b.facultyCode || '').toString().toLowerCase();
    return facultyCodeA.localeCompare(facultyCodeB);
  });

  // Add each request as a separate entry with grouping by time slots
  let currentTimeSlot = '';
  let rowNumber = 2; // Start after header row
  
  sortedRequests.forEach((request, index) => {
    const timeSlot = `${request.timeFrom}-${request.timeTo}`;
    
    // Add a separator row if we're starting a new time slot (except for the first one)
    if (timeSlot !== currentTimeSlot && currentTimeSlot !== '') {
      // Add an empty row as separator
      worksheet.addRow({});
      rowNumber++;
      
      // Add a time slot header row
      const timeSlotRow = worksheet.addRow({
        facultyCode: `--- ${request.timeFrom} to ${request.timeTo} ---`,
        subjectCode: '',
        name: '',
        enrollmentNumber: '',
        timeFrom: '',
        timeTo: '',
        reason: '',
        status: ''
      });
      
      // Style the time slot header
      timeSlotRow.font = { bold: true, color: { argb: 'FF0000FF' } }; // Blue color
      timeSlotRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF0F0F0' } // Light gray background
      };
      rowNumber++;
    }
    
    // Update current time slot
    currentTimeSlot = timeSlot;
    
    // Add the request row
    const dataRow = worksheet.addRow({
      facultyCode: request.facultyCode,
      subjectCode: request.subjectCode,
      name: request.name,
      enrollmentNumber: request.enrollmentNumber,
      timeFrom: request.timeFrom,
      timeTo: request.timeTo,
      reason: request.reason,
      status: request.status
    });
    
    // Add subtle background color for faculty code groups within the same time slot
    if (index > 0) {
      const prevRequest = sortedRequests[index - 1];
      const prevTimeSlot = `${prevRequest.timeFrom}-${prevRequest.timeTo}`;
      const currentTimeSlot = `${request.timeFrom}-${request.timeTo}`;
      
      // If same time slot but different faculty code, add subtle background
      if (currentTimeSlot === prevTimeSlot && request.facultyCode !== prevRequest.facultyCode) {
        dataRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF5F5F5' } // Very light gray
        };
      }
    }
    
    rowNumber++;
  });

  return workbook;
};

// GET /api/export - Download Excel file (Coordinator only)
router.get('/export', requireAuth, async (req, res) => {
  try {
    // Get all approved requests
    const approvedRequests = await ODRequest.find({ status: 'Approved' });
    
    if (approvedRequests.length === 0) {
      return res.status(404).json({ error: 'No approved requests found' });
    }
    
    // Create Excel file
    const workbook = await createExcelFile(approvedRequests);
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Delete approved and rejected requests after export
    await ODRequest.deleteMany({ status: { $in: ['Approved', 'Rejected'] } });
    
    // Set response headers with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=approved-od-requests-${timestamp}.xlsx`);
    
    // Send file
    res.send(buffer);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/export-email - Send email with Excel attachment (Coordinator only)
router.post('/export-email', requireAuth, async (req, res) => {
  try {
    const { email, subject, message } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    
    // Get all approved requests
    const approvedRequests = await ODRequest.find({ status: 'Approved' });
    
    if (approvedRequests.length === 0) {
      return res.status(404).json({ error: 'No approved requests found' });
    }
    
    // Create Excel file
    const workbook = await createExcelFile(approvedRequests);
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Prepare report data for the email service
    const reportData = {
      totalRequests: approvedRequests.length,
      timestamp: new Date()
    };
    
    // Send beautiful email using the email service
    const emailResult = await sendReportEmail(email, reportData, message, buffer);
    
    if (!emailResult) {
      return res.status(500).json({ error: 'Failed to send email' });
    }
    
    // Delete approved and rejected requests after email is sent
    await ODRequest.deleteMany({ status: { $in: ['Approved', 'Rejected'] } });
    
    res.json({ success: true, message: 'Report email sent successfully. All approved and rejected requests have been processed and removed from the system.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;