const express = require('express');
const router = express.Router();
const Mechanic = require('../models/Mechanic');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, verifyToken, isMechanic } = require('../middleware/auth');

// Register a new mechanic
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, specialties, location } = req.body;
    
    const existingMechanic = await Mechanic.findOne({ email });
    if (existingMechanic) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const mechanic = new Mechanic({ 
      name, 
      email, 
      password: hashedPassword, 
      phone: phone || '',
      specialties: specialties || ["General Mechanic"],
      location: location || { lat: 20.5937, lng: 78.9629, address: "India (Wide)" }
    });
    await mechanic.save();

    const token = jwt.sign({ id: mechanic._id, role: 'mechanic' }, JWT_SECRET, { expiresIn: '2h' });

    res.status(201).json({ message: 'Mechanic registered successfully', token, mechanic: { id: mechanic._id, name: mechanic.name, email: mechanic.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login mechanic
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const mechanic = await Mechanic.findOne({ email });
    if (!mechanic) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, mechanic.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: mechanic._id, role: 'mechanic' }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, mechanic: { id: mechanic._id, name: mechanic.name, email: mechanic.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all mechanics (Public)
router.get('/', async (req, res) => {
  try {
    const mechanics = await Mechanic.find().select('-password');
    res.json(mechanics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get mechanic profile (Protected)
router.get('/me', verifyToken, isMechanic, async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.user.id).select('-password');
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
