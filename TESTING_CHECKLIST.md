# Testing Checklist - Village Registration & Data Filtering

## Pre-Testing Setup

### Backend Setup
- [ ] PostgreSQL is installed and running
- [ ] Backend `.env` file exists with correct database credentials
- [ ] Backend dependencies installed: `cd backend && npm install`
- [ ] Database is seeded: `node backend/seed-database.js`
- [ ] Backend server is running: `npm start` (port 5000)

### Frontend Setup
- [ ] Frontend dependencies installed: `cd frontend && npm install`
- [ ] Frontend `.env` file exists with API URL
- [ ] Frontend dev server is running: `npm run dev` (port 5173)

### Verification Commands
```bash
# Check database connection
node backend/test-connection.js

# Check villages exist
node backend/test-villages.js

# Check API health
curl http://localhost:5000/api/health
```

---

## Test Suite 1: Village Dropdown Loading

### Test 1.1: Villages Endpoint Works
- [ ] Open: `http://localhost:5000/api/auth/villages`
- [ ] Expected: JSON array of villages
- [ ] Verify: At least 20 villages returned
- [ ] Verify: Each village has `id`, `name`, `district`

### Test 1.2: Frontend Loads Villages
- [ ] Open: `http://localhost:5173`
- [ ] Click: "Local User" tab
- [ ] Click: "Register here" link
- [ ] Check: "Select Your Village" dropdown
- [ ] Expected: Dropdown shows villages
- [ ] Verify: Villages are sorted alphabetically
- [ ] Verify: Format is "Village Name (District)"

### Test 1.3: Error Handling
- [ ] Stop backend server
- [ ] Refresh registration page
- [ ] Expected: Error message appears
- [ ] Verify: Message says "Failed to load villages"
- [ ] Start backend server
- [ ] Refresh page
- [ ] Expected: Villages load successfully

---

## Test Suite 2: User Registration

### Test 2.1: Successful Registration
- [ ] Navigate to registration page
- [ ] Fill in form:
  - Username: `Test User`
  - Email: `test@example.com`
  - Password: `test123`
  - Village: Select `Yavatmal (Yavatmal)`
  - Phone: `9876543210` (optional)
- [ ] Click: "Create Account"
- [ ] Expected: Success message appears
- [ ] Expected: Auto-redirect to login after 2 seconds

### Test 2.2: Validation Errors
- [ ] Try registering without username
- [ ] Expected: Browser validation error
- [ ] Try registering without email
- [ ] Expected: Browser validation error
- [ ] Try registering without password
- [ ] Expected: Browser validation error
- [ ] Try registering without village
- [ ] Expected: Browser validation error

### Test 2.3: Duplicate Email
- [ ] Try registering with `localuser@water.gov`
- [ ] Expected: Error message about duplicate email
- [ ] Verify: Form data is preserved (except password)

---

## Test Suite 3: User Login

### Test 3.1: Login with New Account
- [ ] Login with newly created account
- [ ] Expected: Successful login
- [ ] Expected: Redirect to dashboard
- [ ] Check: User's village name appears in header
- [ ] Check: localStorage has `token`
- [ ] Check: localStorage has `user` object

### Test 3.2: User Object Verification
- [ ] Open browser DevTools → Application → Local Storage
- [ ] Check `user` object contains:
  - [ ] `id`
  - [ ] `username`
  - [ ] `email`
  - [ ] `role` = "local_user"
  - [ ] `village_id` (number)
  - [ ] `village` object with `id`, `name`, `district`

### Test 3.3: Demo Account Login
- [ ] Logout
- [ ] Login as local user:
  - Email: `localuser@water.gov`
  - Password: `local123`
- [ ] Expected: Successful login
- [ ] Verify: Village is "Yavatmal"

---

## Test Suite 4: Village-Specific Data Access

### Test 4.1: Dashboard Data
- [ ] Navigate to Dashboard
- [ ] Verify: Shows village name in header
- [ ] Verify: Shows village statistics
- [ ] Verify: Shows storage capacity for user's village
- [ ] Verify: Shows active alerts count for user's village

### Test 4.2: My Village Data Page
- [ ] Navigate to "My Village Data"
- [ ] Verify: Page title shows village name
- [ ] Verify: Shows rainfall data
- [ ] Verify: Shows groundwater data
- [ ] Verify: Shows WSI (Water Stress Index)
- [ ] Verify: Shows drought status
- [ ] Check: All data is for user's village only

### Test 4.3: My Alerts Page
- [ ] Navigate to "My Alerts"
- [ ] Verify: Page shows village name
- [ ] Verify: Shows alerts for user's village only
- [ ] Verify: Shows alert counts (Total, Active, Critical)
- [ ] Verify: Can filter by All/Active/Resolved

### Test 4.4: Track Tankers Page
- [ ] Navigate to "Track Tankers"
- [ ] Verify: Shows tanker allocations for user's village
- [ ] Verify: Shows tanker details (capacity, status)
- [ ] Verify: Shows delivery schedule

---

## Test Suite 5: Report Submission

### Test 5.1: Submit Water Shortage Report
- [ ] Navigate to "Report Shortage"
- [ ] Verify: Page shows village name
- [ ] Select severity: "High"
- [ ] Enter description: "Water supply stopped for 3 days"
- [ ] Click: "Submit Report"
- [ ] Expected: Success message appears
- [ ] Expected: Form is cleared
- [ ] Expected: Report appears in "My Past Reports" section

### Test 5.2: View Past Reports
- [ ] Check "My Past Reports" section
- [ ] Verify: Shows submitted report
- [ ] Verify: Shows severity badge
- [ ] Verify: Shows status badge (pending)
- [ ] Verify: Shows submission timestamp

### Test 5.3: Report Auto-Links to Village
- [ ] Submit another report
- [ ] Login as admin: `admin@water.gov` / `admin123`
- [ ] Navigate to admin reports view
- [ ] Verify: Report shows correct village
- [ ] Verify: Report is linked to correct user

---

## Test Suite 6: Data Isolation

### Test 6.1: User Cannot Access Other Villages
- [ ] Login as user with Village A
- [ ] Note the village_id from localStorage
- [ ] Open DevTools → Network tab
- [ ] Navigate to "My Village Data"
- [ ] Check API requests
- [ ] Verify: All requests use user's village_id
- [ ] Try manually calling API with different village_id:
  ```bash
  curl http://localhost:5000/api/alerts/my-village \
    -H "Authorization: Bearer <token>"
  ```
- [ ] Verify: Returns only user's village data

### Test 6.2: Multiple Users Different Villages
- [ ] Register User A with Village "Yavatmal"
- [ ] Register User B with Village "Wardha"
- [ ] Login as User A
- [ ] Note alerts/reports count
- [ ] Logout and login as User B
- [ ] Verify: Different alerts/reports
- [ ] Verify: Different village data

---

## Test Suite 7: Admin Access

### Test 7.1: Admin Can See All Villages
- [ ] Login as admin: `admin@water.gov` / `admin123`
- [ ] Navigate to Dashboard
- [ ] Verify: Shows data for all villages
- [ ] Navigate to Alerts
- [ ] Verify: Shows alerts for all villages
- [ ] Navigate to Villages management
- [ ] Verify: Can view/edit all villages

### Test 7.2: Admin Cannot Be Assigned Village
- [ ] Try to register admin with village
- [ ] Expected: Admin role should not require village
- [ ] Verify: Admin user has `village_id = null`

---

## Test Suite 8: API Endpoint Testing

### Test 8.1: Public Endpoints (No Auth)
```bash
# Villages list
curl http://localhost:5000/api/auth/villages
# Expected: 200 OK, JSON array

# Health check
curl http://localhost:5000/api/health
# Expected: 200 OK, {"status":"ok"}
```

### Test 8.2: Protected Endpoints (Auth Required)
```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"localuser@water.gov","password":"local123"}' \
  | jq -r '.token')

# My village alerts
curl http://localhost:5000/api/alerts/my-village \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK, JSON array

# My village tankers
curl http://localhost:5000/api/tankers/my-village \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK, JSON array

# My reports
curl http://localhost:5000/api/reports/my-reports \
  -H "Authorization: Bearer $TOKEN"
# Expected: 200 OK, JSON array
```

### Test 8.3: Unauthorized Access
```bash
# Try without token
curl http://localhost:5000/api/alerts/my-village
# Expected: 401 Unauthorized

# Try with invalid token
curl http://localhost:5000/api/alerts/my-village \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```

---

## Test Suite 9: Edge Cases

### Test 9.1: Empty Village Data
- [ ] Register user with village that has no data
- [ ] Login and navigate to "My Village Data"
- [ ] Expected: Shows "No data available" messages
- [ ] Verify: No errors in console

### Test 9.2: Special Characters in Input
- [ ] Try registering with special characters in username
- [ ] Try submitting report with special characters
- [ ] Expected: Handles gracefully
- [ ] Verify: Data is properly escaped

### Test 9.3: Long Text Input
- [ ] Submit report with very long description (1000+ chars)
- [ ] Expected: Accepts or shows character limit
- [ ] Verify: Displays properly in reports list

---

## Test Suite 10: Performance

### Test 10.1: Village Loading Speed
- [ ] Open registration page
- [ ] Measure time to load villages
- [ ] Expected: < 1 second
- [ ] Check Network tab for request time

### Test 10.2: Dashboard Loading Speed
- [ ] Login and navigate to dashboard
- [ ] Measure time to load all data
- [ ] Expected: < 2 seconds
- [ ] Check for unnecessary API calls

### Test 10.3: Concurrent Users
- [ ] Open app in 3 different browsers
- [ ] Login as different users
- [ ] Navigate simultaneously
- [ ] Expected: No conflicts or errors

---

## Test Suite 11: Browser Compatibility

### Test 11.1: Chrome
- [ ] All features work in Chrome
- [ ] No console errors
- [ ] UI renders correctly

### Test 11.2: Firefox
- [ ] All features work in Firefox
- [ ] No console errors
- [ ] UI renders correctly

### Test 11.3: Edge
- [ ] All features work in Edge
- [ ] No console errors
- [ ] UI renders correctly

---

## Test Suite 12: Mobile Responsiveness

### Test 12.1: Mobile View
- [ ] Open app on mobile device or DevTools mobile view
- [ ] Verify: Registration form is usable
- [ ] Verify: Village dropdown works on mobile
- [ ] Verify: All pages are responsive
- [ ] Verify: Navigation works on mobile

---

## Regression Testing

### After Any Code Changes
- [ ] Villages dropdown still loads
- [ ] Registration still works
- [ ] Login still works
- [ ] Village-specific data still filtered correctly
- [ ] Reports still auto-link to village
- [ ] No new console errors
- [ ] No broken API endpoints

---

## Final Verification

### Checklist Summary
- [ ] All Test Suite 1 tests passed (Village Loading)
- [ ] All Test Suite 2 tests passed (Registration)
- [ ] All Test Suite 3 tests passed (Login)
- [ ] All Test Suite 4 tests passed (Data Access)
- [ ] All Test Suite 5 tests passed (Reports)
- [ ] All Test Suite 6 tests passed (Data Isolation)
- [ ] All Test Suite 7 tests passed (Admin Access)
- [ ] All Test Suite 8 tests passed (API Endpoints)
- [ ] All Test Suite 9 tests passed (Edge Cases)
- [ ] All Test Suite 10 tests passed (Performance)
- [ ] All Test Suite 11 tests passed (Browser Compatibility)
- [ ] All Test Suite 12 tests passed (Mobile Responsiveness)

### Sign-Off
- [ ] All critical features working
- [ ] No blocking bugs found
- [ ] Performance is acceptable
- [ ] Security measures verified
- [ ] Documentation is complete

---

## Bug Report Template

If you find any issues during testing:

```
Bug ID: [Unique identifier]
Test Suite: [Which suite]
Test Case: [Which test]
Severity: [Critical/High/Medium/Low]

Description:
[What went wrong]

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots/Logs:
[Attach if available]

Environment:
- Browser: [Chrome/Firefox/Edge]
- OS: [Windows/Mac/Linux]
- Backend Version: [Version]
- Frontend Version: [Version]
```

---

## Automated Testing Script

Run all API tests automatically:

```bash
# Make script executable
chmod +x test-api-endpoints.sh

# Run tests
./test-api-endpoints.sh
```

Expected output: All tests pass with ✅ marks
