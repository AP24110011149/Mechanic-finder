const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { verifyToken, isUser, isMechanic } = require('../middleware/auth');

// Create a new request (User only)
router.post('/', verifyToken, isUser, async (req, res) => {
  try {
    const { mechanicId, issueDescription, vehicleInfo, location, isEmergency } = req.body;
    
    const newRequest = new Request({
      user: req.user.id,
      mechanic: mechanicId || null,
      issueDescription,
      vehicleInfo,
      location,
      status: 'pending',
      isEmergency: isEmergency || false
    });
    
    await newRequest.save();
    
    // Emit socket event
    const io = req.app.get('socketio');
    if (newRequest.isEmergency) {
      io.emit('emergency_request', newRequest);
    } else if (newRequest.mechanic) {
      io.to(newRequest.mechanic.toString()).emit('new_request', newRequest);
    }

    res.status(201).json({ message: 'Request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all requests for logged-in user
router.get('/user', verifyToken, isUser, async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id }).populate('mechanic', 'name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending/incoming requests for all mechanics (or specifically assigned ones)
router.get('/mechanic/pending', verifyToken, isMechanic, async (req, res) => {
  try {
    // A request is incoming if it's pending and either unassigned OR assigned to this mechanic
    const requests = await Request.find({ 
      status: 'pending',
      $or: [{ mechanic: null }, { mechanic: req.user.id }] 
    }).populate('user', 'name email phone');
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get active/completed requests assigned to the logged-in mechanic
router.get('/mechanic', verifyToken, isMechanic, async (req, res) => {
  try {
    const requests = await Request.find({ mechanic: req.user.id }).populate('user', 'name email phone');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update request status (Mechanic only)
router.put('/:id/status', verifyToken, isMechanic, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // If accepting, assign to this mechanic
    if (status === 'accepted') {
      request.mechanic = req.user.id;
    }

    request.status = status;
    await request.save();

    // Emit socket event
    const io = req.app.get('socketio');
    io.to(request.user.toString()).emit('request_updated', request);

    res.json({ message: 'Status updated successfully', request });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
