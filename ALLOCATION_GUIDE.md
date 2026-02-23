# Allocation System Guide - JalRakshak AI

## ✅ Allocation System is Working!

The allocation system has been tested and is functioning correctly.

---

## 🚛 How Allocation Works

### Smart Allocation Algorithm:

1. **Calculates Priority Scores** for all villages based on:
   - Water Stress Index (WSI) - 50%
   - Population density - 30%
   - Storage deficit - 20%

2. **Sorts Villages** by priority (highest first)

3. **Assigns Available Tankers** to highest priority villages

4. **Updates Tanker Status** from "available" to "assigned"

---

## 🎯 Why "No Tankers Available" Message?

### Common Reason:
All tankers are already assigned from previous allocations.

### Solution:
Reset tanker status to make them available again.

---

## 🔄 How to Reset Tankers

### Option 1: Use Batch File (Easiest)
1. Double-click `RESET_TANKERS.bat`
2. Press any key to confirm
3. Done! All tankers are now available

### Option 2: Manual Command
```cmd
cd backend
node reset-tankers.js
```

### Option 3: From Frontend (Coming Soon)
A "Reset Tankers" button will be added to the Allocation page.

---

## 📊 Allocation Process

### Step-by-Step:

1. **Login** as Admin or Operator
2. **Go to Allocation Page**
3. **Check Tanker Status**:
   - Green number = Available tankers
   - If 0 available, run `RESET_TANKERS.bat`
4. **Click "Run Smart Allocation"**
5. **Wait for Processing** (may take a few seconds)
6. **View Results**:
   - Success message appears
   - Table updates with new allocations
   - Tanker status changes to "assigned"

---

## 🧪 Testing Allocation

### Test Script Available:
```cmd
cd backend
node test-allocation.js
```

This will:
- Check database connection
- Run allocation algorithm
- Show allocation results
- Display all allocations

---

## 📋 Allocation Priority Calculation

### Formula:
```
Priority = (WSI × 0.5) + (Population × 0.3) + (Storage Deficit × 0.2)
```

### Example:
- Village A: WSI=80, Pop=25000, Deficit=70% → Priority=75.5
- Village B: WSI=60, Pop=15000, Deficit=50% → Priority=55.0
- Village A gets tanker first (higher priority)

---

## 🎨 Allocation Status Colors

### In the Table:
- 🟡 **Pending** (Yellow) - Allocated but not started
- 🔵 **In Progress** (Blue) - Tanker en route
- 🟢 **Completed** (Green) - Water delivered
- ⚪ **Cancelled** (Gray) - Allocation cancelled

---

## 🔧 Troubleshooting

### Issue: "No tankers available"
**Solution:** Run `RESET_TANKERS.bat` to make tankers available

### Issue: "Allocation failed"
**Possible Causes:**
1. Database connection issue
2. No villages in database
3. Missing rainfall/groundwater data

**Solution:**
1. Check backend is running
2. Verify database has villages
3. Run `node seed-database.js` if needed

### Issue: "Insufficient permissions"
**Solution:** Login as Admin or Operator (Viewer cannot allocate)

### Issue: Table doesn't update
**Solution:** Refresh the page (F5)

---

## 🎯 Best Practices

### When to Allocate:
- ✅ After new data is uploaded
- ✅ When critical alerts appear
- ✅ Daily during drought season
- ✅ After weather changes

### When to Reset Tankers:
- ✅ After deliveries are completed
- ✅ At start of new day
- ✅ For testing purposes
- ✅ When all tankers are assigned

---

## 📱 Future Enhancements

### Coming Soon:
1. **Auto-Reset** - Tankers auto-reset after delivery
2. **Real-time Tracking** - GPS tracking of tankers
3. **Delivery Confirmation** - Mark deliveries as complete
4. **Schedule Allocation** - Automatic daily allocation
5. **SMS Notifications** - Alert villages when tanker assigned

---

## 🔐 Permissions Required

### Who Can Allocate?
- ✅ **Admin** - Full access
- ✅ **Operator** - Can allocate
- ❌ **Viewer** - Read-only

### API Endpoint:
```
POST /api/tankers/allocate
Authorization: Bearer <token>
Role: admin or operator
```

---

## 📊 Allocation Statistics

### Current System:
- **10 Tankers** available in Vidarbha
- **20 Villages** monitored
- **Capacity**: 10,000 - 15,000 liters per tanker
- **Coverage**: All 11 Vidarbha districts

### Allocation Capacity:
- Can allocate up to 10 villages simultaneously
- Priority-based distribution
- Automatic optimization

---

## 💡 Tips

1. **Reset Regularly**: Reset tankers after deliveries to keep system updated
2. **Check Priority**: Higher priority villages get tankers first
3. **Monitor Status**: Watch the status badges in the table
4. **Update Data**: Keep rainfall/groundwater data current for accurate priorities
5. **Use Filters**: Sort table by priority to see critical allocations

---

## 🆘 Quick Commands

```cmd
# Reset all tankers to available
RESET_TANKERS.bat

# Test allocation system
cd backend
node test-allocation.js

# Check tanker status
cd backend
node check-data.js

# Restart backend server
cd backend
npm start
```

---

## 📞 Support

If allocation still doesn't work:
1. Check `backend/logs` for errors
2. Verify database connection
3. Run test script: `node test-allocation.js`
4. Contact system administrator

---

**Remember:** The allocation system is working correctly. If you see "No tankers available", simply run `RESET_TANKERS.bat` to make them available again!

---

*JalRakshak AI - Smart Water Distribution for Vidarbha*
