const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');

// Middleware to check if coordinator is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.isCoordinator) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Configure email transporter (using Gmail SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'odautomation01@gmail.com',
      pass: 'mvrh ylun pkxh gtnz' // App Password for Gmail
    }
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

  // Group requests by faculty code and time
  const groupedRequests = {};
  approvedRequests.forEach(request => {
    const key = `${request.facultyCode}_${request.timeFrom}_${request.timeTo}`;
    if (!groupedRequests[key]) {
      groupedRequests[key] = [];
    }
    groupedRequests[key].push(request);
  });

  let currentRow = 2; // Start after header

  // Add grouped data
  Object.values(groupedRequests).forEach(group => {
    // Add separator row if not first group
    if (currentRow > 2) {
      worksheet.addRow([]); // Blank row
      currentRow++;
    }

    // Add group header
    const firstRequest = group[0];
    worksheet.addRow({
      facultyCode: firstRequest.facultyCode,
      subjectCode: '',
      name: `--- ${firstRequest.facultyCode} - ${firstRequest.timeFrom} to ${firstRequest.timeTo} ---`,
      enrollmentNumber: '',
      timeFrom: '',
      timeTo: '',
      reason: '',
      status: ''
    });

    // Style the group header
    const groupHeaderRow = worksheet.getRow(currentRow);
    groupHeaderRow.font = { bold: true, color: { argb: 'FF0000FF' } };
    groupHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF0F0F0' }
    };
    currentRow++;

    // Add requests in this group
    group.forEach(request => {
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
      currentRow++;
    });
  });

  return workbook;
};

// Helper function to delete processed requests
const deleteProcessedRequests = () => {
  const requestsToDelete = global.requests.filter(req => req.status === 'Approved' || req.status === 'Rejected');
  global.requests = global.requests.filter(req => req.status === 'Pending');
  
  console.log(`Deleted ${requestsToDelete.length} processed requests (${requestsToDelete.filter(r => r.status === 'Approved').length} approved, ${requestsToDelete.filter(r => r.status === 'Rejected').length} rejected)`);
  
  return requestsToDelete.length;
};

// GET /api/export - Export approved requests to Excel (Coordinator only)
router.get('/export', requireAuth, async (req, res) => {
  try {
    // Get all approved requests
    const approvedRequests = global.requests.filter(req => req.status === 'Approved');
    
    if (approvedRequests.length === 0) {
      return res.status(404).json({ error: 'No approved requests found' });
    }

    const workbook = await createExcelFile(approvedRequests);

    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=approved-od-requests.xlsx');

    // Write to response
    await workbook.xlsx.write(res);
    res.end();

    // Delete processed requests after successful export
    const deletedCount = deleteProcessedRequests();

  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/export-email - Export and send via email
router.post('/export-email', requireAuth, async (req, res) => {
  try {
    const { email, message, subject } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get all approved requests
    const approvedRequests = global.requests.filter(req => req.status === 'Approved');
    
    if (approvedRequests.length === 0) {
      return res.status(404).json({ error: 'No approved requests found' });
    }

    const workbook = await createExcelFile(approvedRequests);
    
    // Convert workbook to buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create transporter
    const transporter = createTransporter();
    
    // Debug email configuration
    console.log('Email configuration:', {
      user: 'odautomation01@gmail.com',
      pass: 'Set',
      to: email
    });

    // Email options
    const mailOptions = {
      from: '"OD Automation System" <odautomation01@gmail.com>',
      to: email,
      subject: subject || 'Approved OD Requests Report',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">OD Requests Report</h2>
          <p style="color: #666; line-height: 1.6;">
            ${message || 'Please find attached the approved OD requests report.'}
          </p>
          <p style="color: #666; margin-top: 20px;">
            This report contains ${approvedRequests.length} approved OD requests.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'approved-od-requests.xlsx',
          content: buffer
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Delete processed requests after successful email
    const deletedCount = deleteProcessedRequests();

    res.json({ 
      success: true, 
      message: `Report sent successfully to ${email}. ${deletedCount} processed requests have been deleted from storage.`,
      requestCount: approvedRequests.length,
      deletedCount: deletedCount
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send email. Please check your email configuration.';
    
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check your Gmail credentials.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Email connection failed. Please check your internet connection.';
    } else if (error.message) {
      errorMessage = `Email error: ${error.message}`;
    }
    
    res.status(500).json({ 
      error: errorMessage 
    });
  }
});

module.exports = router; 