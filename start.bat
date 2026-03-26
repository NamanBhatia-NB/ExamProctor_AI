@echo off
echo ========================================
echo ExamProctor AI - Starting Services
echo ========================================
echo.

echo Starting AI Service...
start "AI Service" cmd /k "cd ai-service && python -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo Services are starting...
echo ========================================
echo.
echo AI Service: http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to open browser...
pause > nul

start http://localhost:3000

echo.
echo To stop services, close the terminal windows
echo.
