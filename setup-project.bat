@echo off
echo ========================================
echo    SchemeSeva Project Setup Script
echo ========================================
echo.

echo Step 1: Creating environment file...
echo # SchemeSeva Backend Environment Configuration > backend\.env
echo. >> backend\.env
echo # MongoDB Configuration >> backend\.env
echo MONGODB_URI=mongodb://localhost:27017/scheme-seva >> backend\.env
echo MONGO_URI=mongodb://localhost:27017/scheme-seva >> backend\.env
echo. >> backend\.env
echo # JWT Secret for authentication >> backend\.env
echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production >> backend\.env
echo. >> backend\.env
echo # Google OAuth Configuration >> backend\.env
echo GOOGLE_CLIENT_ID=your-google-client-id >> backend\.env
echo. >> backend\.env
echo # Meri Pehchaan API Configuration >> backend\.env
echo MERIPEHCHAAN_CLIENT_ID=your-meripehchaan-client-id >> backend\.env
echo MERIPEHCHAAN_CLIENT_SECRET=your-meripehchaan-client-secret >> backend\.env
echo. >> backend\.env
echo # Server Configuration >> backend\.env
echo PORT=5002 >> backend\.env
echo NODE_ENV=development >> backend\.env

echo Step 2: Installing root dependencies...
call npm install

echo Step 3: Installing backend dependencies...
cd backend
call npm install
cd ..

echo Step 4: Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo Step 5: Installing AI chatbot dependencies...
cd ai-chatbot
call npm install
cd ..

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Make sure MongoDB is running on your system
echo 2. Run: npm run dev (to start both backend and frontend)
echo 3. Or run: npm run start-backend (to start only backend)
echo 4. Or run: npm run start-frontend (to start only frontend)
echo.
echo The application will be available at:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:5002
echo - Health Check: http://localhost:5002/health
echo.
pause
