@echo off
echo Installing required dependencies for tubelight navbar...

cd frontend

echo Installing Tailwind CSS...
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo Installing framer-motion and lucide-react...
npm install framer-motion lucide-react

echo Installing clsx for className utilities...
npm install clsx

echo Dependencies installed successfully!
pause
