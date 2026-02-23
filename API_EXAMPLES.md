# 📡 API Usage Examples

Base URL: `http://localhost:5000/api`

## Authentication

### Register User
```bash
POST /auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@water.gov",
  "password": "admin123",
  "role": "admin"
}
```

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@water.gov",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@water.gov",
    "role": "admin"
  }
}
```

**Note:** Use the token in all subsequent requests:
```
Authorization: Bearer YOUR_TOKEN
```

## Villages

### Create Village
```bash
POST /villages
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Dharavi",
  "district": "Mumbai",
  "state": "Maharashtra",
  "population": 15000,
  "latitude": 19.0433,
  "longitude": 72.8564,
  "storage_capacity": 500000,
  "current_storage": 300000
}
```

### Get All Villages
```bash
GET /villages
Authorization: Bearer YOUR_TOKEN
```

### Update Village
```bash
PUT /villages/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "current_storage": 250000
}
```

## Data Upload

### Add Rainfall Data
```bash
POST /data/rainfall
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "village_id": 1,
  "record_date": "2024-01-15",
  "rainfall_mm": 45.5,
  "is_historical": false
}
```

### Bulk Upload Rainfall
```bash
POST /data/rainfall/bulk
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "records": [
    {
      "village_id": 1,
      "record_date": "2024-01-01",
      "rainfall_mm": 30.5,
      "is_historical": false
    },
    {
      "village_id": 1,
      "record_date": "2024-01-02",
      "rainfall_mm": 25.3,
      "is_historical": false
    }
  ]
}
```

### Add Groundwater Data
```bash
POST /data/groundwater
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "village_id": 1,
  "measurement_date": "2024-01-15",
  "water_level": 12.5,
  "quality_index": 75.5
}
```

### Bulk Upload Groundwater
```bash
POST /data/groundwater/bulk
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "records": [
    {
      "village_id": 1,
      "measurement_date": "2024-01-01",
      "water_level": 12.0
    },
    {
      "village_id": 1,
      "measurement_date": "2024-02-01",
      "water_level": 13.5
    }
  ]
}
```

## Analysis

### Get Drought Analysis
```bash
GET /analysis/drought/1
Authorization: Bearer YOUR_TOKEN

Response:
{
  "villageId": 1,
  "rainfallDeviation": 45.2,
  "groundwaterTrend": 32.1,
  "combinedScore": 40.0,
  "severity": "alert",
  "details": {
    "rainfall": {
      "deviation": 45.2,
      "current": 30.5,
      "historical": 55.8
    },
    "groundwater": {
      "trend": 32.1,
      "slope": 3.21,
      "records": 6,
      "latestLevel": 12.5
    }
  }
}
```

### Get WSI for Village
```bash
GET /analysis/wsi/1
Authorization: Bearer YOUR_TOKEN

Response:
{
  "villageId": 1,
  "villageName": "Dharavi",
  "wsi": 65.43,
  "severity": "alert",
  "components": {
    "rainfall": 45.2,
    "groundwater": 32.1,
    "population": 30.0,
    "storage": 40.0
  },
  "weights": {
    "rainfall": 0.35,
    "groundwater": 0.30,
    "population": 0.20,
    "storage": 0.15
  }
}
```

### Get All Villages WSI
```bash
GET /analysis/wsi
Authorization: Bearer YOUR_TOKEN
```

### Get Critical Villages
```bash
GET /analysis/critical?threshold=70
Authorization: Bearer YOUR_TOKEN
```

### Predict Demand
```bash
GET /analysis/predict/1
Authorization: Bearer YOUR_TOKEN

Response:
{
  "villageId": 1,
  "villageName": "Dharavi",
  "population": 15000,
  "wsi": 65.43,
  "dailyDemand": 825000,
  "weeklyDemand": 5775000,
  "monthlyDemand": 24750000,
  "storageDeficit": 200000,
  "currentStorage": 300000,
  "storageCapacity": 500000,
  "urgency": "alert"
}
```

### Forecast Demand
```bash
GET /analysis/forecast/1?days=7
Authorization: Bearer YOUR_TOKEN
```

## Tankers

### Create Tanker
```bash
POST /tankers
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "registration_number": "MH-01-AB-1234",
  "capacity": 10000,
  "status": "available",
  "current_latitude": 19.0760,
  "current_longitude": 72.8777
}
```

### Get All Tankers
```bash
GET /tankers
Authorization: Bearer YOUR_TOKEN
```

### Update Tanker
```bash
PUT /tankers/1
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "status": "available",
  "current_latitude": 19.0433,
  "current_longitude": 72.8564
}
```

### Run Smart Allocation
```bash
POST /tankers/allocate
Authorization: Bearer YOUR_TOKEN

Response:
{
  "message": "Allocated 3 tankers",
  "allocations": [
    {
      "allocationId": 1,
      "tankerId": 1,
      "tankerRegistration": "MH-01-AB-1234",
      "villageId": 1,
      "priorityScore": 75.5
    }
  ]
}
```

### Get Allocations
```bash
GET /tankers/allocations
Authorization: Bearer YOUR_TOKEN
```

### Optimize Route
```bash
POST /tankers/optimize-route
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "startPoint": {
    "latitude": 19.0760,
    "longitude": 72.8777
  },
  "destinations": [
    {
      "id": 1,
      "name": "Dharavi",
      "latitude": 19.0433,
      "longitude": 72.8564
    },
    {
      "id": 2,
      "name": "Kurla",
      "latitude": 19.0728,
      "longitude": 72.8826
    }
  ]
}

Response:
{
  "route": [
    {
      "id": 2,
      "name": "Kurla",
      "latitude": 19.0728,
      "longitude": 72.8826,
      "distanceFromPrevious": 1.2
    },
    {
      "id": 1,
      "name": "Dharavi",
      "latitude": 19.0433,
      "longitude": 72.8564,
      "distanceFromPrevious": 3.5
    }
  ],
  "totalDistance": 4.7,
  "estimatedTime": 0.12
}
```

## Alerts

### Create Alert
```bash
POST /alerts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "village_id": 1,
  "severity": "critical",
  "message": "Water stress level critical. Immediate action required.",
  "wsi_score": 85.5
}
```

### Get All Alerts
```bash
GET /alerts
Authorization: Bearer YOUR_TOKEN
```

### Get Active Alerts
```bash
GET /alerts/active
Authorization: Bearer YOUR_TOKEN
```

### Resolve Alert
```bash
PUT /alerts/1/resolve
Authorization: Bearer YOUR_TOKEN
```

## Testing with cURL (Windows CMD)

### Register
```cmd
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"email\":\"admin@water.gov\",\"password\":\"admin123\",\"role\":\"admin\"}"
```

### Login
```cmd
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@water.gov\",\"password\":\"admin123\"}"
```

### Create Village (replace YOUR_TOKEN)
```cmd
curl -X POST http://localhost:5000/api/villages -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"Dharavi\",\"district\":\"Mumbai\",\"state\":\"Maharashtra\",\"population\":15000,\"latitude\":19.0433,\"longitude\":72.8564,\"storage_capacity\":500000,\"current_storage\":300000}"
```

## Postman Collection

Import these endpoints into Postman for easier testing. Set up environment variables:
- `base_url`: http://localhost:5000/api
- `token`: (set after login)

Use `{{base_url}}` and `{{token}}` in your requests.
