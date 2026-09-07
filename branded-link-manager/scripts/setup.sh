#!/bin/bash

set -e

echo "🚀 Setting up Branded Link Manager..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is required but not installed"
    exit 1
fi

echo "✅ Prerequisites met"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start infrastructure
echo "🐳 Starting infrastructure..."
docker-compose up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL..."
sleep 5

# Run migrations
echo "🗄️ Running database migrations..."
npm run db:migrate

# Seed data
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   npm run dev"
echo ""
echo "📚 Default login:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "🔧 Services:"
echo "   API: http://localhost:3000"
echo "   Redirect: http://localhost:3001"
echo "   Database: localhost:5432"
echo "   Redis: localhost:6379"
