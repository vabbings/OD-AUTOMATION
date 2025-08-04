require('dotenv').config();
const mongoose = require('mongoose');
const Coordinator = require('../models/Coordinator');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/od-automation', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  createCoordinator();
}).catch((error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
});

async function createCoordinator() {
  try {
    // Check if coordinator already exists
    const existingCoordinator = await Coordinator.findOne({ username: 'amity@admin' });
    
    if (existingCoordinator) {
      console.log('Coordinator account already exists');
    } else {
      // Create new coordinator
      const coordinator = new Coordinator({
        username: 'amity@admin',
        password: 'admin123'
      });
      
      await coordinator.save();
      console.log('Coordinator account created successfully');
    }
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error creating coordinator account:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}