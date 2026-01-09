const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { processVideo } = require('../services/videoProcessor');

// Upload Video
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const newVideo = new Video({
      title: req.body.title,
      filename: req.file.filename,
      filePath: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedBy: req.user.id,
      organizationId: req.user.organizationId
    });

    await newVideo.save();

    // Trigger async processing
    processVideo(newVideo._id, req.io, req.user.id);

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Videos (Multi-tenant)
exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ organizationId: req.user.organizationId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Stream Video (Range Requests)
exports.streamVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    // Security Checks
    if (!video || video.organizationId !== req.user.organizationId) {
      return res.status(403).send('Access Denied');
    }
    
    // Sensitivity Check
    if (video.sensitivityStatus === 'flagged' && req.user.role !== 'admin') {
      return res.status(403).send('Content flagged as sensitive.');
    }

    const stat = fs.statSync(video.filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(video.filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      };
      res.writeHead(200, head);
      fs.createReadStream(video.filePath).pipe(res);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Streaming Error');
  }
};