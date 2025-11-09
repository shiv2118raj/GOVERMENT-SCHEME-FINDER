@echo off
echo ========================================
echo    SchemeSeva Setup Test
echo ========================================
echo.

echo Testing Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo Testing MongoDB connection...
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found. Please install MongoDB first.
    echo Run: install-mongodb.bat for installation help
    pause
    exit /b 1
)
echo ✅ MongoDB is installed

echo.
echo Testing if MongoDB is running...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB is not running. Please start MongoDB:
    echo    net start MongoDB
    echo    OR
    echo    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
    pause
    exit /b 1
)
echo ✅ MongoDB is running

echo.
echo Testing project dependencies...
if not exist "node_modules" (
    echo ❌ Dependencies not installed. Run: npm install
    pause
    exit /b 1
)
echo ✅ Dependencies are installed

echo.
echo Testing backend dependencies...
if not exist "backend\node_modules" (
    echo ❌ Backend dependencies not installed. Run: npm install in backend folder
    pause
    exit /b 1
)
echo ✅ Backend dependencies are installed

echo.
echo Testing frontend dependencies...
if not exist "frontend\node_modules" (
    echo ❌ Frontend dependencies not installed. Run: npm install in frontend folder
    pause
    exit /b 1
)
echo ✅ Frontend dependencies are installed

echo.
echo ========================================
echo    All Tests Passed! ✅
echo ========================================
echo.
echo You can now start the project with:
echo   npm run dev
echo.
echo This will start both backend and frontend.
echo.
echo Access points:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5002
echo.
pause
