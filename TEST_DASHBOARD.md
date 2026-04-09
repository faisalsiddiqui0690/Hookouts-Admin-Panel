# 🚀 Quick Test - Dynamic Dashboard

## Step 1: Start All Servers

Open **3 separate PowerShell windows**:

### Window 1 - Main Backend
```powershell
cd "e:\Office Work\hookouts.backend"
npm run dev
```
**Expected:** ✅ Server running on port 3000

### Window 2 - Admin Backend
```powershell
cd "e:\Office Work\hookouts.admin.backend"
npm run dev
```
**Expected:** ✅ Server running on port 4000

### Window 3 - Frontend
```powershell
cd "e:\Office Work\hookouts.admin"
npm run dev
```
**Expected:** ✅ Local server running on port 5173

---

## Step 2: Open Browser & DevTools

1. Navigate to: **http://localhost:5173**
2. Press **F12** to open DevTools
3. Go to **Network** tab

---

## Step 3: Verify API Calls

In the Network tab, you should see:

### ✅ GET /api/admin/stats
- Status: **200 OK**
- Response: Statistics data

### ✅ GET /api/admin/users/recent?limit=10
- Status: **200 OK**  
- Response: Array of users

### ✅ GET /api/admin/analytics?period=7d
- Status: **200 OK**
- Response: Analytics with charts data

---

## Step 4: Check Dashboard Display

### Top Stats Cards (Should show numbers):
- [ ] **Total Users** - Number displayed
- [ ] **Active Users** - Number displayed
- [ ] **New Users Today** - Number displayed
- [ ] **Total Matches** - Number displayed

### Charts (Should render):
- [ ] **User Growth** sparkline (under Total Users)
- [ ] **Activity** bar chart (under Active Users)
- [ ] **New Users** area chart (under New Users Today)
- [ ] **Matches** bar chart (under Total Matches)
- [ ] **Order Chart** - Bar chart with 7 days data
- [ ] **Shop by Category** - Heatmap with 5 categories

### Recent Users Section:
- [ ] List of users with avatars
- [ ] Names and emails visible
- [ ] Join dates formatted
- [ ] "View Profile" buttons

---

## Step 5: Console Checks

Press **F12** → Console tab

Should show:
- ✅ No red errors
- ⚠️ Maybe some CORS warnings (normal)
- ℹ️ Maybe some logging from the app

---

## 🎯 Success Criteria

You know it's working when:

### ✅ Visual Indicators:
- Numbers on all stat cards (not zeros)
- Charts are rendering (lines, bars, heatmap)
- Recent users list populated
- Loading spinner disappears
- No error alerts visible

### ✅ Technical Indicators:
- All 3 API calls return 200 OK
- Console has no errors
- Network tab shows successful requests
- React DevTools shows state updates

---

## 🐛 Common Issues & Fixes

### Problem: All stats show "0"
**Fix:** 
1. Check if main backend is running
2. Verify database connection
3. Check if admin backend can connect

### Problem: Loading spinner never stops
**Fix:**
1. Check Network tab for failed requests
2. Verify both backends are running
3. Check console for errors

### Problem: Charts show static/mock data
**Fix:**
1. Check if analytics API returns data
2. Verify `analytics` state is populated
3. Check useMemo dependencies

### Problem: "Cannot connect to backend"
**Fix:**
1. Ensure admin backend running on port 4000
2. Check `.env` file has correct URL
3. Restart frontend dev server

---

## 📊 Expected Data Flow

```
Browser → localhost:5173
    ↓
Admin Backend → localhost:4000
    ↓
Main Backend → localhost:3000
    ↓
Database → Returns Data
    ↓
Charts Update Automatically ✨
```

---

## 🔍 API Endpoints to Test

Manually test in browser:

### Health Check
```
http://localhost:4000/health
```
**Expected:** `{ status: 'ok', message: 'Admin backend is running' }`

### Dashboard Stats
```
http://localhost:4000/api/admin/stats
```
**Expected:** JSON with statistics

### Analytics
```
http://localhost:4000/api/admin/analytics?period=7d
```
**Expected:** JSON with chart data

### Recent Users
```
http://localhost:4000/api/admin/users/recent?limit=10
```
**Expected:** JSON array of users

---

## ✅ Final Checklist

Mark as complete when:

- [ ] Main backend starts successfully
- [ ] Admin backend starts successfully
- [ ] Frontend starts successfully
- [ ] Dashboard loads without errors
- [ ] All 4 stat cards show numbers
- [ ] All charts render correctly
- [ ] Recent users list displays
- [ ] No console errors
- [ ] All API calls return 200 OK
- [ ] Page is responsive on mobile

---

## 🎉 You're Done!

If all checkboxes are checked, your dashboard is fully integrated with real-time data from the database! 

**Enjoy your live dashboard! 📊✨**
