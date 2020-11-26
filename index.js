const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')

// Import Routes
const authRouter = require('./routes/auth');

const app = express();

dotenv.config();

// Connect to DB
const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(process.env.DB_CONNECT, connectOption)
  .then(
    () => { console.log("mongoDB connect is success") },
    err => { console.log('can\'t connect to mongoDB ', err) }
  )

// Middleware
app.use(express.json())

// Route middleware
app.use('/api/user', authRouter);

app.listen(3000, () => {
  console.log('Server up and running');
})