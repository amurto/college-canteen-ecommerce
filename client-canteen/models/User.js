const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  designation: {
    type: String
  },
  rollno: {
    type: Number
  },
  branch: {
    type: String
  },
  year: {
    type: String
  },
  role: {
    type: String
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;