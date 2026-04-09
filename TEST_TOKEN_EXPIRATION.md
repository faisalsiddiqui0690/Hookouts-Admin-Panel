# Quick Test Guide - Token Expiration

## How to Test the Implementation

### Test 1: Normal Login Flow
1. Start backend: `cd hookouts.backend && npm run dev`
2. Start frontend: `cd hookouts.admin && npm run dev`
3. Navigate to login page
4. Enter credentials and login
5. ✅ Should redirect to dashboard

### Test 2: Token Expiration (Quick Test)
To test without waiting 30 minutes, temporarily modify the expiry time:

**In `authService.ts` line 39:**
```typescript
// Change from:
const expiryTime = Date.now() + 30 * 60 * 1000; // 30 minutes

// To (for testing):
const expiryTime = Date.now() + 1 * 60 * 1000; // 1 minute
```

Then:
1. Login to the application
2. Wait 1 minute
3. Try to navigate to another page or refresh
4. ✅ Should redirect to login page automatically

### Test 3: Opening New Tab/Window
1. Login to the application in one tab
2. Open a new tab/window
3. Navigate to the admin URL
4. If token is still valid (< 30 min): ✅ Should access dashboard
5. If token expired (> 30 min): ✅ Should redirect to login

### Test 4: Manual Route Change
1. Login and go to dashboard
2. Manually type a different route in URL (e.g., `/users`)
3. If authenticated: ✅ Should show users page
4. If token expired: ✅ Should redirect to login

### Test 5: API Call After Expiry
1. Login to the application
2. Wait for token to expire (or use 1-minute test)
3. Try to perform an action that makes an API call
4. ✅ Should get 401 error and redirect to login

### Test 6: Logout Functionality
1. Login to the application
2. Click logout button
3. ✅ Should clear all auth data (token, expiry, user)
4. ✅ Should redirect to login page
5. Try accessing protected route
6. ✅ Should stay on login page

### Test 7: Periodic Background Check
1. Login to the application
2. Leave the tab open without interaction
3. Wait for token to expire
4. ✅ Should automatically redirect to login page within 60 seconds

## Expected Behavior Summary

| Scenario | Expected Result |
|----------|----------------|
| Login with valid credentials | ✅ Redirect to dashboard |
| Token expires (30 min) | ✅ Auto-redirect to login |
| Open new tab (token valid) | ✅ Access granted |
| Open new tab (token expired) | ✅ Redirect to login |
| Manual URL change (authenticated) | ✅ Access granted |
| Manual URL change (expired) | ✅ Redirect to login |
| API call after expiry | ✅ 401 error → redirect to login |
| Logout | ✅ Clear all data → redirect to login |
| Background check detects expiry | ✅ Auto-logout within 60s |

## Troubleshooting

### Issue: Not redirecting to login after expiry
**Solution**: 
- Check browser console for errors
- Verify `adminTokenExpiry` is being stored in localStorage
- Ensure `isAuthenticated()` is being called

### Issue: Cannot login
**Solution**:
- Check backend is running on port 5000
- Verify database connection
- Check admin user exists in database
- Review browser console for API errors

### Issue: Token not expiring
**Solution**:
- Verify backend JWT expiration is set to '30m'
- Check frontend expiry calculation matches
- Clear localStorage and login again

## Browser DevTools Inspection

Open DevTools (F12) → Application → Local Storage to verify:

**After Login:**
- `adminToken`: JWT token string
- `adminTokenExpiry`: Timestamp (e.g., "1712345678901")
- `adminUser`: JSON string with user data

**After Logout/Expiry:**
- All three keys should be removed

## Reset for Clean Testing

To reset and test from scratch:
```javascript
// In browser console:
localStorage.clear();
// Then refresh page
```
