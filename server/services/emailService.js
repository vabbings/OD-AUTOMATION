console.log('Email service file is being loaded...');

const nodemailer = require('nodemailer');

// Configure email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      pass: process.env.EMAIL_PASS || 'mvrh ylun pkxh gtnz'
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send approval email to student
const sendApprovalEmail = async (studentEmail, requestData) => {
  try {
    console.log('Email service: Creating transporter for approval email to:', studentEmail);
    const transporter = createTransporter();
    
    const emailSubject = `OD Request Approved - ${requestData.subjectCode}`;
    
    console.log('Email service: Sending approval email with subject:', emailSubject);
    
    const emailBody = `
Dear ${requestData.name},

Your OD request has been APPROVED by the coordinator.

Request Details:
• Subject Code: ${requestData.subjectCode}
• Faculty Code: ${requestData.facultyCode}
• Date: ${requestData.date}
• Time: ${requestData.timeFrom} to ${requestData.timeTo}
• Reason: ${requestData.reason}
• Enrollment Number: ${requestData.enrollmentNumber}

Your On-Duty request is now approved. Please ensure you follow all institutional guidelines during your approved OD period.

Best regards,
OD Automation System
Coordinator Team
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      to: studentEmail,
      subject: emailSubject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin: 0; color: #155724;">✅ OD Request APPROVED</h2>
          </div>
          
          <p style="color: #333; font-size: 16px;">Dear <strong>${requestData.name}</strong>,</p>
          
          <p style="color: #333; font-size: 16px;">Your OD request has been <strong>APPROVED</strong> by the coordinator.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Request Details:</h3>
            <ul style="color: #333; font-size: 14px; line-height: 1.6;">
              <li><strong>Subject Code:</strong> ${requestData.subjectCode}</li>
              <li><strong>Faculty Code:</strong> ${requestData.facultyCode}</li>
              <li><strong>Date:</strong> ${requestData.date}</li>
              <li><strong>Time:</strong> ${requestData.timeFrom} to ${requestData.timeTo}</li>
              <li><strong>Reason:</strong> ${requestData.reason}</li>
              <li><strong>Enrollment Number:</strong> ${requestData.enrollmentNumber}</li>
            </ul>
          </div>
          
          <p style="color: #333; font-size: 16px;">Your On-Duty request is now approved. Please ensure you follow all institutional guidelines during your approved OD period.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
            <p style="margin: 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0;">OD Automation System</p>
            <p style="margin: 5px 0;">Coordinator Team</p>
          </div>
        </div>
      `
    });

    console.log(`Approval email sent successfully to ${studentEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
};

// Send rejection email to student
const sendRejectionEmail = async (studentEmail, requestData) => {
  try {
    console.log('Email service: Creating transporter for rejection email to:', studentEmail);
    const transporter = createTransporter();
    
    const emailSubject = `OD Request Rejected - ${requestData.subjectCode}`;
    
    console.log('Email service: Sending rejection email with subject:', emailSubject);
    
    const emailBody = `
Dear ${requestData.name},

Your OD request has been REJECTED by the coordinator.

Request Details:
• Subject Code: ${requestData.subjectCode}
• Faculty Code: ${requestData.facultyCode}
• Date: ${requestData.date}
• Time: ${requestData.timeFrom} to ${requestData.timeTo}
• Reason: ${requestData.reason}
• Enrollment Number: ${requestData.enrollmentNumber}

Your On-Duty request has been rejected. Please contact the coordinator for more information or submit a new request with corrected details.

Best regards,
OD Automation System
Coordinator Team
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      to: studentEmail,
      subject: emailSubject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin: 0; color: #721c24;">❌ OD Request REJECTED</h2>
          </div>
          
          <p style="color: #333; font-size: 16px;">Dear <strong>${requestData.name}</strong>,</p>
          
          <p style="color: #333; font-size: 16px;">Your OD request has been <strong>REJECTED</strong> by the coordinator.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #dc3545; margin-top: 0;">Request Details:</h3>
            <ul style="color: #333; font-size: 14px; line-height: 1.6;">
              <li><strong>Subject Code:</strong> ${requestData.subjectCode}</li>
              <li><strong>Faculty Code:</strong> ${requestData.facultyCode}</li>
              <li><strong>Date:</strong> ${requestData.date}</li>
              <li><strong>Time:</strong> ${requestData.timeFrom} to ${requestData.timeTo}</li>
              <li><strong>Reason:</strong> ${requestData.reason}</li>
              <li><strong>Enrollment Number:</strong> ${requestData.enrollmentNumber}</li>
            </ul>
          </div>
          
          <p style="color: #333; font-size: 16px;">Your On-Duty request has been rejected. Please contact the coordinator for more information or submit a new request with corrected details.</p>
          
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <p style="margin: 0; font-weight: bold;">Next Steps:</p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Contact the coordinator for clarification</li>
              <li>Review and correct your request details</li>
              <li>Submit a new request if needed</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
            <p style="margin: 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0;">OD Automation System</p>
            <p style="margin: 5px 0;">Coordinator Team</p>
          </div>
        </div>
      `
    });

    console.log(`Rejection email sent successfully to ${studentEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending rejection email:', error);
    return false;
  }
};

// Send report email to coordinator
const sendReportEmail = async (coordinatorEmail, reportData, customMessage, excelBuffer) => {
  try {
    console.log('Email service: Creating transporter for report email to:', coordinatorEmail);
    const transporter = createTransporter();
    
    const emailSubject = `OD Requests Report - ${new Date().toLocaleDateString()}`;
    
    console.log('Email service: Sending report email with subject:', emailSubject);
    
    const emailBody = `
Dear Coordinator,

Please find attached the approved OD requests report.

Report Summary:
• Total Approved Requests: ${reportData.totalRequests}
• Date Generated: ${new Date().toLocaleDateString()}
• Time Generated: ${new Date().toLocaleTimeString()}

${customMessage || 'This report contains all approved OD requests for the current period.'}

Best regards,
OD Automation System
    `;

    // Prepare email options with attachment if Excel buffer is provided
    const mailOptions = {
      from: process.env.EMAIL_USER || 'odautomation01@gmail.com',
      to: coordinatorEmail,
      subject: emailSubject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background-color: #cce5ff; color: #004085; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
            <h2 style="margin: 0; color: #004085;">📊 OD Requests Report Generated</h2>
          </div>
          
          <p style="color: #333; font-size: 16px;">Dear <strong>Coordinator</strong>,</p>
          
          <p style="color: #333; font-size: 16px;">Please find attached the approved OD requests report.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">Report Summary:</h3>
            <ul style="color: #333; font-size: 14px; line-height: 1.6;">
              <li><strong>Total Approved Requests:</strong> ${reportData.totalRequests}</li>
              <li><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</li>
              <li><strong>Time Generated:</strong> ${new Date().toLocaleTimeString()}</li>
            </ul>
          </div>
          
          ${customMessage ? `
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #ffeaa7;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">Custom Message:</h4>
            <p style="margin: 0; font-style: italic;">${customMessage}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #d1ecf1; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0; border: 1px solid #bee5eb;">
            <h4 style="margin: 0 0 10px 0; color: #0c5460;">Report Contents:</h4>
            <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #0c5460;">
              <li>Detailed list of all approved OD requests</li>
              <li>Student information and request details</li>
              <li>Time slot groupings and summaries</li>
              <li>Faculty code organization</li>
            </ul>
          </div>
          
          <p style="color: #333; font-size: 16px;">The Excel report is attached to this email. All approved and rejected requests have been processed and removed from the system.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
            <p style="margin: 0;"><strong>Best regards,</strong></p>
            <p style="margin: 5px 0;">OD Automation System</p>
            <p style="margin: 5px 0;">Coordinator Team</p>
          </div>
        </div>
      `
    };

    // Add attachment if Excel buffer is provided
    if (excelBuffer) {
      mailOptions.attachments = [
        {
          filename: `approved-od-requests-${new Date().toISOString().split('T')[0]}.xlsx`,
          content: excelBuffer
        }
      ];
    }

    await transporter.sendMail(mailOptions);

    console.log(`Report email sent successfully to ${coordinatorEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending report email:', error);
    return false;
  }
};

module.exports = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendReportEmail
};

console.log('Email service module exported successfully');

