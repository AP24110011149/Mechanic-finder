const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Mechanic = require('./models/Mechanic');
const User = require('./models/User');
const Request = require('./models/Request');

const firstNames = ['Rahul', 'Amit', 'Priya', 'Neha', 'Sanjay', 'Vikram', 'Anjali', 'Kiran', 'Raj', 'Ravi', 'Rakesh', 'Suresh', 'Manoj', 'Deepak', 'Arjun'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Reddy', 'Rao', 'Das', 'Joshi', 'Chauhan', 'Yadav', 'Mehta', 'Nair', 'Bose', 'Verma'];
const specialtiesPool = ['Engine Repair', 'Brake Systems', 'Electrical', 'Oil Change', 'Diagnostics', 'Tires', 'Transmission', 'Suspension'];

const cities = [
  { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Visakhapatnam, AP', lat: 17.6868, lng: 83.2185 },
  { name: 'Vijayawada, AP', lat: 16.5062, lng: 80.6480 },
  { name: 'Guntur, AP', lat: 16.3067, lng: 80.4365 },
  { name: 'Tirupati, AP', lat: 13.6288, lng: 79.4192 }
];

async function seedMechanics() {
  try {

    // 1. Clear existing data
    await Mechanic.deleteMany({});
    await User.deleteMany({});
    await Request.deleteMany({});
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // 2. Create a dummy Test User
    const testUser = await User.create({
      name: 'Test Pilot',
      email: 'user@example.com',
      password: hashedPassword,
      phone: '9876543210',
      location: 'Andhra Pradesh'
    });
    console.log('Test User created: user@example.com / password123');

    console.log('Seeding 100 Indian mechanics across multiple regions...');
    const mechanicsData = [];
    for (let i = 0; i < 100; i++) {
      let fname, lname, email;
      if (i === 0) {
        fname = "Rahul";
        lname = "Mehta";
        email = "mechanic0@example.com";
      } else {
        fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        email = `mechanic${i}@example.com`;
      }
      
      const specialties = specialtiesPool.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      mechanicsData.push({
        name: `${fname} ${lname}`,
        email: email,
        password: hashedPassword,
        specialties: specialties,
        location: {
          lat: city.lat + (Math.random() * 0.1 - 0.05),
          lng: city.lng + (Math.random() * 0.1 - 0.05),
          address: `${Math.floor(Math.random() * 2000) + 1} Street, ${city.name} Region`
        },
        rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        availability: true
      });
    }
    const createdMechanics = await Mechanic.insertMany(mechanicsData);
    console.log('100 Mechanics seeded successfully!');

    // 4. Create 5 Sample Requests
    console.log('Seeding 5 sample requests...');
    const requestsData = [];
    for (let i = 0; i < 5; i++) {
      const randomMech = createdMechanics[Math.floor(Math.random() * createdMechanics.length)];
      requestsData.push({
        user: testUser._id,
        mechanic: randomMech._id,
        issueDescription: i === 0 ? "Brake failure on highway" : "General engine checkup",
        vehicleInfo: i % 2 === 0 ? "Toyota Fortuner" : "Honda City",
        location: randomMech.location.address,
        status: i === 0 ? 'pending' : (i < 3 ? 'accepted' : 'completed'),
        isEmergency: i === 0
      });
    }
    await Request.insertMany(requestsData);
    console.log('5 sample requests seeded successfully!');

  } catch (err) {
    console.error('Error during seeding:', err);
  }
}

module.exports = seedMechanics;
