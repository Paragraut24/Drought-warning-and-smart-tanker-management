#!/bin/bash

echo "🚀 JalRakshak AI - Setup and Test Script"
echo "========================================"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
else
    echo "✅ Backend dependencies already installed"
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "🗄️  Testing database connection..."
cd backend
node test-connection.js

echo ""
echo "🏘️  Checking villages in database..."
node test-villages.js

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd backend && npm start"
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
