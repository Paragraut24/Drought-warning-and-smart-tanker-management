#!/bin/bash

API_URL="http://localhost:5000/api"

echo "🧪 Testing JalRakshak API Endpoints"
echo "===================================="
echo ""

# Test 1: Health Check
echo "1️⃣  Testing Health Endpoint..."
curl -s "$API_URL/health" | jq '.' || echo "❌ Health check failed"
echo ""

# Test 2: Villages List (Public)
echo "2️⃣  Testing Villages Endpoint (Public)..."
VILLAGES=$(curl -s "$API_URL/auth/villages")
VILLAGE_COUNT=$(echo $VILLAGES | jq '. | length')
echo "Found $VILLAGE_COUNT villages"
echo $VILLAGES | jq '.[0:3]' || echo "❌ Villages endpoint failed"
echo ""

# Test 3: Login as Local User
echo "3️⃣  Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"localuser@water.gov","password":"local123"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
VILLAGE_NAME=$(echo $LOGIN_RESPONSE | jq -r '.user.village.name')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Login successful!"
    echo "   User village: $VILLAGE_NAME"
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "❌ Login failed"
    echo $LOGIN_RESPONSE | jq '.'
    exit 1
fi
echo ""

# Test 4: Get My Village Alerts
echo "4️⃣  Testing My Village Alerts..."
curl -s "$API_URL/alerts/my-village" \
  -H "Authorization: Bearer $TOKEN" | jq '. | length' | xargs echo "   Found alerts:"
echo ""

# Test 5: Get My Village Tankers
echo "5️⃣  Testing My Village Tankers..."
curl -s "$API_URL/tankers/my-village" \
  -H "Authorization: Bearer $TOKEN" | jq '. | length' | xargs echo "   Found allocations:"
echo ""

# Test 6: Get My Reports
echo "6️⃣  Testing My Reports..."
curl -s "$API_URL/reports/my-reports" \
  -H "Authorization: Bearer $TOKEN" | jq '. | length' | xargs echo "   Found reports:"
echo ""

echo "✅ All tests completed!"
echo ""
echo "Note: Install 'jq' for better JSON formatting: sudo apt-get install jq"
