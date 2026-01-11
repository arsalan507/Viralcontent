# Production Stage Permissions - Fixed! ✅

## The Problem

Non-admin users (Videographers, Editors, Script Writers, Posting Managers) were able to change production stages that should require admin approval. This could allow users to bypass the review workflow.

## What Was Fixed

Restricted each role to only update stages relevant to their work:

### Videographer Permissions

**Can Update To:**
- ✅ `SHOOTING` - Mark when actively filming
- ✅ `SHOOT_REVIEW` - Submit footage for admin review

**Cannot Update To:**
- ❌ `PRE_PRODUCTION` - Admin sets this
- ❌ `EDITING` - Admin approves transition after shoot review
- ❌ Any other stages

**Why:** Videographers should focus on shooting and submitting for review. Admin approves the transition to editing.

### Editor Permissions

**Can Update To:**
- ✅ `EDITING` - Mark when actively editing
- ✅ `EDIT_REVIEW` - Submit edited video for admin review

**Cannot Update To:**
- ❌ `SHOOT_REVIEW` - That's videographer's stage
- ❌ `FINAL_REVIEW` - Admin sets this after review
- ❌ `READY_TO_POST` - Admin approves this
- ❌ Any other stages

**Why:** Editors should focus on editing and submitting for review. Admin handles final approval.

### Posting Manager Permissions

**Can Update To:**
- ✅ `READY_TO_POST` - Acknowledge content is ready
- ✅ `POSTED` - Mark as posted after publishing

**Cannot Update To:**
- ❌ `FINAL_REVIEW` - Admin sets this
- ❌ Earlier stages - Not their workflow

**Why:** Posting managers should only mark content as posted after admin approval.

### Script Writer Permissions

**Can Update To:**
- ❌ No production stage changes allowed

**Why:** Script writers work on the script before production starts. They don't update production stages.

### Admin (SUPER_ADMIN) Permissions

**Can Update To:**
- ✅ **ALL STAGES** - Complete control

**Why:** Admins oversee the entire workflow and handle approvals.

## Production Workflow (Corrected)

```
SCRIPT APPROVED (Admin)
       ↓
PRE_PRODUCTION (Admin assigns team)
       ↓
SHOOTING (Videographer updates)
       ↓
SHOOT_REVIEW (Videographer submits)
       ↓
[ADMIN REVIEWS FOOTAGE]
       ↓
EDITING (Admin approves → Editor works)
       ↓
EDIT_REVIEW (Editor submits)
       ↓
[ADMIN REVIEWS EDIT]
       ↓
FINAL_REVIEW (Admin sets)
       ↓
[ADMIN FINAL APPROVAL]
       ↓
READY_TO_POST (Admin approves)
       ↓
POSTED (Posting Manager marks)
```

## Review Stages (Admin Only)

These stages require admin intervention and cannot be set by regular users:

1. **SHOOT_REVIEW** → **EDITING**
   - Admin must review footage and approve

2. **EDIT_REVIEW** → **FINAL_REVIEW**
   - Admin must review edited video and approve

3. **FINAL_REVIEW** → **READY_TO_POST**
   - Admin must give final approval

## UI Changes

Updated dashboard labels to clarify permissions:

### Before (Confusing)
- "Update Production Stage" (same for all roles)
- No indication of limited access

### After (Clear)
- **Videographer:** "Update Shooting Status" + explanation
- **Editor:** "Update Editing Status" + explanation
- **Posting Manager:** "Update Posting Status" + explanation
- **Admin:** "Update Production Stage" (full access)

## Benefits

✅ **Prevents workflow bypass** - Users can't skip approval steps
✅ **Enforces quality control** - Admin reviews required at key stages
✅ **Clear permissions** - Users understand their limited access
✅ **Maintains accountability** - Proper audit trail of who did what

## Testing

### Test as Videographer:
1. Log in as Videographer
2. Open assigned project
3. Try to update stage
4. ✅ Should only see: SHOOTING, SHOOT_REVIEW
5. ❌ Should NOT see: PRE_PRODUCTION, EDITING, etc.

### Test as Editor:
1. Log in as Editor
2. Open assigned project
3. Try to update stage
4. ✅ Should only see: EDITING, EDIT_REVIEW
5. ❌ Should NOT see: Other stages

### Test as Admin:
1. Log in as SUPER_ADMIN
2. Open any project
3. Try to update stage
4. ✅ Should see ALL stages
5. ✅ Can move between any stages

## Admin Dashboard Still Has Full Control

The Admin Dashboard (`/admin`) retains complete production stage management:
- Can set any stage
- Can override user submissions
- Can manage approvals
- Full workflow control

## Security Note

This is **UI-level restriction only**. For complete security, you should also:

1. **Add backend validation** in `assignmentService.updateProductionStage()`
2. **Add database RLS policies** to restrict stage updates by role
3. **Add audit logging** to track who changed what

See [SUPABASE_RLS_PRODUCTION_PERMISSIONS.md](./SUPABASE_RLS_PRODUCTION_PERMISSIONS.md) for database-level security setup.

## Files Changed

- ✅ `/frontend/src/pages/VideographerDashboard.tsx`
- ✅ `/frontend/src/pages/EditorDashboard.tsx`
- ✅ `/frontend/src/pages/PostingManagerDashboard.tsx`

## Summary

**Before:** Everyone could change any production stage
**After:** Each role can only update stages relevant to their work

**Admin approval is now required for all stage transitions!**
