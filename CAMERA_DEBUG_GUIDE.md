# Camera Scanner Debugging Guide

## Recent Fixes Applied

### 1. Enhanced Logging
- Added `[Camera]` prefix to all console logs for easy filtering
- Logs camera start, stream status, video dimensions, play status
- Logs errors with detailed messages

### 2. Loading Indicator
- Shows spinner while camera initializes
- "Initializing camera..." message
- Disappears when `isVideoReady` becomes true

### 3. Video Element Error Handling
- Added `onerror` handler to video element
- Checks for getUserMedia support before attempting
- Async/await on video.play() with error catch

### 4. Proper Cleanup
- Stops all media tracks on camera stop
- Removes all event listeners
- Resets all state variables

## Testing Steps

1. **Open Browser Console** (F12 → Console tab)
2. Navigate to `http://localhost:3000/upload`
3. Click "Camera Scanner" tab
4. Click "Start Camera"

## What to Check in Console

### Expected Success Flow:
```
[Camera] Starting camera with facing mode: environment
[Camera] Media stream obtained: true
[Camera] Video metadata loaded, dimensions: 1920 x 1080
[Camera] Video playing
[Camera] Video can play - ready!
[Camera] Camera activated
```

### Common Error Scenarios:

#### 1. Permission Denied
```
Camera access error: NotAllowedError: Permission denied
```
**Solution**: Allow camera permissions in browser

#### 2. No Camera Available
```
Camera access error: NotFoundError: Requested device not found
```
**Solution**: Check if camera is connected/available

#### 3. Camera Already in Use
```
Camera access error: NotReadableError: Could not start video source
```
**Solution**: Close other apps using camera (Zoom, Teams, etc.)

#### 4. HTTPS Required
```
Camera access error: NotAllowedError: Only secure origins are allowed
```
**Solution**: Use localhost or HTTPS

## Quick Fixes

### If Video Shows Black Screen:
1. Check console for "[Camera]" logs
2. Verify "Media stream obtained: true"
3. Check if "Video playing" appears
4. Look for video dimensions (should not be 0x0)

### If "Start Camera" Button Does Nothing:
1. Check browser permissions
2. Try different browser (Chrome/Edge recommended)
3. Check if HTTPS or localhost
4. Verify no console errors before clicking

### If Camera Works But Capture Fails:
1. Wait for button to enable (not greyed out)
2. Check "[Camera] Video can play - ready!" in console
3. Click capture and look for "[Camera] Capturing image" log
4. Should see "[Camera] Image captured successfully" + ID

## Browser Compatibility

✅ **Recommended**: Chrome, Edge, Safari (iOS)
⚠️ **Limited**: Firefox (may need different video constraints)
❌ **Not Supported**: Older browsers without MediaDevices API

## Mobile Testing

- **iOS**: Must be in Safari (not Chrome/Firefox)
- **Android**: Chrome or Firefox work
- **Permissions**: Must grant camera access when prompted

## Still Having Issues?

Check these in console:
```javascript
// Test if camera API is available
console.log('getUserMedia supported:', 
  !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

// List available devices
navigator.mediaDevices.enumerateDevices()
  .then(devices => console.log('Devices:', devices));
```

## Video Element Properties to Check

In console while camera is active:
```javascript
// Check video element
const video = document.querySelector('video');
console.log('Video src:', video.srcObject);
console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
console.log('Video ready state:', video.readyState); // Should be 4 (HAVE_ENOUGH_DATA)
console.log('Video paused:', video.paused); // Should be false
```
