# Quick Test - Dark Mode Toggle

## How to Test Dark Mode

### Test 1: Basic Toggle
1. Start the app: `npm run dev`
2. Login to the admin panel
3. Look at the top-right corner of the header
4. You should see a **moon icon** 🌙 (in light mode)
5. Click the moon icon
6. ✅ Theme should switch to dark mode
7. ✅ Icon should change to **sun icon** ☀️
8. Click the sun icon
9. ✅ Theme should switch back to light mode
10. ✅ Icon should change back to **moon icon** 🌙

### Test 2: Persistence
1. Switch to dark mode
2. Refresh the page (F5)
3. ✅ Theme should still be dark
4. ✅ Sun icon should still be visible
5. Close browser completely
6. Reopen and navigate to app
7. ✅ Theme should persist

### Test 3: New Tab/Window
1. Set theme to dark mode
2. Open a new tab
3. Navigate to the admin URL
4. ✅ Should load in dark mode automatically

### Test 4: Icon Visibility
**In Light Mode:**
- Moon icon (🌙) → Should be VISIBLE
- Sun icon (☀️) → Should be HIDDEN

**In Dark Mode:**
- Moon icon (🌙) → Should be HIDDEN
- Sun icon (☀️) → Should be VISIBLE

### Test 5: UI Elements Adaptation
Switch to dark mode and verify:
- [ ] Background turns dark
- [ ] Text becomes white/light
- [ ] Cards have dark background
- [ ] Sidebar adapts to dark theme
- [ ] Header adapts to dark theme
- [ ] Buttons adapt to dark theme
- [ ] Forms/inputs adapt to dark theme
- [ ] Tables adapt to dark theme

### Test 6: localStorage Verification
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Select your domain (e.g., `http://localhost:5173`)
5. Look for key: `hookouts_theme`
6. Value should be `"light"` or `"dark"`
7. Toggle theme
8. ✅ Value should update immediately

### Test 7: HTML Attributes
1. Open DevTools (F12)
2. Go to Elements tab
3. Find the `<html>` tag at the top
4. In light mode, should see:
   ```html
   <html data-bs-theme="light" class="light-mode">
   ```
5. Toggle to dark mode
6. ✅ Should change to:
   ```html
   <html data-bs-theme="dark" class="dark-mode">
   ```

## Expected Behavior Summary

| Action | Expected Result |
|--------|----------------|
| Click moon icon | ✅ Switch to dark mode |
| Click sun icon | ✅ Switch to light mode |
| Refresh page | ✅ Theme persists |
| Open new tab | ✅ Theme persists |
| Check localStorage | ✅ `hookouts_theme` key exists |
| Check HTML element | ✅ `data-bs-theme` attribute updates |
| All UI elements | ✅ Colors adapt to theme |

## Troubleshooting

### Icons not showing correctly?
**Check**: 
```javascript
// In browser console:
document.documentElement.getAttribute('data-bs-theme');
// Should return "light" or "dark"
```

### Theme not changing?
**Check**:
```javascript
// In browser console:
localStorage.getItem('hookouts_theme');
// Should return "light" or "dark"
```

### Force reset theme:
```javascript
// In browser console:
localStorage.removeItem('hookouts_theme');
location.reload();
// Will reset to default (light mode)
```

## Visual Checklist

When you click the toggle button, you should see:

**Light → Dark Transition:**
1. Background smoothly changes to dark
2. Text smoothly changes to light
3. Moon icon fades out
4. Sun icon fades in
5. All components adapt colors

**Dark → Light Transition:**
1. Background smoothly changes to light
2. Text smoothly changes to dark
3. Sun icon fades out
4. Moon icon fades in
5. All components adapt colors

## Success Criteria

✅ Toggle button is visible in header  
✅ Clicking toggle changes theme  
✅ Icon switches (moon ↔ sun)  
✅ Theme persists after refresh  
✅ All UI elements adapt properly  
✅ No console errors  
✅ Smooth transitions  

## Common Issues & Solutions

**Issue**: Button doesn't do anything
- **Solution**: Check browser console for errors
- **Verify**: `themeService` is imported correctly

**Issue**: Theme doesn't persist
- **Solution**: Check localStorage permissions
- **Verify**: No privacy extensions blocking storage

**Issue**: Some elements don't change color
- **Solution**: Those elements may need custom dark mode CSS
- **Add**: Custom styles in `index.css` with `[data-bs-theme="dark"]` selector

**Issue**: Icons both visible or both hidden
- **Solution**: Check CSS classes in App.css
- **Verify**: HTML has correct `data-bs-theme` attribute

## Reset Everything

To start fresh:
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();
// Reload page
location.reload();
```

This will reset to default light mode.
