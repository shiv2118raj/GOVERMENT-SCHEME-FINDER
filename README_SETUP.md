# 🚀 SchemeSeva Project Setup Guide

## Overview
SchemeSeva is a comprehensive government scheme management system with the following components:
- **Backend**: Node.js/Express API server with MongoDB
- **Frontend**: React.js application
- **AI Chatbot**: Interactive chatbot for form filling
- **RASA Chatbot**: Advanced conversational AI

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher) - ✅ Already installed
2. **MongoDB** - ❌ Needs to be installed
3. **Git** - ✅ Already installed

## Installation Options

### Option 1: Install MongoDB Locally (Recommended)

#### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. Start MongoDB service:
   ```cmd
   net start MongoDB
   ```

#### Alternative - Use MongoDB Atlas (Cloud):
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `backend/.env` file with your Atlas connection string

### Option 2: Use Docker (If you have Docker installed)
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Quick Start

### 1. Install Dependencies
```bash
# Run the setup script
.\setup-project.bat

# Or manually:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ../ai-chatbot && npm install
```

### 2. Start MongoDB
- **Local**: Make sure MongoDB service is running
- **Atlas**: Use your cloud connection string

### 3. Start the Application

#### Option A: Start Everything Together
```bash
npm run dev
```

#### Option B: Start Backend and Frontend Separately
```bash
# Terminal 1 - Backend
npm run start-backend

# Terminal 2 - Frontend  
npm run start-frontend
```

## Access Points

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5002
- **Health Check**: http://localhost:5002/health
- **Admin Dashboard**: http://localhost:3000/admin

## Default Login Credentials

- **Admin**: 
  - Email: `kishu@gmail.com`
  - Password: `123`

- **Regular User**: Register through the frontend

## Features

### 🎯 Core Features
- User registration and authentication
- Government scheme browsing and search
- Application submission and tracking
- Document upload and verification
- Admin dashboard for scheme management

### 🤖 AI Features
- Interactive chatbot for form filling
- OCR document processing
- Smart form auto-fill
- Document validation

### 📱 User Interface
- Responsive design
- Multi-language support
- Dark/Light theme toggle
- Real-time notifications

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running: `mongod --version`
2. Check if port 27017 is available
3. Verify connection string in `backend/.env`

### Port Conflicts
- Backend uses port 5002
- Frontend uses port 3000
- Change ports in respective config files if needed

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
SchemeSeva/
├── backend/           # Node.js API server
├── frontend/          # React.js application
├── ai-chatbot/        # AI chatbot service
├── rasa-chatbot/      # RASA conversational AI
├── uploads/           # File uploads directory
└── docs/             # Documentation
```

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Database Seeding
```bash
cd backend
npm run seed
```

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check port availability

## Next Steps

1. Install MongoDB (local or Atlas)
2. Run `npm run dev`
3. Open http://localhost:3000
4. Register or login with admin credentials
5. Explore the features!

---

**Happy Coding! 🎉**
