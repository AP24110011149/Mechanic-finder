require('dotenv').config();
const mongoose = require('mongoose');
const Mechanic = require('./models/Mechanic');

const list = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mechafind';
    await mongoose.connect(uri);
    const mechanics = await Mechanic.find().limit(10);
    console.log('--- Sample Mechanics ---');
    mechanics.forEach(m => {
      console.log(`${m.name} | ${m.email}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

list();
