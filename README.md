# OD Automation System

A comprehensive web application for managing On-Duty (OD) requests in educational institutions. This system provides separate interfaces for students to submit OD requests and coordinators to manage and approve them.

## 🚀 Features

### For Students
- **Submit OD Requests**: Students can submit On-Duty requests with detailed information
- **View Request Status**: Track the status of submitted requests (Pending/Approved/Rejected)
- **Slot Selection**: Choose from available time slots for OD requests
- **Real-time Updates**: See immediate feedback on request submission

### For Coordinators
- **Authentication**: Secure login system with coordinator credentials
- **Request Management**: View, approve, and reject OD requests
- **Slot Management**: Create and manage available time slots
- **Excel Export**: Download approved requests as Excel files
- **Email Export**: Send approved requests report via email with custom messages
- **Slot Deletion**: Remove slots when no longer needed (with safety checks)

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Nodemailer**: Email sending functionality
- **ExcelJS**: Excel file generation
- **Express Session**: Session management

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
│   │   ├── requests.js    # Request management
│   │   └── slots.js       # Slot management
│   ├── models/            # Data models
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/vabbings/OD-AUTOMATION.git
cd OD-AUTOMATION
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Gmail)
EMAIL_USER=odautomation01@gmail.com
EMAIL_PASS=mvrh ylun pkxh gtnz
```

### 4. Start the Application
```bash
# Start both client and server
npm run dev

# Or start individually
npm run server    # Backend only
npm run client    # Frontend only
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔐 Authentication

### Coordinator Login
- **URL**: http://localhost:3000/coordinator
- **Password**: `admin123`

## 📧 Email Configuration

The system uses Gmail SMTP for sending email reports. The current configuration uses:
- **Email**: odautomation01@gmail.com
- **App Password**: mvrh ylun pkxh gtnz

### Email Features
- Send approved OD requests as Excel attachments
- Custom email messages
- Professional HTML email templates
- Automatic report generation

## 📊 API Endpoints

### Authentication
- `POST /api/login` - Coordinator login
- `POST /api/logout` - Coordinator logout

### Slots Management
- `GET /api/slots` - Get all available slots
- `POST /api/slots` - Create new slot (Coordinator only)
- `DELETE /api/slots/:id` - Delete slot (Coordinator only)

### Request Management
- `GET /api/requests` - Get all requests
- `POST /api/requests` - Submit new OD request
- `PUT /api/requests/:id/approve` - Approve request (Coordinator only)
- `PUT /api/requests/:id/reject` - Reject request (Coordinator only)

### Export Features
- `GET /api/export` - Download Excel file (Coordinator only)
- `POST /api/export-email` - Send email with Excel attachment (Coordinator only)

## 🎯 Key Features Explained

### 1. Student Request Submission
Students can submit OD requests by:
1. Filling out the request form with personal details
2. Selecting an available time slot
3. Submitting the request for coordinator review

### 2. Coordinator Dashboard
Coordinators can:
- View all pending, approved, and rejected requests
- Approve or reject requests with one click
- Create new time slots for students
- Delete slots when no longer needed
- Export data in multiple formats

### 3. Email Export System
- Generate Excel reports of approved requests
- Send reports via email with custom messages
- Professional email templates with attachments
- Secure Gmail authentication

### 4. Slot Management
- Create slots with specific dates and times
- Automatic slot availability tracking
- Safety checks prevent deletion of slots with pending requests
- Real-time slot status updates

## 🔒 Security Features

- **Session-based Authentication**: Secure coordinator access
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error messages
- **CORS Configuration**: Secure cross-origin requests

## 📈 Data Storage

Currently uses in-memory storage for development. The system is designed to easily integrate with:
- MongoDB
- PostgreSQL
- MySQL
- Any other database system

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

**Last Updated**: January 2025
**Version**: 1.0.0 