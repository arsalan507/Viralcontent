# Fix Upload Error - Quick Guide

## The Problem You're Seeing

```
Failed to load resource: the server responded with a status of 400
content.googleapis.com/discovery/v1/apis/drive/v3/rest?key=your_google_api_key_here

Upload error: Google Drive API credentials not configured
```

## Root Cause

The Google Drive API credentials are not configured. The app is using placeholder values (`your_google_api_key_here`) instead of actual credentials.

## Quick Fix (2 Steps)

### Step 1: Get Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → Enable Google Drive API
3. Create credentials:
   - **API Key** (for Drive API access)
   - **OAuth Client ID** (for user authentication)

**Detailed instructions:** See [GOOGLE_DRIVE_API_SETUP.md](GOOGLE_DRIVE_API_SETUP.md)

### Step 2: Configure Credentials

#### Option A: For Vercel (Production)

1. Go to [Vercel Environment Variables](https://vercel.com/tech-2xgs-projects/viral-content-analyzer/settings/environment-variables)

2. Add these variables for **Production**:
   ```
   VITE_GOOGLE_API_KEY=AIzaSy...  (your actual API key)
   VITE_GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com  (your actual client ID)
   ```

3. Redeploy:
   ```bash
   vercel --prod --yes
   ```

#### Option B: For Local Development

Edit `frontend/.env`:
```env
VITE_GOOGLE_API_KEY=AIzaSy...
VITE_GOOGLE_CLIENT_ID=123-abc.apps.googleusercontent.com
```

Restart server:
```bash
cd frontend
npm run dev
```

## After Configuration

1. Log in as Videographer
2. Try uploading a file
3. You'll see Google OAuth popup → Click "Allow"
4. File uploads successfully! ✅

## Alternative: Use Supabase Storage Instead

If you don't want to set up Google Drive, you can modify the code to use Supabase Storage:

1. Go to Supabase Dashboard → Storage
2. Create bucket "production-files"
3. Update the upload code to use Supabase instead of Google Drive

Let me know if you want me to implement this!

## Quick Checklist

- [ ] Google Cloud project created
- [ ] Google Drive API enabled
- [ ] API Key created and restricted
- [ ] OAuth Client ID created
- [ ] Credentials added to environment variables
- [ ] App redeployed (Vercel) or restarted (local)
- [ ] Test upload works

## Need Help?

Full setup guide: [GOOGLE_DRIVE_API_SETUP.md](GOOGLE_DRIVE_API_SETUP.md)

**The error will disappear once you add real API credentials!**
