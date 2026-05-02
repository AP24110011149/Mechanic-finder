const jwt = require('jsonwebtoken');

// Secret key should ideally be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_mechafind';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log('--- Incoming Token ---', token ? 'Present' : 'Missing');

  if (!token) {
    return res.status(403).json({ error: 'A token is required for authentication' });
  }

  try {
    const tokenBody = token.split(' ')[1]; // Format: "Bearer <token>"
    const decoded = jwt.verify(tokenBody, JWT_SECRET);
    console.log('--- Decoded User ---', decoded.id, decoded.role);
    req.user = decoded; // { id, role }
  } catch (err) {
    console.error('--- JWT Error ---', err.message);
    return res.status(401).json({ error: 'Invalid Token' });
  }
  return next();
};

const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    return next();
  }
  return res.status(403).json({ error: 'User access required' });
};

const isMechanic = (req, res, next) => {
  if (req.user && req.user.role === 'mechanic') {
    return next();
  }
  return res.status(403).json({ error: 'Mechanic access required' });
};

module.exports = {
  verifyToken,
  isUser,
  isMechanic,
  JWT_SECRET
};
