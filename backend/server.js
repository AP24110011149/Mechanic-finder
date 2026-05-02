require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// 1. GLOBAL MIDDLEWARE (MUST BE FIRST)
app.use(cors());
app.use(express.json());

// 2. MODELS & AUTH
const User = require('./models/User');
const Mechanic = require('./models/Mechanic');
const { verifyToken } = require('./middleware/auth');

// 3. UNIFIED AUTH ROUTE
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    let profile;
    if (req.user.role === 'mechanic') {
      profile = await Mechanic.findById(req.user.id).select('-password');
    } else {
      profile = await User.findById(req.user.id).select('-password');
    }
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    
    const profileObj = profile.toObject();
    profileObj.role = req.user.role; // Force the role from the token
    res.json(profileObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3.1 UNIFIED PROFILE UPDATE
app.put('/api/auth/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, location, specialties } = req.body;
    let profile;
    const updateData = { name, phone, location };
    
    if (req.user.role === 'mechanic') {
      if (specialties) updateData.specialties = specialties;
      profile = await Mechanic.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    } else {
      profile = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    }
    
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. OTHER ROUTES
const userRoutes = require('./routes/userRoutes');
const mechanicRoutes = require('./routes/mechanicRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api/users', userRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/requests', requestRoutes);

// 5. SOCKET & SERVER
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
app.set('socketio', io);

io.on('connection', (socket) => {
  socket.on('join_room', (room) => socket.join(room));
});

// 6. DATABASE
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mechafind';
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB`);
    // await require('./seed')(); // Natural flow - no auto-seeding
  } catch (err) { console.error(err); }
};
connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
