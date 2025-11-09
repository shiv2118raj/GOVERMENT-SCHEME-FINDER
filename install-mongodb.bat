@echo off
echo ========================================
echo    MongoDB Installation Helper
echo ========================================
echo.

echo This script will help you install MongoDB on Windows.
echo.

echo Option 1: Download MongoDB Community Server
echo -------------------------------------------
echo 1. Go to: https://www.mongodb.com/try/download/community
echo 2. Select "Windows" and "msi" package
echo 3. Download and run the installer
echo 4. Choose "Complete" installation
echo 5. Install MongoDB as a Windows Service
echo.

echo Option 2: Use MongoDB Atlas (Cloud - Recommended for beginners)
echo ----------------------------------------------------------------
echo 1. Go to: https://www.mongodb.com/atlas
echo 2. Create a free account
echo 3. Create a new cluster (free tier available)
echo 4. Get your connection string
echo 5. Update backend\.env file with your connection string
echo.

echo Option 3: Use Chocolatey (if you have it installed)
echo ---------------------------------------------------
echo choco install mongodb
echo.

echo Option 4: Use Winget (Windows Package Manager)
echo ----------------------------------------------
echo winget install MongoDB.DatabaseTools
echo.

echo After installation, you can start MongoDB with:
echo net start MongoDB
echo.

echo Or if you prefer to start it manually:
echo "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
echo.

echo ========================================
echo    Quick Test
echo ========================================
echo.
echo After installing MongoDB, test the connection:
echo mongosh
echo.
echo If that works, you can start the SchemeSeva project with:
echo npm run dev
echo.

pause
