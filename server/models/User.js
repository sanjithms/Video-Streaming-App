const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['viewer', 'editor', 'admin'], default: 'editor' },
  organizationId: { type: String, required: true } // For Multi-tenancy
});

module.exports = mongoose.model('User', UserSchema);