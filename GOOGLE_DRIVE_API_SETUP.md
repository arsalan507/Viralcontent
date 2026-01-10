# Google Drive API Setup Guide

## The Problem

You're getting a 400/502 error when uploading files because the Google Drive API credentials are not configured:

```
Failed to load resource: the server responded with a status of 400
content.googleapis.com/discovery/v1/apis/drive/v3/rest?key=your_google_api_key_here
```

## Solution: Set Up Google Drive API Credentials

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Name it something like "Viral Content Analyzer"

### Step 2: Enable Google Drive API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

### Step 3: Create API Credentials

#### A. Create API Key

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **API Key**
3. Copy the API key (something like `AIzaSyABC123...`)
4. Click **Edit API key** to restrict it:
   - **Application restrictions:** HTTP referrers
   - **Website restrictions:** Add your domains:
     - `http://localhost:5174/*`
     - `https://viral-content-analyzer.vercel.app/*`
     - `https://*.vercel.app/*`
   - **API restrictions:** Select "Restrict key"
     - Check "Google Drive API"
5. Save

#### B. Create OAuth 2.0 Client ID

1. Still in **Credentials**, click **+ CREATE CREDENTIALS** → **OAuth client ID**
2. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: "Viral Content Analyzer"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `../auth/drive.file` (or skip, we'll add in code)
   - Save and continue
3. Back to creating OAuth client ID:
   - Application type: **Web application**
   - Name: "Viral Content Analyzer Web Client"
   - **Authorized JavaScript origins:**
     - `http://localhost:5174`
     - `https://viral-content-analyzer.vercel.app`
   - **Authorized redirect URIs:**
     - `http://localhost:5174`
     - `https://viral-content-analyzer.vercel.app`
4. Click **Create**
5. Copy the **Client ID** (looks like `123456789-abc.apps.googleusercontent.com`)

### Step 4: Configure Your Application

#### For Local Development

Edit `frontend/.env`:

```env
# Google Drive API Configuration
VITE_GOOGLE_API_KEY=AIzaSyABC123...  # Your actual API key
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com  # Your actual client ID
```

#### For Vercel Production

1. Go to [Vercel Dashboard](https://vercel.com/tech-2xgs-projects/viral-content-analyzer/settings/environment-variables)
2. Add environment variables for **Production**, **Preview**, and **Development**:

```env
VITE_GOOGLE_API_KEY=AIzaSyABC123...
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

3. Redeploy:
```bash
vercel --prod --yes
```

### Step 5: Create Google Drive Folder (Optional)

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder called "Viral Content Production"
3. Right-click → Get link → Copy link
4. The link looks like: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`
5. Save this folder ID for later (or configure in Settings page)

### Step 6: Test the Setup

1. Restart your local development server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Log in as a Videographer

3. Try to upload a file

4. You should see:
   - Google OAuth popup asking for Drive permissions
   - Click "Allow"
   - File uploads successfully
   - ✅ No more 400/502 errors!

## Troubleshooting

### Error: "API key not valid"
- Make sure the API key is copied correctly
- Check that Google Drive API is enabled
- Verify the domain restrictions match your current URL

### Error: "redirect_uri_mismatch"
- Add your current URL to Authorized redirect URIs in OAuth client settings
- Make sure URLs match exactly (no trailing slashes)

### Error: "Access blocked: This app is not verified"
- During development, click "Advanced" → "Go to Viral Content Analyzer (unsafe)"
- For production, submit app for Google verification (or stay in testing mode)

### Upload works locally but not on Vercel
- Check that environment variables are set in Vercel
- Verify authorized origins include your Vercel domain
- Redeploy after adding env vars

## Security Best Practices

1. **API Key Restrictions:**
   - ✅ Restrict to specific domains
   - ✅ Restrict to Google Drive API only
   - ❌ Never commit API keys to git

2. **OAuth Client:**
   - ✅ Only allow your domains
   - ✅ Use popup mode for better UX
   - ✅ Request minimum required scopes

3. **Testing:**
   - Keep app in "Testing" mode for development
   - Add specific test users if needed
   - Publish when ready for production

## Alternative: Service Account (Not Recommended for This Use Case)

Service accounts are better for server-to-server operations. For user file uploads, OAuth is the right choice.

## Quick Reference

**What you need:**
1. Google Drive API enabled
2. API Key (with domain restrictions)
3. OAuth 2.0 Client ID (with authorized origins)
4. Both configured in environment variables

**Environment Variables:**
```env
VITE_GOOGLE_API_KEY=AIzaSy...
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

**Where to configure:**
- Local: `frontend/.env`
- Vercel: Settings → Environment Variables

## Cost

Google Drive API is **FREE** with these generous limits:
- 1 billion queries per day
- 10,000 queries per 100 seconds per user

You won't hit these limits with normal usage.

## Next Steps After Setup

1. ✅ Configure API credentials
2. ✅ Add to environment variables
3. ✅ Restart dev server / Redeploy Vercel
4. ✅ Test file upload
5. 🎉 Upload working!

---

**Need Help?**
- [Google Drive API Documentation](https://developers.google.com/drive/api/guides/about-sdk)
- [OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
