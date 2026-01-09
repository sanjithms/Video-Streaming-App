const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const server = http.createServer(app);

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev, restrict in prod
    methods: ["GET", "POST"]
  }
});

// Pass 'io' to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Clients join a room named after their User ID for private notifications
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User joined room: ${userId}`);
  });

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));