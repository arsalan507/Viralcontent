# Service Account - Quick Start Guide ⚡

## What You Have Now

✅ **Complete backend implementation** for Google Drive Service Account uploads
✅ **No OAuth popups** - users upload directly
✅ **Centralized storage** - all files in company Google Drive
✅ **Auto-organized** by project (BCH-1001, BCH-1002, etc.)
✅ **Works with Coolify** - backend-agnostic implementation

---

## 5-Minute Setup Checklist

### ☐ Step 1: Google Cloud Console (3 min)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Drive API
3. Create Service Account → Download JSON key file
4. Save the JSON file securely

### ☐ Step 2: Google Drive Folders (2 min)
1. Create folders: `Raw Footage/`, `Edited Videos/`, `Final Videos/`
2. Share each with service account email (from JSON file)
3. Copy folder IDs from URLs

### ☐ Step 3: Backend Config (1 min)
Edit `backend/.env`:
```env
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account",...paste entire JSON...}
GOOGLE_DRIVE_RAW_FOOTAGE_FOLDER_ID=folder_id_here
GOOGLE_DRIVE_EDITED_VIDEO_FOLDER_ID=folder_id_here
GOOGLE_DRIVE_FINAL_VIDEO_FOLDER_ID=folder_id_here
```

### ☐ Step 4: Install & Start (1 min)
```bash
cd backend
npm install
npm run dev
```

### ☐ Step 5: Test (optional)
Visit: http://localhost:3001/health
Should see: `{"status":"ok"}`

---

## What Happens When Users Upload

```
Videographer clicks "Upload Video"
         ↓
File sent to YOUR backend server
         ↓
Backend uses Service Account to upload
         ↓
File stored in COMPANY Google Drive
         ↓
Organized automatically: Raw Footage/BCH-1001/video.mp4
         ↓
Shareable link saved to database
         ✅ DONE!
```

**No Google login popup. No personal Drive accounts. All centralized.**

---

## File Organization Example

```
🗂️ Company Google Drive
   └── Production Files/
       ├── Raw Footage/
       │   ├── BCH-1001/        ← Auto-created per project
       │   │   ├── take1.mp4
       │   │   ├── take2.mp4
       │   ├── BCH-1002/
       │       ├── shoot.mp4
       ├── Edited Videos/
       │   ├── BCH-1001/
       │       ├── final.mp4
       └── Final Videos/
           ├── BCH-1001/
               ├── published.mp4
```

---

## API Endpoints Available

| Endpoint | Purpose | Who Uses |
|----------|---------|----------|
| `POST /api/upload/raw-footage` | Upload raw video | Videographers |
| `POST /api/upload/edited-video` | Upload edited video | Editors |
| `POST /api/upload/final-video` | Upload final video | Admins |
| `DELETE /api/upload/:fileId` | Delete file | Anyone (authorized) |

All require authentication (Supabase JWT token).

---

## Migration to Coolify

When you move to Coolify + OVH:

1. Deploy backend to Coolify
2. Add same environment variables
3. Update frontend `VITE_BACKEND_URL` to Coolify URL
4. ✅ Done! Same code, same setup

**No code changes needed!**

---

## Next Steps

### Option A: Use It Now (Backend Ready)
- Backend is fully implemented
- Just complete setup steps above
- Frontend components can be added later

### Option B: Complete Frontend Integration
Would you like me to:
- ✅ Create new upload component for frontend
- ✅ Update VideographerDashboard to use backend upload
- ✅ Update EditorDashboard to use backend upload

Let me know!

---

## Files Created

✅ `backend/src/services/googleDriveUploadService.js` - Upload service
✅ `backend/src/routes/uploadRoutes.js` - API endpoints
✅ `backend/package.json` - Updated dependencies
✅ `backend/.env.example` - Config template
✅ `GOOGLE_SERVICE_ACCOUNT_SETUP.md` - Detailed setup guide
✅ `SERVICE_ACCOUNT_IMPLEMENTATION_COMPLETE.md` - Full documentation

---

## Questions?

- **"Where do files go?"** → Your company Google Drive (centralized)
- **"Do users need Google accounts?"** → No! Direct upload via your backend
- **"Will this work on Coolify?"** → Yes! Backend-agnostic design
- **"Is it secure?"** → Yes! Service account credentials on server only
- **"How are files organized?"** → Automatically by project ID and type

---

**Ready to set it up? Follow the checklist above or see full guide in [GOOGLE_SERVICE_ACCOUNT_SETUP.md](GOOGLE_SERVICE_ACCOUNT_SETUP.md)!**
