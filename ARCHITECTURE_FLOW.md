# Village Registration & Data Filtering Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         REGISTRATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

1. User Opens Registration Page
   │
   ├─→ Frontend: useEffect() triggers
   │   │
   │   └─→ API Call: GET /api/auth/villages (No Auth Required)
   │       │
   │       └─→ Backend: Returns all villages
   │           │
   │           └─→ Frontend: Populates dropdown with villages
   │
2. User Fills Form & Selects Village
   │
   └─→ API Call: POST /api/auth/register
       │
       ├─→ Body: { username, email, password, village_id, phone }
       │
       └─→ Backend: 
           ├─→ Validates village exists
           ├─→ Creates user with village_id
           └─→ Returns success message


┌─────────────────────────────────────────────────────────────────────┐
│                            LOGIN FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

1. User Submits Login
   │
   └─→ API Call: POST /api/auth/login
       │
       ├─→ Body: { email, password }
       │
       └─→ Backend:
           ├─→ Validates credentials
           ├─→ Fetches user with village data
           ├─→ Generates JWT token with:
           │   ├─→ id
           │   ├─→ email
           │   ├─→ role
           │   └─→ village_id ⭐ (Critical for filtering)
           │
           └─→ Returns: { token, user }
               │
               └─→ Frontend:
                   ├─→ Stores token in localStorage
                   ├─→ Stores user object in localStorage
                   └─→ Redirects to dashboard


┌─────────────────────────────────────────────────────────────────────┐
│                      DATA ACCESS FLOW                                │
└─────────────────────────────────────────────────────────────────────┘

1. User Navigates to "My Village Data"
   │
   └─→ API Call: GET /api/alerts/my-village
       │
       ├─→ Headers: { Authorization: "Bearer <token>" }
       │
       └─→ Backend Middleware Chain:
           │
           ├─→ authenticate() middleware:
           │   ├─→ Extracts token from header
           │   ├─→ Verifies JWT signature
           │   ├─→ Decodes token payload
           │   └─→ Sets req.user = { id, email, role, village_id }
           │
           └─→ Route Handler:
               ├─→ Reads req.user.village_id
               ├─→ Queries database:
               │   └─→ WHERE village_id = req.user.village_id
               │
               └─→ Returns filtered data
                   │
                   └─→ Frontend: Displays village-specific data


┌─────────────────────────────────────────────────────────────────────┐
│                    REPORT SUBMISSION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

1. User Submits Water Shortage Report
   │
   └─→ API Call: POST /api/reports/water-shortage
       │
       ├─→ Headers: { Authorization: "Bearer <token>" }
       ├─→ Body: { description, severity }
       │
       └─→ Backend:
           ├─→ authenticate() extracts village_id from token
           ├─→ Creates report with:
           │   ├─→ user_id: req.user.id
           │   ├─→ village_id: req.user.village_id ⭐
           │   ├─→ description: from body
           │   └─→ severity: from body
           │
           └─→ Returns created report


┌─────────────────────────────────────────────────────────────────────┐
│                      DATABASE SCHEMA                                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐
│   Villages   │         │    Users     │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄────────│ id (PK)      │
│ name         │         │ username     │
│ district     │         │ email        │
│ state        │         │ password     │
│ population   │         │ role         │
│ latitude     │         │ village_id   │──┐
│ longitude    │         │ phone        │  │
│ storage_cap  │         └──────────────┘  │
│ current_stor │                           │
└──────────────┘                           │
       ▲                                   │
       │                                   │
       │  ┌────────────────────────────────┘
       │  │
       │  │  ┌──────────────────┐
       │  └──│ WaterShortage    │
       │     │ Reports          │
       │     ├──────────────────┤
       │     │ id (PK)          │
       │     │ user_id (FK)     │
       │     │ village_id (FK)  │
       │     │ description      │
       │     │ severity         │
       │     │ status           │
       │     └──────────────────┘
       │
       │     ┌──────────────────┐
       └─────│ Alerts           │
       │     ├──────────────────┤
       │     │ id (PK)          │
       │     │ village_id (FK)  │
       │     │ message          │
       │     │ severity         │
       │     │ is_resolved      │
       │     └──────────────────┘
       │
       │     ┌──────────────────┐
       └─────│ Allocations      │
       │     ├──────────────────┤
       │     │ id (PK)          │
       │     │ village_id (FK)  │
       │     │ tanker_id (FK)   │
       │     │ water_amount     │
       │     │ status           │
       │     └──────────────────┘
       │
       │     ┌──────────────────┐
       └─────│ RainfallRecords  │
       │     ├──────────────────┤
       │     │ id (PK)          │
       │     │ village_id (FK)  │
       │     │ record_date      │
       │     │ rainfall_mm      │
       │     └──────────────────┘
       │
       │     ┌──────────────────┐
       └─────│ Groundwater      │
             │ Records          │
             ├──────────────────┤
             │ id (PK)          │
             │ village_id (FK)  │
             │ measurement_date │
             │ water_level_m    │
             └──────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    JWT TOKEN STRUCTURE                               │
└─────────────────────────────────────────────────────────────────────┘

{
  "id": 2,
  "email": "localuser@water.gov",
  "role": "local_user",
  "village_id": 1,              ⭐ Used for filtering
  "iat": 1234567890,
  "exp": 1234654290
}


┌─────────────────────────────────────────────────────────────────────┐
│                    API ENDPOINT MAPPING                              │
└─────────────────────────────────────────────────────────────────────┘

PUBLIC ENDPOINTS (No Auth)
├─→ GET  /api/auth/villages      → Returns all villages
├─→ POST /api/auth/register      → Creates new user
└─→ POST /api/auth/login         → Returns JWT token

LOCAL USER ENDPOINTS (Auth Required)
├─→ GET  /api/alerts/my-village  → WHERE village_id = req.user.village_id
├─→ GET  /api/tankers/my-village → WHERE village_id = req.user.village_id
├─→ GET  /api/reports/my-reports → WHERE user_id = req.user.id
├─→ POST /api/reports/water-shortage → Uses req.user.village_id
├─→ GET  /api/data/rainfall/:id  → WHERE village_id = :id
└─→ GET  /api/data/groundwater/:id → WHERE village_id = :id

ADMIN ENDPOINTS (Admin Role Required)
├─→ GET    /api/villages         → Returns all villages
├─→ POST   /api/villages         → Creates village
├─→ PUT    /api/villages/:id     → Updates village
├─→ DELETE /api/villages/:id     → Deletes village
├─→ GET    /api/reports/all      → Returns all reports
└─→ PUT    /api/reports/:id/status → Updates report status


┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                                   │
└─────────────────────────────────────────────────────────────────────┘

Layer 1: Authentication
├─→ JWT token verification
├─→ Token expiration check (24 hours)
└─→ Invalid token rejection

Layer 2: Authorization
├─→ Role-based access control
├─→ Admin vs Local User permissions
└─→ Route-level authorization

Layer 3: Data Isolation
├─→ Village ID from JWT (server-side)
├─→ Database-level filtering
├─→ Cannot access other villages' data

Layer 4: Input Validation
├─→ Village existence check
├─→ Required field validation
└─→ Data type validation


┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND STATE FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

localStorage
├─→ token: "eyJhbGc..."
└─→ user: {
      id: 2,
      username: "Ramesh Patil",
      email: "localuser@water.gov",
      role: "local_user",
      village_id: 1,
      village: {
        id: 1,
        name: "Yavatmal",
        district: "Yavatmal"
      }
    }

AuthContext
├─→ user: (from localStorage)
├─→ isAuthenticated: true
├─→ isAdmin: false
├─→ isLocalUser: true
└─→ Methods: login(), logout()

API Interceptor
└─→ Adds Authorization header to all requests
    └─→ Authorization: Bearer <token>


┌─────────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                               │
└─────────────────────────────────────────────────────────────────────┘

Frontend Error Handling
├─→ Villages Load Failure
│   ├─→ Console error log
│   ├─→ User-friendly error message
│   └─→ Suggestion to refresh page
│
├─→ Registration Failure
│   ├─→ Display backend error message
│   └─→ Keep form data (except password)
│
└─→ API Request Failure
    ├─→ 401: Redirect to login
    ├─→ 403: Show permission error
    └─→ 500: Show server error

Backend Error Handling
├─→ Authentication Errors
│   ├─→ Missing token → 401
│   ├─→ Invalid token → 401
│   └─→ Expired token → 401
│
├─→ Authorization Errors
│   └─→ Insufficient permissions → 403
│
├─→ Validation Errors
│   ├─→ Missing required fields → 400
│   ├─→ Invalid village_id → 400
│   └─→ Duplicate email → 400
│
└─→ Database Errors
    └─→ Connection/Query errors → 500
```

## Key Takeaways

1. **Village ID is Critical**: It's stored in the JWT token and used for all data filtering
2. **Server-Side Security**: Village ID comes from the token, not client requests
3. **Automatic Filtering**: All endpoints automatically filter by user's village
4. **Role-Based Access**: Admins see all data, local users see only their village
5. **Data Isolation**: Users cannot access other villages' data

## Testing the Flow

Use the provided test scripts:
- `node backend/test-villages.js` - Check villages exist
- `bash test-api-endpoints.sh` - Test all API endpoints
- `bash setup-and-test.sh` - Complete setup and verification
