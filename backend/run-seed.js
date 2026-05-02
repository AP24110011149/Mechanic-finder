require('dotenv').config();
const mongoose = require('mongoose');
const seedMechanics = require('./seed');

const run = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mechafind';
    await mongoose.connect(uri);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data to ensure password123 works
    const Mechanic = require('./models/Mechanic');
    const User = require('./models/User');
    const Request = require('./models/Request');
    
    console.log('Clearing old data...');
    await Mechanic.deleteMany({});
    await User.deleteMany({});
    await Request.deleteMany({});
    
    await seedMechanics();
    console.log('Seeding finished.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

run();
