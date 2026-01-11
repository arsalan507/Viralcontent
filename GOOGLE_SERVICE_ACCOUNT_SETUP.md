# Google Service Account Setup Guide

## What is a Service Account?

A Service Account is a special Google account that your application uses to access Google Drive **without requiring users to authenticate**. It acts like a "robot user" that uploads files on your behalf.

## Benefits

- ✅ **No OAuth popups** - Users upload directly without Google login
- ✅ **Centralized storage** - All files in one company Google Drive
- ✅ **Automated organization** - Files sorted by project/stage automatically
- ✅ **Secure** - Credentials stored on server, not exposed to users
- ✅ **Professional** - Enterprise-grade solution
- ✅ **Backend-agnostic** - Works with Vercel, Coolify, OVH, anywhere

---

## Step 1: Create Service Account

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create a new one)

### 1.2 Enable Google Drive API

1. Go to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

### 1.3 Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **Service Account**
3. Fill in details:
   - **Service account name**: `Production File Uploader`
   - **Service account ID**: `production-uploader` (auto-generated)
   - **Description**: `Handles file uploads to company Google Drive`
4. Click **CREATE AND CONTINUE**
5. **Grant this service account access** (optional - skip for now)
6. Click **DONE**

### 1.4 Create Service Account Key

1. Click on the service account you just created
2. Go to **KEYS** tab
3. Click **ADD KEY** → **Create new key**
4. Choose **JSON** format
5. Click **CREATE**
6. A JSON file will download - **SAVE THIS SECURELY**

The JSON file looks like:
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "production-uploader@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**⚠️ IMPORTANT**: This file contains sensitive credentials. Never commit it to Git!

---

## Step 2: Set Up Google Drive Folder Structure

### 2.1 Create Company Google Drive Account (Optional but Recommended)

1. Create a Google Workspace account or regular Gmail: `production@yourcompany.com`
2. This will be your centralized storage

### 2.2 Create Folder Structure

In this Google Drive account, create:

```
Production Files/
├── Raw Footage/
├── Edited Videos/
└── Final Videos/
```

### 2.3 Share Folders with Service Account

**This is crucial!** The service account needs access to upload files:

1. Right-click each folder → **Share**
2. Add the service account email (from JSON file):
   ```
   production-uploader@your-project.iam.gserviceaccount.com
   ```
3. Set permission to **Editor**
4. Click **Send** (don't require notification)

Repeat for all three folders.

### 2.4 Get Folder IDs

1. Open each folder in Google Drive
2. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/1a2b3c4d5e6f7g8h9i0j
                                          ^^^^^^^^^^^^^^^^^^^^
                                          This is the folder ID
   ```
3. Save these IDs - you'll need them for environment variables

---

## Step 3: Backend Implementation

### 3.1 Install Dependencies

```bash
cd backend
npm install googleapis multer
```

### 3.2 Create Upload Service

Create `backend/src/services/googleDriveUploadService.js`:

```javascript
const { google } = require('googleapis');
const stream = require('stream');

class GoogleDriveUploadService {
  constructor() {
    // Initialize with service account credentials
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS);

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
  }

  /**
   * Upload file to Google Drive
   * @param {Buffer} fileBuffer - File content
   * @param {string} fileName - Original file name
   * @param {string} mimeType - File MIME type
   * @param {string} folderId - Target folder ID
   * @returns {Promise<{fileId: string, webViewLink: string}>}
   */
  async uploadFile(fileBuffer, fileName, mimeType, folderId) {
    try {
      // Create readable stream from buffer
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);

      // Upload file
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: mimeType,
          body: bufferStream,
        },
        fields: 'id, webViewLink, webContentLink',
      });

      // Make file publicly accessible
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  /**
   * Delete file from Google Drive
   * @param {string} fileId - File ID to delete
   */
  async deleteFile(fileId) {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}

module.exports = new GoogleDriveUploadService();
```

### 3.3 Create Upload Endpoint

Add to `backend/src/index.js`:

```javascript
const multer = require('multer');
const googleDriveUploadService = require('./services/googleDriveUploadService');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max
  },
});

// Upload endpoint
app.post('/api/upload/raw-footage', verifyAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folderId = process.env.GOOGLE_DRIVE_RAW_FOOTAGE_FOLDER_ID;

    const result = await googleDriveUploadService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      folderId
    );

    res.json({
      success: true,
      fileId: result.fileId,
      webViewLink: result.webViewLink,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Similar endpoints for edited and final videos
app.post('/api/upload/edited-video', verifyAuth, upload.single('file'), async (req, res) => {
  // Same logic, but use GOOGLE_DRIVE_EDITED_VIDEO_FOLDER_ID
});

app.post('/api/upload/final-video', verifyAuth, upload.single('file'), async (req, res) => {
  // Same logic, but use GOOGLE_DRIVE_FINAL_VIDEO_FOLDER_ID
});
```

---

## Step 4: Environment Variables

### 4.1 Backend Environment Variables

Add to `backend/.env`:

```env
# Google Service Account (paste entire JSON as single line)
GOOGLE_SERVICE_ACCOUNT_CREDENTIALS={"type":"service_account","project_id":"..."}

# Folder IDs
GOOGLE_DRIVE_RAW_FOOTAGE_FOLDER_ID=1a2b3c4d5e6f7g8h9i0j
GOOGLE_DRIVE_EDITED_VIDEO_FOLDER_ID=2b3c4d5e6f7g8h9i0j1k
GOOGLE_DRIVE_FINAL_VIDEO_FOLDER_ID=3c4d5e6f7g8h9i0j1k2l
```

### 4.2 Frontend Environment Variables

Add to `frontend/.env`:

```env
# Backend URL (update when you move to Coolify)
VITE_BACKEND_URL=http://localhost:3001

# No Google API key needed anymore! Server handles it.
```

---

## Step 5: Frontend Changes

Update upload components to use backend endpoint instead of client-side Google Drive API.

I'll create the updated components in the next step.

---

## Step 6: Deploy to Any Platform

### On Vercel:
1. Add environment variables in Vercel dashboard
2. Deploy

### On Coolify + OVH:
1. Add environment variables in Coolify
2. Deploy

**Same code works everywhere!** Just update `VITE_BACKEND_URL` to your Coolify URL.

---

## Security Best Practices

1. ✅ **Never commit** service account JSON to Git
2. ✅ **Use environment variables** for credentials
3. ✅ **Restrict service account permissions** to only Drive access
4. ✅ **Verify user authentication** before allowing uploads
5. ✅ **Implement file size limits** to prevent abuse
6. ✅ **Add rate limiting** on upload endpoints

---

## Folder Organization Strategy

Files will be automatically organized:

```
Production Files/
├── Raw Footage/
│   ├── video1.mp4 (from Videographer)
│   ├── video2.mp4
├── Edited Videos/
│   ├── video1_edited.mp4 (from Editor)
│   ├── video2_edited.mp4
└── Final Videos/
    ├── video1_final.mp4
    ├── video2_final.mp4
```

**Optional enhancement**: Create project-specific subfolders automatically:
```
Raw Footage/
├── BCH-1001/
│   ├── take1.mp4
│   ├── take2.mp4
├── BCH-1002/
    ├── footage.mp4
```

---

## Next Steps

Would you like me to:

1. ✅ Create the complete backend service code?
2. ✅ Update frontend upload components?
3. ✅ Add automatic folder organization by project?
4. ✅ Create deployment guide for Coolify?

Let me know and I'll implement the complete solution!
