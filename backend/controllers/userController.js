const userService = require('../services/userService');
 
// Create a new user or get existing
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
 
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
 
    const user = await userService.createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
 
// Get a user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
 
    const user = await userService.getUserByEmail(email);
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
 
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};