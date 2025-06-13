@echo off
set /p CONNECTION_STRING="Enter your Neon connection string: "
echo DATABASE_URL="%CONNECTION_STRING%" > .env
echo Environment variables updated!
pause 