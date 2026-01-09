const express = require('express');
const router = express.Router();
const { uploadVideo, getVideos, streamVideo } = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/', protect, getVideos);
router.get('/stream/:id', protect, streamVideo);

module.exports = router;