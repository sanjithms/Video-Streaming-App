const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organizationId: { type: String, required: true },
  
  // Processing State
  processingStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'], 
    default: 'pending' 
  },
  sensitivityStatus: { 
    type: String, 
    enum: ['analyzing', 'safe', 'flagged'], 
    default: 'analyzing' 
  },
  progress: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', VideoSchema);