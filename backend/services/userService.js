const User = require('../models/User');
 
exports.createUser = async (userData) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: userData.email });
 
    if (user) {
      return user;
    }
 
    // Create new user
    user = new User(userData);
    await user.save();
 
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
};
 
exports.getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error(`Error finding user: ${error.message}`);
  }
};
 
exports.getAllUsers = async () => {
  try {
    const users = await User.find({});
    return users;
  } catch (error) {
    throw new Error(`Error retrieving users: ${error.message}`);
  }
};
