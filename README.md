# 🎥 StreamHQ - Secure Video Streaming & Analysis Platform

A full-stack MERN application that enables secure video uploads, real-time content sensitivity analysis, and adaptive video streaming. This project features a multi-tenant architecture with role-based access control and a premium, responsive UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📸 Application Screenshots

### 1. Video Playing Output
The secure entry point featuring a cyberpunk-inspired glassmorphism UI. Users can register or login to their specific workspace.
<img width="100%" alt="Active Dashboard" src="https://github.com/user-attachments/assets/ebb31073-adec-4915-9a59-505a4c2aada7">

### 2. Content Library (Dashboard)
The main interface displaying the grid of uploaded videos. Features include status badges (Safe/Flagged), real-time processing indicators, and hover animations.
<img width="100%" alt="Login Screen" src="https://github.com/user-attachments/assets/a766d4cd-f729-43fd-b46a-5f9a897dc5d4">

### 3. Empty State & Upload
The initial view for new workspaces, featuring the drag-and-drop upload zone and a clean zero-data state.
<img width="100%" alt="Empty Dashboard" src="https://github.com/user-attachments/assets/d20a3c98-db32-4883-9427-70055700e314">

---

## ✨ Features

### 🚀 Core Functionality
* **Video Management:** Secure upload and storage of video content.
* **Real-Time Processing:** Live progress updates during video analysis using Socket.io.
* **Sensitivity Analysis:** Automated simulation that flags content as "Safe" or "Flagged" based on sensitivity.
* **Adaptive Streaming:** Seamless playback using HTTP Range Requests (206 Partial Content).
* **Multi-Tenancy:** Data isolation where users only see videos belonging to their Organization/Workspace.

### 🎨 User Interface
* **Modern Design:** High-end "Glassmorphism" aesthetic using Tailwind CSS.
* **Interactive UI:** Drag-and-drop uploads, animated cards, and ambient lighting effects.
* **Responsive:** Fully optimized for desktop and mobile devices.

### 🛡️ Security
* **RBAC (Role-Based Access Control):** Differentiates between Viewers and Admins.
* **JWT Authentication:** Secure stateless authentication.
* **Content Locking:** Automatically locks playback for flagged content for non-admin users.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite):** Fast, modern UI library.
* **Tailwind CSS:** Utility-first styling with custom animations.
* **Socket.io-client:** Real-time bi-directional communication.
* **Axios:** HTTP client with global interceptors for auth.

### Backend
* **Node.js & Express:** Scalable server-side runtime.
* **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
* **Socket.io:** Real-time event handling.
* **Multer:** Middleware for handling `multipart/form-data`.
* **JWT:** JSON Web Tokens for secure transmission of information.

---
##Frontend Setup
cd client

# Install dependencies
npm install

# Start the development server
npm run dev

##Backend Setup
cd server

# Install dependencies
npm install

# Create uploads directory (if not exists)
mkdir uploads

# Start the server
# (Ensure MongoDB is running locally or set MONGO_URI in a .env file)
npm run dev
# OR
node server.js

---
---

## 📂 Project Structure

```bash
video-streaming-app/
├── server/                 # Backend (Node/Express)
│   ├── config/             # DB and File configurations
│   ├── controllers/        # Logic for Auth and Videos
│   ├── middleware/         # Auth & Error Middleware
│   ├── models/             # Mongoose Schemas (User, Video)
│   ├── services/           # Video Processing Simulation
│   ├── uploads/            # Local video storage
│   └── server.js           # Entry point
│
└── client/                 # Frontend (React/Vite)
    ├── src/
    │   ├── components/     # Reusable UI (UploadForm, Player)
    │   ├── context/        # Auth & Global State
    │   ├── pages/          # Login & Dashboard Views
    │   └── main.jsx        # App Entry
    └── tailwind.config.js  # Styling Configuration
