const jwt = require('jsonwebtoken');
 
/**
 * Generate JWT token for a user
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT token
 */
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};