const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5001;

app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting server: ${err.message}`);
    return;
  }
  console.log(`Server running on port ${PORT}`);
});