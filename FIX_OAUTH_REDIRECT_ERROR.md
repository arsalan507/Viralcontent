# Fix OAuth Redirect URI Mismatch Error

## The Error You're Seeing

```
Error 400: redirect_uri_mismatch
You can't sign in because this app sent an invalid request.
```

## Root Cause

The redirect URI configured in your Google Cloud Console doesn't match the one your app is sending. This is a security feature.

## How to Fix This

### Step 1: Check What URL Your App Is Using

Your app is currently running on:
- **Production:** `https://viral-content-analyzer.vercel.app`
- **Local:** `http://localhost:5174`

### Step 2: Update Google Cloud Console OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID and click **Edit**
4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:5174
   https://viral-content-analyzer.vercel.app
   ```

5. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:5174
   https://viral-content-analyzer.vercel.app
   http://localhost:5174/
   https://viral-content-analyzer.vercel.app/
   ```

6. Click **Save**

### Step 3: Wait 5 Minutes

Google OAuth changes can take 5-10 minutes to propagate. Wait a bit before testing again.

### Step 4: Test Again

1. Refresh your page (or clear browser cache)
2. Try uploading a file
3. Click "Allow" when Google popup appears
4. ✅ Should work now!

## Common Issues

### Issue 1: Multiple Vercel URLs

Vercel creates multiple URLs for your app:
- `https://viral-content-analyzer.vercel.app` (main)
- `https://viral-content-analyzer-b6noancau-tech-2xgs-projects.vercel.app` (deployment-specific)

**Solution:** Add all of them to authorized origins and redirect URIs.

To avoid this, you can:
1. Use only the main URL: `https://viral-content-analyzer.vercel.app`
2. Or use a wildcard pattern (if Google supports it): `https://*.vercel.app`

### Issue 2: Trailing Slash Mismatch

Some OAuth configs are sensitive to trailing slashes.

**Solution:** Add both versions:
- `https://viral-content-analyzer.vercel.app`
- `https://viral-content-analyzer.vercel.app/`

### Issue 3: HTTP vs HTTPS

Make sure you're using the correct protocol:
- Local: `http://localhost:5174` (HTTP)
- Production: `https://viral-content-analyzer.vercel.app` (HTTPS)

## Complete OAuth Configuration

Here's what your Google OAuth Client should have:

### Authorized JavaScript Origins
```
http://localhost:5174
http://localhost:5173
https://viral-content-analyzer.vercel.app
https://viral-content-analyzer-b6noancau-tech-2xgs-projects.vercel.app
https://*.vercel.app
```

### Authorized Redirect URIs
```
http://localhost:5174
http://localhost:5174/
http://localhost:5173
http://localhost:5173/
https://viral-content-analyzer.vercel.app
https://viral-content-analyzer.vercel.app/
https://viral-content-analyzer-b6noancau-tech-2xgs-projects.vercel.app
https://viral-content-analyzer-b6noancau-tech-2xgs-projects.vercel.app/
```

## Alternative: Use Popup Mode (Already Configured)

Your app is using popup mode for OAuth (`ux_mode: 'popup'` in the code), which is better than redirect mode. Make sure you still have the origins configured correctly.

## Code Location

The OAuth configuration is in:
- `frontend/src/services/googleDriveService.ts` (lines 49-55)

Current settings:
```typescript
this.tokenClient = google.accounts.oauth2.initTokenClient({
  client_id: config.clientId,
  scope: 'https://www.googleapis.com/auth/drive.file',
  callback: '', // Will be set per request
  redirect_uri: window.location.origin, // Uses current URL
  ux_mode: 'popup', // Popup instead of redirect
});
```

## Testing Checklist

After making changes:

- [ ] Added all URLs to Authorized JavaScript origins
- [ ] Added all URLs to Authorized redirect URIs
- [ ] Waited 5-10 minutes for changes to propagate
- [ ] Cleared browser cache
- [ ] Refreshed the page
- [ ] Tried file upload again
- [ ] Clicked "Allow" in Google popup
- [ ] ✅ Upload works!

## Still Not Working?

### Debug Steps

1. **Check browser console** for exact error message
2. **Copy the redirect_uri** from the error message
3. **Add that exact URI** to Google Cloud Console
4. **Save and wait** 5 minutes
5. **Try again**

### Get More Details

The error page usually shows:
- **Request Details** showing the URI being sent
- **Developer Details** with more info

Use that information to match your Google Cloud config.

## Quick Fix Summary

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your Vercel URL to **both** authorized origins AND redirect URIs:
   ```
   https://viral-content-analyzer.vercel.app
   ```
4. Save and wait 5 minutes
5. Test again!

---

**The error will disappear once the redirect URIs match!**
