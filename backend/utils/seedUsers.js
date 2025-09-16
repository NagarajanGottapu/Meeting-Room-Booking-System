const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

// Connect to database
connectDB();

// Sample user data - matching your schema (only name and email)
const users = [
  {
    name: 'Prasanna Vathana',
    email: 'prasannavathana33@gmail.com'
  },
  {
    name: 'Revanth',
    email: 'stexrevnish@gmail.com'
  },
  {
    name: 'Uma',
    email: 'umamani684@gmail.com'
  }
];

// Seed data function
const seedUsers = async () => {
  try {
    // Delete existing users
    await User.deleteMany({});
    console.log('Users deleted');

    // Create users
    const createdUsers = await User.insertMany(users);

    console.log('Users created:');
    console.log(createdUsers.map(user => ({ name: user.name, email: user.email })));

    console.log('Sample users seeded successfully');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUsers();