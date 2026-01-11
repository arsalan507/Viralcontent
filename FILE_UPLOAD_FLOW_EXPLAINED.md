# File Upload Flow - Where Videos Are Stored

## Current Setup

### Videographer Upload Flow

**Files uploaded by videographers go to:**

1. **Google Drive Account**: The **videographer's personal Google Drive** account
2. **Folder**: Determined by `localStorage.getItem('default_drive_folder')`
   - This is set in Settings (if configured)
   - If not set, files go to **root of videographer's Google Drive**

**How it works:**
```
Videographer clicks "Upload to Google Drive"
  ↓
Google OAuth popup appears (asks for Drive permission)
  ↓
Videographer authorizes with THEIR Google account
  ↓
File uploads to THEIR Google Drive (in the configured folder or root)
  ↓
File is made publicly viewable (anyone with link can view)
  ↓
Shareable link is saved to database
```

**Code location:** [VideographerDashboard.tsx:504-523](frontend/src/pages/VideographerDashboard.tsx#L504-L523)

```typescript
<GoogleDriveUploader
  folderId={
    googleDriveService.extractFolderId(
      localStorage.getItem('default_drive_folder') || ''
    ) || undefined
  }
/>
```

---

### Editor Upload Flow

**Files uploaded by editors go to:**

1. **Editor's personal Google Drive** (manual upload)
2. **Then editor pastes the shareable link** into the app

**How it works:**
```
Editor manually uploads video to their Google Drive
  ↓
Editor gets shareable link from Google Drive
  ↓
Editor pastes link into "File URL" field
  ↓
Link is saved to database
```

**Code location:** [EditorDashboard.tsx:582-592](frontend/src/pages/EditorDashboard.tsx#L582-L592)

```typescript
<input
  type="url"
  value={fileUrl}
  placeholder="https://drive.google.com/file/d/..."
/>
<p>Upload the edited video to Google Drive first, then paste the shareable link here</p>
```

---

## The Problem

**Files are scattered across multiple personal Google Drive accounts:**

- ❌ Raw footage → Videographer's personal Drive
- ❌ Edited videos → Editor's personal Drive
- ❌ Final videos → Could be anyone's Drive
- ❌ No centralized storage
- ❌ No organization by project
- ❌ Files can be deleted by the person who uploaded them
- ❌ Access depends on individual permissions

---

## Better Solution: Centralized Storage

### Option 1: Company Google Drive (Recommended)

Create a **single company Google Drive account** for all production files:

**Benefits:**
- ✅ All files in one place
- ✅ Organized folder structure (by project, stage, etc.)
- ✅ Files don't disappear if team member leaves
- ✅ Centralized access control
- ✅ Easy backup and management

**Setup:**
1. Create company Google account (e.g., `production@yourcompany.com`)
2. Get API credentials for this account
3. Configure app to use these credentials
4. All uploads go to this account

**Folder Structure:**
```
Company Google Drive
├── Raw Footage/
│   ├── Project1/
│   ├── Project2/
├── Edited Videos/
│   ├── Project1/
│   ├── Project2/
├── Final Videos/
│   ├── Project1/
│   ├── Project2/
```

### Option 2: Supabase Storage

Use Supabase's built-in storage instead of Google Drive:

**Benefits:**
- ✅ Integrated with your database
- ✅ Built-in access control (RLS policies)
- ✅ No OAuth popup required
- ✅ Direct upload from app
- ✅ No external dependencies

**Downsides:**
- ❌ Storage costs (but reasonable)
- ❌ 50MB file size limit on free tier
- ❌ Less familiar interface than Google Drive

### Option 3: Service Account (Most Professional)

Use Google Drive Service Account for automated uploads:

**Benefits:**
- ✅ No OAuth popup for users
- ✅ Centralized company Drive
- ✅ Automated folder organization
- ✅ Professional setup

**How it works:**
- Service account acts as a "robot user"
- Uploads files on behalf of users
- Files go to company Drive automatically
- No individual authorization needed

---

## Current Configuration

**Where to set the default folder:**

The app looks for `default_drive_folder` in `localStorage`, which should be set somewhere (likely in Settings page).

**To check current folder:**
1. Open browser console on the app
2. Run: `localStorage.getItem('default_drive_folder')`
3. If `null`, files go to root of each user's personal Drive

---

## Recommendation

**For production use, implement Option 1 (Company Google Drive):**

1. Create `production@yourcompany.com` Google account
2. Set up folder structure
3. Get API credentials for this account
4. Update app to use these credentials globally
5. All team members upload to the same account/folders

This ensures all production files are:
- ✅ Centralized
- ✅ Organized
- ✅ Backed up
- ✅ Accessible to all team members
- ✅ Not dependent on individual accounts

---

## Questions to Answer

1. **Do you have a company Google account for production files?**
   - If yes: Let's configure the app to use it
   - If no: Should we create one?

2. **How do you want files organized?**
   - By project?
   - By stage (raw/edited/final)?
   - By date?

3. **Who should have access to view files?**
   - Only team members?
   - Clients too?
   - Public?

Let me know your preference and I'll help implement the solution!
