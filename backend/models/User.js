// models/User.js
// This defines what a "User" looks like in the database.

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,   // no two users can have the same email
  },
  password: {
    type: String,
    required: true, // this will store the HASHED password, never plain text
  },
}, { timestamps: true }); // adds createdAt / updatedAt automatically

module.exports = mongoose.model('User', userSchema);