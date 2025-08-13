const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const ODRequest = require('../models/ODRequest');

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
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Enrollment Number', key: 'enrollmentNumber', width: 20 },
    { header: 'Time From', key: 'timeFrom', width: 15 },
    { header: 'Time To', key: 'timeTo', width: 15 },
    { header: 'Reason', key: 'reason', width: 40 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  // Style the header row
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Sort approved requests by faculty code
  const sortedRequests = approvedRequests.sort((a, b) => {
    // Handle cases where facultyCode might be undefined or null
    const facultyCodeA = (a.facultyCode || '').toString().toLowerCase();
    const facultyCodeB = (b.facultyCode || '').toString().toLowerCase();
    return facultyCodeA.localeCompare(facultyCodeB);
  });

  // Add each request as a separate entry (sorted by faculty code)
  sortedRequests.forEach(request => {
    worksheet.addRow({
      facultyCode: request.facultyCode,
      subjectCode: request.subjectCode,
      name: request.name,
      enrollmentNumber: request.enrollmentNumber,
      timeFrom: request.timeFrom,
      timeTo: request.timeTo,
      reason: request.reason,
      status: request.status
    });
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
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=approved-od-requests.xlsx');
    
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
    
    // Send email with attachment
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      to: email,
      subject: subject || 'Approved OD Requests Report',
      text: message || 'Please find attached the approved OD requests report.',
      attachments: [
        {
          filename: 'approved-od-requests.xlsx',
          content: buffer
        }
      ]
    });
    
    // Delete approved and rejected requests after email is sent
    await ODRequest.deleteMany({ status: { $in: ['Approved', 'Rejected'] } });
    
    res.json({ success: true, message: 'Email sent successfully. All approved and rejected requests have been deleted.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;