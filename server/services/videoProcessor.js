const Video = require('../models/Video');

// Simulates an AI Sensitivity Analysis Pipeline
const processVideo = async (videoId, io, userId) => {
  try {
    const video = await Video.findById(videoId);
    if (!video) return;

    video.processingStatus = 'processing';
    await video.save();

    // Notify start
    io.to(userId).emit('video_update', { videoId, status: 'processing', progress: 0 });

    // Simulate progress (20% increments every second)
    for (let i = 20; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      video.progress = i;
      await video.save();
      
      io.to(userId).emit('video_update', { 
        videoId, 
        status: 'processing', 
        progress: i 
      });
    }

    // Determine Sensitivity (Mock Logic: 30% chance of being flagged)
    const isSafe = Math.random() > 0.3; 
    
    video.processingStatus = 'completed';
    video.sensitivityStatus = isSafe ? 'safe' : 'flagged';
    await video.save();

    io.to(userId).emit('video_update', { 
      videoId, 
      status: 'completed', 
      progress: 100,
      sensitivity: video.sensitivityStatus 
    });

  } catch (error) {
    console.error("Processing Error:", error);
    io.to(userId).emit('video_error', { videoId, error: 'Processing Failed' });
  }
};

module.exports = { processVideo };