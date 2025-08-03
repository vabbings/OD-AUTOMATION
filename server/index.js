const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'od-automation-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// In-memory storage for development (replace with MongoDB later)
global.requests = [];
global.requestId = 1;

// MongoDB Connection (commented out for now)
/*
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/od-automation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error.message);
  console.log('Please make sure MongoDB is running or update MONGODB_URI in .env file');
});

const db = mongoose.connection;
db.on('error', (error) => {
  console.error('MongoDB connection error:', error.message);
});
db.once('open', () => {
  console.log('Connected to MongoDB');
});
*/

// Import routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const exportRoutes = require('./routes/export');

// Use routes
app.use('/api', authRoutes);
app.use('/api', requestRoutes);
app.use('/api', exportRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Using in-memory storage for development');
}); 