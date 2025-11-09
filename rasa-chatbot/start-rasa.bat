@echo off
echo Starting Rasa Chatbot Services...
echo.

echo Step 1: Training the model...
rasa train

echo.
echo Step 2: Starting Action Server...
echo Open a new terminal and run: rasa run actions --port 5055
echo.

echo Step 3: Starting Rasa Server...
echo After action server is running, execute: rasa run --enable-api --cors "*" --port 5005
echo.

echo Both services need to be running for the chatbot to work with the backend.
pause
