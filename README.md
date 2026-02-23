# Preventive Water Governance Intelligence Platform

A full-stack web application for dynamic water resource management, drought prediction, and intelligent tanker allocation.

## Tech Stack

### Backend
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- REST API

### Frontend
- React (Vite)
- Tailwind CSS (Claymorphic Design)
- Framer Motion
- Recharts
- Google Maps API
- Axios

## Features

### 1. Dynamic Drought Intelligence Engine
- Real-time rainfall deviation calculation
- Groundwater trend analysis using linear regression
- Severity classification (Normal/Alert/Critical)
- No hardcoded data - all calculations at runtime

### 2. Water Stress Index (WSI)
- Configurable weight-based scoring
- Components: Rainfall (35%), Groundwater (30%), Population (20%), Storage (15%)
- Dynamic recalculation on data updates
- Critical village identification

### 3. Predictive Tanker Demand
- Population-based demand calculation (55L per capita)
- WSI-adjusted predictions
- Weekly and monthly forecasts
- Storage deficit analysis

### 4. Smart Tanker Allocation
- Priority-based allocation algorithm
- Real-time tanker availability tracking
- Automated assignment based on WSI, population, and storage

### 5. Route Optimization
- Nearest-neighbor algorithm
- Distance and time estimation
- Dynamic route calculation

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```cmd
cd backend
```

2. Install dependencies:
```cmd
npm install
```

3. Create `.env` file:
```cmd
copy .env.example .env
```

4. Configure `.env`:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=water_governance
JWT_SECRET=your_secret_key

WSI_RAINFALL_WEIGHT=0.35
WSI_GROUNDWATER_WEIGHT=0.30
WSI_POPULATION_WEIGHT=0.20
WSI_STORAGE_WEIGHT=0.15

DAILY_WATER_PER_CAPITA=55
HIGH_WSI_THRESHOLD=70
HIGH_WSI_ADJUSTMENT=1.20
```

5. Create MySQL database:
```sql
CREATE DATABASE water_governance;
```

6. Start server:
```cmd
npm start
```

Server runs on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```cmd
cd frontend
```

2. Install dependencies:
```cmd
npm install
```

3. Create `.env` file:
```cmd
copy .env.example .env
```

4. Configure `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

5. Start development server:
```cmd
npm run dev
```

Frontend runs on http://localhost:3000

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Villages
- `GET /api/villages` - Get all villages
- `POST /api/villages` - Create village
- `PUT /api/villages/:id` - Update village

### Data Upload
- `POST /api/data/rainfall` - Add rainfall record
- `POST /api/data/rainfall/bulk` - Bulk upload rainfall
- `POST /api/data/groundwater` - Add groundwater record
- `POST /api/data/groundwater/bulk` - Bulk upload groundwater

### Analysis
- `GET /api/analysis/drought/:villageId` - Drought analysis
- `GET /api/analysis/wsi/:villageId` - WSI for village
- `GET /api/analysis/wsi` - All villages WSI
- `GET /api/analysis/critical` - Critical villages
- `GET /api/analysis/predict/:villageId` - Demand prediction
- `GET /api/analysis/forecast/:villageId` - Demand forecast

### Tankers
- `GET /api/tankers` - Get all tankers
- `POST /api/tankers` - Create tanker
- `POST /api/tankers/allocate` - Run allocation
- `GET /api/tankers/allocations` - Get allocations
- `POST /api/tankers/optimize-route` - Optimize route

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/active` - Get active alerts
- `POST /api/alerts` - Create alert
- `PUT /api/alerts/:id/resolve` - Resolve alert

## Database Schema

### Tables
- `users` - User authentication
- `villages` - Village master data
- `groundwater_records` - Monthly groundwater measurements
- `rainfall_records` - Historical and current rainfall
- `tankers` - Tanker fleet management
- `allocations` - Tanker-village assignments
- `alerts` - System alerts and notifications

## Future Integration Ready

The platform is architected to support:
- OpenWeather API integration
- Government rainfall APIs
- Real-time GPS tanker tracking
- SMS notification services

All services are modular and can be extended without core changes.

## Design System

### Claymorphic UI
- Soft shadows and rounded corners (20px)
- Glass blur effects
- Blue color palette
- Professional dashboard layout

### Animations
- Framer Motion for smooth transitions
- Hover scale effects
- Animated counters
- Chart loading animations
- Alert popups

## Security

- JWT token-based authentication
- Role-based access control (admin/operator/viewer)
- Protected API routes
- Input validation
- Error handling middleware

## Production Deployment

1. Build frontend:
```cmd
cd frontend
npm run build
```

2. Configure production environment variables
3. Set up MySQL database with proper credentials
4. Deploy backend to Node.js hosting
5. Deploy frontend build to static hosting or serve via Express

## License

MIT
