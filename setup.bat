@echo off
echo Starting MechaFind Setup...
echo.
echo Installing Backend dependencies...
cd backend
call npm install
cd ..
echo.
echo Installing Frontend dependencies...
cd frontend
call npm install
cd ..
echo.
echo Setup Complete! You can now run the project.
pause
