#!/bin/bash

# Backend
echo "Starting backend server..."
cd BACKEND
npm install
npm start &

# Frontend
echo "Starting frontend server..."
cd ../FRONTEND
npm install
npm start &

# Database setup
echo "Setting up the database..."
mysql -u $your_username -p $your_password < ../bd_app_script.sql
echo "Project is running. Open your browser and visit http://localhost:5500"

# Keep the script running
wait