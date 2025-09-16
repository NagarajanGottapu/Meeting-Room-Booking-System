const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userService = require('../services/userService');
const { generateToken } = require('../utils/tokenUtils');
 
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log(name, email);

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const user = await User.findOne({ name, email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Protect routes
exports.protect = async (req, res, next) => {
  let token;
 
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
 
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
      // Get user from token
      req.user = await User.findById(decoded.id).select('-__v');
 
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
 
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};