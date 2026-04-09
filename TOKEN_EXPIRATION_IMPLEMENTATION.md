# Token Expiration & Auto-Login Implementation

## Overview
This implementation ensures that admin users must re-authenticate when:
1. Token expires (30 minutes)
2. Opening a new browser tab/window
3. Token becomes invalid

## Changes Made

### Backend Changes

#### 1. Updated JWT Token Expiration
**File**: `hookouts.backend/src/utils/adminJwt.ts`
- Changed token expiration from `1d` (1 day) to `30m` (30 minutes)
- This ensures tokens are short-lived for better security

### Frontend Changes

#### 2. Enhanced Authentication Service
**File**: `hookouts.admin/src/services/authService.ts`

**Changes**:
- Added `adminTokenExpiry` timestamp storage during login
- Updated `isAuthenticated()` to check token expiration time
- Added `clearAuth()` method to properly clear all auth data
- Modified `logout()` to clear expiry timestamp as well

**How it works**:
```typescript
// During login, store expiry time (30 minutes from now)
const expiryTime = Date.now() + 30 * 60 * 1000;
localStorage.setItem('adminTokenExpiry', expiryTime.toString());

// When checking authentication, verify expiry
const expiry = parseInt(localStorage.getItem('adminTokenExpiry'), 10);
if (Date.now() >= expiry) {
  // Token expired, clear auth
  this.clearAuth();
  return false;
}
```

#### 3. Updated Protected Routes
**File**: `hookouts.admin/src/components/ProtectedRoute.tsx`

**Changes**:
- Enhanced comments to clarify token expiry checking
- Now properly redirects to login when token is expired
- Preserves intended destination for post-login redirect

#### 4. Enhanced Auth Hook with Periodic Validation
**File**: `hookouts.admin/src/hooks/useAuth.ts`

**Changes**:
- Added periodic token validation (checks every 60 seconds)
- Automatically logs out user when token expires
- Clears auth data on initialization if token is invalid
- Properly handles missing user data

**Features**:
- Real-time token expiry detection
- Automatic logout without page refresh
- Cleanup on component unmount

#### 5. Updated API Interceptor
**File**: `hookouts.admin/src/services/api.ts`

**Changes**:
- Clears `adminTokenExpiry` on 401 errors
- Only redirects to login if not already on login page
- Better error handling for expired tokens

#### 6. Simplified Login Page
**File**: `hookouts.admin/src/pages/AdminLogin.tsx`

**Changes**:
- Removed unnecessary console logging
- Cleaner authentication check on mount

## How It Works Now

### Scenario 1: Token Expires (30 minutes)
1. User is working on the admin panel
2. After 30 minutes, token expires
3. Next API call or route change triggers auth check
4. User is automatically redirected to login page
5. Must re-enter credentials to continue

### Scenario 2: Opening New Browser Tab/Window
1. User opens a new tab and navigates to admin URL
2. `useAuth` hook initializes and checks token
3. If token exists but is expired → redirects to login
4. If token exists and valid → allows access
5. If no token → redirects to login

### Scenario 3: Manual URL Navigation
1. User manually changes URL to a protected route
2. `ProtectedRoute` component checks authentication
3. Validates token expiry via `authService.isAuthenticated()`
4. If expired → redirects to login with intended destination saved
5. After login → redirects back to intended page

### Scenario 4: Periodic Background Check
1. User is logged in and active
2. Every 60 seconds, background check runs
3. If token expired during inactivity → auto-logout
4. User sees login page immediately

## Security Benefits

✅ **Short-lived tokens**: 30-minute expiration reduces security risk  
✅ **Automatic logout**: No lingering sessions  
✅ **New tab verification**: Forces re-authentication on new contexts  
✅ **Real-time validation**: Checks happen on every route change  
✅ **Background monitoring**: Periodic checks catch expired tokens  
✅ **Clean state management**: Proper cleanup of auth data  

## Testing Checklist

- [ ] Login with valid credentials → should work
- [ ] Wait 30 minutes without activity → should auto-logout
- [ ] Open new tab while logged in → should require login if token expired
- [ ] Try accessing protected route after token expiry → should redirect to login
- [ ] Make API call after token expiry → should get 401 and redirect to login
- [ ] Logout manually → should clear all auth data including expiry
- [ ] Login again after expiry → should work normally

## Configuration

To adjust token expiration time:

**Backend** (`hookouts.backend/src/utils/adminJwt.ts`):
```typescript
expiresIn: '30m' // Change to desired duration: '15m', '1h', etc.
```

**Frontend** (`hookouts.admin/src/services/authService.ts`):
```typescript
const expiryTime = Date.now() + 30 * 60 * 1000; // Match backend duration in milliseconds
```

**Validation interval** (`hookouts.admin/src/hooks/useAuth.ts`):
```typescript
}, 60000); // Check every 60 seconds (60000ms)
```

## Notes

- Tokens are still stored in `localStorage` for persistence across page refreshes
- The 30-minute window provides a balance between security and usability
- Users will need to log in again if they leave the tab open for more than 30 minutes
- All auth data is properly cleaned up on logout or expiry
