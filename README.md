# OD Automation System

A comprehensive web application for managing On-Duty (OD) requests in educational institutions. This system provides separate interfaces for students to submit OD requests and coordinators to manage and approve them.

## 🚀 Features

### For Students
- **Submit OD Requests**: Students can submit On-Duty requests with detailed information
- **View Request Status**: Track the status of submitted requests (Pending/Approved/Rejected)
- **Slot Selection**: Choose from available time slots for OD requests
- **Real-time Updates**: See immediate feedback on request submission
- **Multi-gap Support**: Automatically creates separate requests for multiple time periods
- **Form Validation**: Comprehensive input validation with auto-formatting

### For Coordinators
- **Authentication**: Secure login system with coordinator credentials
- **Request Management**: View, approve, and reject OD requests
- **Excel Export**: Download approved requests as Excel files
- **Email Export**: Send approved requests report via email with custom messages
- **Real-time Status Updates**: Instant feedback on actions taken

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling tool
- **Nodemailer**: Email sending functionality
- **ExcelJS**: Excel file generation
- **Express Session**: Session management
- **Bcrypt.js**: Password hashing for security

### Database
- **MongoDB**: Primary database for storing requests and coordinator information
- **Mongoose**: ODM for MongoDB interactions

### Email Service
- **Gmail SMTP**: Email delivery service
- **App Password Authentication**: Secure Gmail integration

## 📁 Project Structure

```
OD AUTOMATION/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── CoordinatorDashboard.js
│   │   │   ├── CoordinatorLogin.js
│   │   │   ├── EmailExportModal.js
│   │   │   ├── LandingPage.js
│   │   │   ├── ODRequestForm.js
│   │   │   └── StudentView.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   ├── export.js      # Export functionality
│   │   └── requests.js    # Request management
│   ├── models/            # Data models
│   │   ├── Coordinator.js # Coordinator model
│   │   └── ODRequest.js   # OD Request model
│   ├── scripts/           # Initialization scripts
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** - Download from [mongodb.com](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - Download from [code.visualstudio.com](https://code.visualstudio.com/)

### Quick Setup (Windows)
1. **Download and run** `setup.bat` file
2. **Start the application**: `npm run dev`
3. **Open browser**: http://localhost:3000

### Manual Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/vabbings/OD-AUTOMATION.git
cd OD-AUTOMATION
```

#### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

#### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/od-automation

PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### 4. Initialize Database
```bash
# Create coordinator account
npm run init-db
```

#### 5. Start the Application
```bash
# Start both client and server
npm run dev

# Or start individually
npm run server    # Backend only
npm run client    # Frontend only
```

### Troubleshooting

#### Port Already in Use
```bash
# Kill existing processes
taskkill /f /im node.exe

# Or change port in .env
PORT=5001
```

#### Dependencies Issues
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### PowerShell Issues
If you get `&&` command errors in PowerShell:
```powershell
# Use separate commands
npm install
cd client
npm install
cd ..
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Authentication

### Coordinator Login
- **URL**: http://localhost:3000/coordinator/login
- **Username**: `amity@admin`
- **Password**: `admin123`

## 📧 Email Configuration

The system uses Gmail SMTP for sending email reports. To configure:

1. Create a Gmail account for the application
2. Enable 2-factor authentication
3. Generate an App Password
4. Update the `.env` file with your credentials:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Email Features
- Send approved OD requests as Excel attachments
- Custom email messages
- Professional HTML email templates
- Automatic report generation

## 📊 API Endpoints

### Authentication
- `POST /api/login` - Coordinator login
- `POST /api/logout` - Coordinator logout
- `GET /api/check-auth` - Check authentication status

### Request Management
- `GET /api/requests` - Get all requests (Coordinator only)
- `POST /api/requests` - Submit new OD request (Public)
- `PUT /api/requests/:id/approve` - Approve request (Coordinator only)
- `PUT /api/requests/:id/reject` - Reject request (Coordinator only)

### Export Features
- `GET /api/export` - Download Excel file (Coordinator only)
- `POST /api/export-email` - Send email with Excel attachment (Coordinator only)

## 🎯 Key Features Explained

### 1. Student Request Submission
Students can submit OD requests by:
1. Filling out the request form with personal details
2. Selecting date and time range for the OD
3. System automatically calculates time gaps and creates separate requests
4. Submitting the request for coordinator review

### 2. Coordinator Dashboard
Coordinators can:
- View all pending, approved, and rejected requests
- Approve or reject requests with one click
- Export approved requests as Excel files
- Send approved requests via email with custom messages

### 3. Email Export System
- Generate Excel reports of approved requests
- Send reports via email with custom messages
- Professional email templates with attachments
- Secure Gmail authentication

### 4. Time Gap Calculation
- System automatically identifies time gaps within selected time range
- Creates separate requests for each time gap
- Supports multiple subject and faculty codes for multi-gap requests

## 🔒 Security Features

- **Session-based Authentication**: Secure coordinator access
- **Password Hashing**: Bcrypt.js for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error messages
- **CORS Configuration**: Secure cross-origin requests

## 📈 Data Storage

The system uses MongoDB for data storage with the following collections:

### OD Requests Collection
- **name**: Student's full name
- **enrollmentNumber**: Student enrollment number
- **subjectCode**: Subject code for the OD
- **facultyCode**: Faculty code for the subject
- **date**: Date of the OD
- **timeFrom**: Start time of the OD
- **timeTo**: End time of the OD
- **reason**: Reason for the OD
- **status**: Request status (Pending/Approved/Rejected)
- **createdAt**: Timestamp of request creation

### Coordinators Collection
- **username**: Coordinator username
- **password**: Hashed password
- **createdAt**: Timestamp of account creation

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
# Build the React app
cd client
npm run build

# Start the server
npm run server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Vaibhav Singh**
- GitHub: [@vabbings](https://github.com/vabbings)
- Project: [OD-AUTOMATION](https://github.com/vabbings/OD-AUTOMATION)

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainer

---

**Last Updated**: August 2025
**Version**: 2.0.0