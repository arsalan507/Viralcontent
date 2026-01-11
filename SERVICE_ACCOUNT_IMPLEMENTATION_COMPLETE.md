# Service Account Implementation - Complete Setup Guide

## ✅ What's Been Implemented

I've created a complete Google Drive Service Account integration that:

- ✅ **No OAuth popups** - Users upload directly without Google login
- ✅ **Centralized storage** - All files go to company Google Drive
- ✅ **Automatic folder organization** - Files sorted by project ID (e.g., BCH-1001)
- ✅ **Three upload types**: Raw Footage, Edited Videos, Final Videos
- ✅ **Backend-agnostic** - Works with Vercel, Coolify, OVH, anywhere
- ✅ **Secure** - Service account credentials stored on server only

---

## 📁 Files Created

### Backend:
1. **`backend/src/services/googleDriveUploadService.js`** - Service Account upload logic
2. **`backend/src/routes/uploadRoutes.js`** - API endpoints for uploads
3. **Updated `backend/src/index.js`** - Added upload routes
4. **Updated `backend/package.json`** - Added `googleapis` and `multer` dependencies
5. **Updated `backend/.env.example`** - Added service account config

### Documentation:
1. **`GOOGLE_SERVICE_ACCOUNT_SETUP.md`** - Complete setup instructions

---

## 🚀 Setup Instructions (Step by Step)

### Step 1: Create Google Service Account (5 minutes)

Follow the detailed instructions in [GOOGLE_SERVICE_ACCOUNT_SETUP.md](GOOGLE_SERVICE_ACCOUNT_SETUP.md) to:

1. Create a service account in Google Cloud Console
2. Enable Google Drive API
3. Download the service account JSON key file

**You'll get a file like:**
```json
{
  "type": "service_account",
  "project_id": "your-project-123",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n",
  "client_email": "production-uploader@your-project.iam.gserviceaccount.com",
  ...
}
```

### Step 2: Set Up Google Drive Folders (3 minutes)

1. **Create (or use existing) Google Drive account** for company storage
2. **Create folder structure**:
   ```
   Production Files/
   ├── Raw Footage/
   ├── Edited Videos/
   └── Final Videos/
   ```

3. **Share each folder with service account**:
   - Right-click folder → Share
   - Add: `production-uploader@your-project.iam.gserviceaccount.com`
   - Permission: **Editor**
   - Send (no notification needed)

4. **Get folder IDs** from URLs:
   ```
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                          ^^^^^^^^^^^^^^^^^^^
                                          This is the folder ID
   ```

### Step 3: Configure Backend Environment Variables

**Option A: For Local Development**

Edit `backend/.env`:
```env
PORT=3001
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173

# Paste the ENTIRE JSON file contents on ONE LINE (remove line breaks in private_key)
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"your-project-123","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n","client_email":"production-uploader@..."}

# Folder IDs from Step 2
GOOGLE_DRIVE_RAW_FOOTAGE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_DRIVE_EDITED_VIDEO_FOLDER_ID=2b3c4d5e6f7g8h9i0j1k
GOOGLE_DRIVE_FINAL_VIDEO_FOLDER_ID=3c4d5e6f7g8h9i0j1k2l
```

**⚠️ IMPORTANT**:
- The JSON must be on **ONE LINE**
- Replace `\n` in private_key with `\\n` (double backslash)
- No line breaks inside the JSON string

**Option B: For Coolify Deployment**

When you deploy to Coolify:
1. Go to your app in Coolify
2. Add environment variables (same as above)
3. Make sure to escape the JSON properly

### Step 4: Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `googleapis` - Google Drive API client
- `multer` - File upload handling

### Step 5: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on http://localhost:3001
📊 Health check: http://localhost:3001/health
📤 Upload endpoints: http://localhost:3001/api/upload/*
```

### Step 6: Test Upload (Optional)

Test with curl:
```bash
curl -X POST http://localhost:3001/api/upload/raw-footage \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT_TOKEN" \
  -F "file=@/path/to/video.mp4" \
  -F "projectId=BCH-1001" \
  -F "analysisId=uuid-here"
```

---

## 🌐 How It Works

### Upload Flow:

```
User (Browser)
    ↓ Selects video file
    ↓ Clicks upload
Frontend
    ↓ Sends file to backend API
Backend Server
    ↓ Uses Service Account credentials
    ↓ Uploads to Google Drive folder
Google Drive
    ✅ File stored in company account
    ✅ Organized by project (BCH-1001, etc.)
    ✅ Publicly shareable link created
Backend
    ↓ Returns shareable link
Frontend
    ✅ Saves link to database
    ✅ Shows success message
```

### Folder Organization:

Files are automatically organized like this:
```
Production Files/
├── Raw Footage/
│   ├── BCH-1001/           ← Project-specific folder (auto-created)
│   │   ├── take1.mp4
│   │   ├── take2.mp4
│   ├── BCH-1002/
│       ├── footage.mp4
├── Edited Videos/
│   ├── BCH-1001/
│       ├── final_edit.mp4
└── Final Videos/
    ├── BCH-1001/
        ├── published_video.mp4
```

---

## 🔧 API Endpoints

### Upload Raw Footage
```
POST /api/upload/raw-footage
Headers: Authorization: Bearer <token>
Body (multipart/form-data):
  - file: video file
  - projectId: "BCH-1001" (optional - creates subfolder)
  - analysisId: "uuid" (optional - for tracking)

Response:
{
  "success": true,
  "fileId": "1abc...",
  "fileName": "video.mp4",
  "webViewLink": "https://drive.google.com/file/d/1abc.../view",
  "webContentLink": "https://drive.google.com/uc?id=1abc...",
  "size": "52428800"
}
```

### Upload Edited Video
```
POST /api/upload/edited-video
(Same format as raw-footage)
```

### Upload Final Video
```
POST /api/upload/final-video
(Same format as raw-footage)
```

### Delete File
```
DELETE /api/upload/:fileId
Headers: Authorization: Bearer <token>
```

### Get File Metadata
```
GET /api/upload/:fileId/metadata
Headers: Authorization: Bearer <token>
```

---

## 🔐 Security Features

1. ✅ **Authentication required** - All endpoints verify Supabase JWT token
2. ✅ **File type validation** - Only video files allowed
3. ✅ **File size limit** - 500MB maximum
4. ✅ **Service account credentials** - Stored securely on server, never exposed to frontend
5. ✅ **Public links** - Files made publicly viewable (anyone with link)

---

## 🚀 Deployment to Coolify + OVH

When you migrate to Coolify:

1. **Deploy backend** to Coolify
2. **Add environment variables** in Coolify dashboard (same as Step 3)
3. **Update frontend** `VITE_BACKEND_URL` to point to Coolify URL
4. **That's it!** Everything else works the same

### Environment Variables in Coolify:

```env
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...}
GOOGLE_DRIVE_RAW_FOOTAGE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_DRIVE_EDITED_VIDEO_FOLDER_ID=2b3c4d5e6f7g8h9i0j1k
GOOGLE_DRIVE_FINAL_VIDEO_FOLDER_ID=3c4d5e6f7g8h9i0j1k2l
```

---

## 📊 Next Steps: Frontend Integration

To use this in the frontend, you'll need to:

1. **Create new upload component** that sends files to backend
2. **Replace Google Drive client-side upload** with backend API calls
3. **Update Videographer/Editor dashboards** to use new component

Would you like me to:
1. ✅ Create the frontend upload component?
2. ✅ Update VideographerDashboard to use backend uploads?
3. ✅ Update EditorDashboard to use backend uploads?

Let me know and I'll implement the frontend changes!

---

## 🎯 Benefits Summary

| Feature | Before (Client OAuth) | After (Service Account) |
|---------|----------------------|------------------------|
| User Experience | OAuth popup required | Direct upload, no popup |
| Storage Location | Each user's personal Drive | Centralized company Drive |
| Organization | Scattered, unorganized | Auto-organized by project |
| Access Control | Depends on individual | Centralized, consistent |
| Backend Portability | ✅ Works anywhere | ✅ Works anywhere |
| Security | Credentials in browser | Credentials on server only |
| Maintenance | Complex | Simple |

---

## ✅ Ready to Go!

The backend is **fully implemented and ready to use**. Just complete Steps 1-5 above and you'll have:

- ✅ Professional file uploads
- ✅ Centralized Google Drive storage
- ✅ Automatic project organization
- ✅ No OAuth popups
- ✅ Ready for Coolify migration

**Need help with setup? Let me know which step you're on and I'll assist!**
