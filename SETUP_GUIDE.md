# Complete Setup & Deployment Guide

## Construction AI App - Full Stack Application

This guide covers complete setup for web, mobile (APK), and backend deployment.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend (Web) Setup](#frontend-web-setup)
4. [Mobile (Android APK) Setup](#mobile-android-apk-setup)
5. [Deployment](#deployment)
6. [API Documentation](#api-documentation)

---

## Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **MongoDB** (Local or Cloud - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Java Development Kit (JDK)** 11+ (for Android APK)
- **Android SDK** (for Android APK)
- **Git**

### Get API Keys
- **OpenAI API Key**: [Get here](https://platform.openai.com/api-keys)
- **MongoDB Connection String**: If using MongoDB Atlas

### Installation Verification
```bash
node --version          # Should be v18+
npm --version           # Should be v9+
java -version           # Should be 11+
```

---

## Backend Setup

### 1. Clone & Navigate
```bash
git clone https://github.com/mohanadyoussefmy-png/construction-ai-app.git
cd construction-ai-app/packages/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/construction-ai
# OR for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/construction-ai
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
OPENAI_API_KEY=sk-your-openai-key-here
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=50000000
UPLOAD_DIR=./uploads
```

### 4. Create MongoDB Database

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is running
mongod

# Create database (automatic on first insert)
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at [mongodb.com](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 5. Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

Expected output:
```
Server running on port 5000
MongoDB connected
Environment: development
```

✅ Backend is now running at `http://localhost:5000`

---

## Frontend (Web) Setup

### 1. Navigate to Frontend
```bash
cd construction-ai-app/packages/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` file:
```bash
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Development Server
```bash
npm run dev
```

Expected output:
```
  ➜  Local:   http://localhost:3000/
```

✅ Frontend is now running at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build

# Preview production build
npm run preview
```

Output: `dist/` folder with optimized build

---

## Mobile (Android APK) Setup

### 1. Prerequisites for Android
```bash
# Install Java
# Download JDK 11+
# Set JAVA_HOME environment variable

# Android SDK Setup
# Option 1: Android Studio (easiest)
# Option 2: Command line tools
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 2. Navigate to Mobile
```bash
cd construction-ai-app/packages/mobile
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Environment Setup
Create `.env`:
```
REACT_APP_API_URL=http://your-backend-url/api
# For development: http://10.0.2.2:5000/api (emulator)
```

### 5. Check Project Health
```bash
npx react-native doctor
```

Fix any issues reported.

### 6. Build APK

**Option A: Using NPM Script (Easiest)**
```bash
npm run build:apk
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

**Option B: Using Gradle Manually**
```bash
cd android
./gradlew assembleRelease
cd ..
```

**Option C: Using Android Studio**
1. Open `packages/mobile/android` in Android Studio
2. Build → Build Bundle(s)/APK(s) → Build APK(s)
3. Find APK in `android/app/build/outputs/apk/release/`

### 7. Install on Device

**Using ADB (USB Debugging)**
```bash
adb devices                          # List connected devices
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Using Emulator**
```bash
emulator -avd Pixel_API_30          # Start emulator
npm run android                     # Install on emulator
```

**Manual Installation**
1. Transfer APK to device
2. Open file manager
3. Tap APK to install
4. Grant permissions when prompted

---

## Deployment

### Backend Deployment (Heroku/Railway/Render)

#### Using Railway
1. Connect GitHub repo
2. Create new project
3. Add MongoDB plugin
4. Add environment variables
5. Deploy automatically from main branch

#### Using Render.com
1. Connect GitHub
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add MongoDB URL in environment
6. Deploy

#### Using AWS
1. Create EC2 instance (Node.js AMI)
2. SSH into instance
3. Clone repo and setup
4. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name "construction-api"
pm2 startup
pm2 save
```

### Frontend Deployment (Vercel/Netlify)

#### Using Vercel
```bash
npm install -g vercel
vercel
```

#### Using Netlify
1. Build locally: `npm run build`
2. Deploy `dist/` folder
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Mobile Distribution

#### Google Play Store
1. Create Google Play Developer account ($25 one-time)
2. Sign APK with release keystore
3. Upload to Google Play Console
4. Fill app details, screenshots, description
5. Submit for review (24-48 hours)

#### Firebase App Distribution
```bash
npm install -g @react-native-firebase/cli
firebase app:distribute packages/mobile/android/app/build/outputs/apk/release/app-release.apk
```

---

## API Documentation

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "crew"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "user": {...},
  "token": "eyJhbGc..."
}
```

### Projects

**Get All Projects**
```http
GET /api/projects
Authorization: Bearer {token}
```

**Create Project**
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Downtown Office Building",
  "description": "Modern office construction",
  "client": "ABC Corp",
  "address": "123 Main St",
  "budget": 500000,
  "startDate": "2024-01-15",
  "endDate": "2024-12-31"
}
```

### Tasks

**Get Tasks**
```http
GET /api/tasks?projectId={projectId}&status=pending
Authorization: Bearer {token}
```

**Create Task**
```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Install electrical wiring",
  "description": "Install all electrical systems",
  "project": "{projectId}",
  "priority": "high",
  "dueDate": "2024-02-15"
}
```

### Voice Reports

**Transcribe Audio**
```http
POST /api/voice/transcribe
Authorization: Bearer {token}
Content-Type: multipart/form-data

[Form Data]
audio: <audio-file.m4a>
```

**Create Voice Report**
```http
POST /api/voice/reports
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Installed new beams on floor 3. Complete by Friday.",
  "project": "{projectId}",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "123 Main St"
  }
}
```

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Failed**
```
Error: connect ECONNREFUSED
```
Solution: Ensure MongoDB is running or check MONGODB_URI

**Port 5000 Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Frontend Issues

**Vite Port Conflict**
```bash
# Use different port
npm run dev -- --port 3001
```

**API Connection Issues**
- Check backend is running
- Verify VITE_API_URL in `.env`
- Check CORS settings in backend

### Mobile APK Issues

**"Gradle Build Failed"**
```bash
cd packages/mobile
rm -rf android/build
./gradlew clean
cd ../..
npm run build:apk
```

**"Android SDK Not Found"**
```bash
# Set Android SDK path
export ANDROID_SDK_ROOT=~/Android/Sdk
export ANDROID_HOME=~/Android/Sdk
npm run build:apk
```

**App Crashes on Launch**
- Check backend URL in `.env`
- Ensure backend is accessible
- Check device logs: `adb logcat`

---

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload in browser
- Backend: Use `npm run dev` with nodemon
- Mobile: Use React Native Fast Refresh

### Debugging

**Backend**
```bash
# Enable detailed logs
DEBUG=* npm run dev
```

**Frontend**
- Chrome DevTools: Open browser console (F12)
- React DevTools extension

**Mobile**
```bash
adb logcat | grep "React"
```

### Database Queries
```bash
# MongoDB shell
mongosh "mongodb://localhost:27017/construction-ai"

# View collections
show collections

# View documents
db.projects.find().pretty()
```

---

## Support & Resources

- **Documentation**: See `/docs` folder
- **API Docs**: `http://localhost:5000/api/docs` (when available)
- **Issues**: GitHub Issues tab
- **Discord**: [Join community]()

---

## License

MIT License - See LICENSE file

---

**Last Updated**: 2024
**Version**: 1.0.0
