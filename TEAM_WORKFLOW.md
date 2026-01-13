# Team Workflow Guide - Viral Content Analyzer

## 🌳 Git Branch Strategy

```
main (production - PROTECTED)
  │
  ├── develop (staging - Team integration)
  │     │
  │     ├── feature/VCA-101-form-builder-dropdown-fix
  │     ├── feature/VCA-102-add-video-preview
  │     └── feature/VCA-103-notification-system
  │
  └── hotfix/critical-bug-fix (Emergency fixes only)
```

### Branch Rules:
- **main**: Production code - NOBODY pushes directly
- **develop**: Integration branch - Features merge here first
- **feature/***: Individual tickets - Where team works
- **hotfix/***: Emergency production fixes only

---

## 🔒 Branch Protection Setup (GitHub)

### Protect `main` branch:
1. Go to: https://github.com/arsalan507/Viralcontent/settings/branches
2. Click "Add branch protection rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request reviews before merging (1 approval required)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators (YES - even you must follow rules!)
5. Save changes

### Protect `develop` branch:
1. Same as above but for `develop`
2. Require 1 approval before merging to develop

---

## 🗄️ Environment Setup

### You Need 3 Environments:

| Environment | Purpose | Database | Vercel | Who Uses |
|------------|---------|----------|---------|----------|
| **Production** | Live users | Supabase Production | `viral-content-analyzer.vercel.app` | Nobody directly |
| **Staging** | Pre-release testing | Supabase Development | `viral-content-analyzer-staging.vercel.app` | You (final review) |
| **Development** | Safe playground | Supabase Development | Local only | Your team |

---

## 📊 Supabase Database Setup

### Create Development Database:

#### Option A: Separate Supabase Project (Recommended)
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Name: `viral-content-analyzer-dev`
4. Copy the connection strings
5. Run your schema migrations on the new database

#### Option B: Use Branches (Supabase Pro feature)
- Supabase offers database branching (requires paid plan)

### Environment Variables:

**Production (.env.production):**
```bash
VITE_SUPABASE_URL=https://ckfbjsphyasborpnwbyy.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

**Development (.env.development):**
```bash
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-key
```

**Team Members' .env.local:**
```bash
# Each team member has this file (NOT committed to git)
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-key
```

---

## 🎫 Jira Setup & Ticket Creation

### 1. Create Jira Project:
- Go to https://your-company.atlassian.net
- Create project: **Viral Content Analyzer (VCA)**
- Project Key: `VCA`

### 2. Setup Workflow:
```
TO DO → IN PROGRESS → CODE REVIEW → TESTING → DONE
```

### 3. Create Epic Structure:
```
Epic: Form Builder Improvements (VCA-100)
  ├── Story: Fix dropdown field mapping (VCA-101)
  ├── Story: Add field validation (VCA-102)
  └── Bug: Form submission error (VCA-103)

Epic: User Management (VCA-200)
  ├── Story: Add user roles (VCA-201)
  ├── Story: Permission system (VCA-202)
  └── Story: Activity logs (VCA-203)
```

### 4. Ticket Template:

**Example Ticket: VCA-101**

**Title:** Fix dropdown field mapping for posting_profile

**Type:** Bug

**Description:**
```
**Problem:**
The posting_profile dropdown field is sending incorrect value type to database.
Error: "invalid input syntax for type uuid"

**Expected Behavior:**
- Dropdown should send UUID from profile_list table
- Form should submit successfully

**Technical Details:**
- File: frontend/src/services/analysesService.ts
- Field: posting_profile (db-dropdown)
- Database column: profile_id (UUID)

**Acceptance Criteria:**
- [ ] posting_profile dropdown sends valid UUID
- [ ] Form submission succeeds without 400 error
- [ ] Value correctly stored in viral_analyses.profile_id
- [ ] No console errors

**Branch:** feature/VCA-101-fix-posting-profile-mapping
```

**Assignee:** Fresh Developer 1

**Story Points:** 3

**Labels:** bug, form-builder, high-priority

---

## 👥 Team Member Workflow

### Setup (First Time):

1. **Clone Repository:**
```bash
git clone https://github.com/arsalan507/Viralcontent.git
cd Viralcontent
```

2. **Create develop branch (if doesn't exist):**
```bash
git checkout -b develop
git push -u origin develop
```

3. **Create .env.local file:**
```bash
cd frontend
cp .env.example .env.local
# Add development database credentials (NOT production!)
```

4. **Install dependencies:**
```bash
cd frontend
npm install
```

### Daily Workflow:

**Step 1: Pick a Jira Ticket**
- Go to Jira board
- Pick a ticket from "TO DO" column
- Move it to "IN PROGRESS"
- Note the ticket number (e.g., VCA-101)

**Step 2: Create Feature Branch**
```bash
# Always start from latest develop
git checkout develop
git pull origin develop

# Create feature branch (naming: feature/TICKET-short-description)
git checkout -b feature/VCA-101-fix-posting-profile
```

**Step 3: Work on Code**
```bash
# Make changes
# Test locally with: npm run dev

# Commit frequently with good messages
git add .
git commit -m "VCA-101: Fix posting_profile UUID mapping

- Add proper UUID validation
- Map posting_profile to profile_id column
- Add error handling for invalid UUIDs"
```

**Step 4: Push and Create Pull Request**
```bash
# Push feature branch
git push -u origin feature/VCA-101-fix-posting-profile
```

Then on GitHub:
1. Go to: https://github.com/arsalan507/Viralcontent/pulls
2. Click "New Pull Request"
3. Base: `develop` ← Compare: `feature/VCA-101-fix-posting-profile`
4. Title: `[VCA-101] Fix posting_profile dropdown UUID mapping`
5. Description:
```
## Jira Ticket
https://your-company.atlassian.net/browse/VCA-101

## Changes Made
- Fixed posting_profile field to send UUID instead of label
- Added validation in analysesService
- Updated form field resolver

## Testing Done
- [ ] Tested form submission with valid profile
- [ ] Verified UUID is correctly saved to database
- [ ] No console errors
- [ ] Form validation works

## Screenshots
[Attach screenshots of working form]
```
6. Move Jira ticket to "CODE REVIEW"
7. Assign PR to you for review

**Step 5: Address Review Comments**
```bash
# If changes requested
git add .
git commit -m "VCA-101: Address review comments - Add null check"
git push
```

**Step 6: After Merge**
```bash
# After you approve and merge
git checkout develop
git pull origin develop

# Delete local feature branch
git branch -d feature/VCA-101-fix-posting-profile
```

---

## 🚀 Deployment Workflow

### Automatic Deployments (Vercel):

**Setup Vercel Projects:**

1. **Production (main branch):**
   - Project: `viral-content-analyzer`
   - Domain: `viral-content-analyzer.vercel.app`
   - Auto-deploy from: `main` branch
   - Environment: Production Supabase

2. **Staging (develop branch):**
   - Project: `viral-content-analyzer-staging`
   - Domain: `viral-content-analyzer-staging.vercel.app`
   - Auto-deploy from: `develop` branch
   - Environment: Development Supabase

### Deployment Flow:
```
feature/VCA-101 → (PR) → develop → (Auto-deploy) → Staging
                                         ↓
                                    (You test)
                                         ↓
                                    (Approve)
                                         ↓
develop → (PR) → main → (Auto-deploy) → Production
```

---

## ✅ Review Checklist (For You)

### When Reviewing Pull Requests:

#### Code Quality:
- [ ] Code follows project conventions
- [ ] No hardcoded credentials or secrets
- [ ] Proper error handling
- [ ] Console.logs removed (or using proper logger)
- [ ] TypeScript types are correct

#### Functionality:
- [ ] Feature works as described in ticket
- [ ] No breaking changes to existing features
- [ ] Database migrations included (if needed)
- [ ] Tests pass (if you have tests)

#### Security:
- [ ] No SQL injection vulnerabilities
- [ ] Input validation present
- [ ] Authentication/authorization checks in place
- [ ] No exposed API keys

#### Documentation:
- [ ] README updated (if needed)
- [ ] Comments for complex logic
- [ ] API documentation updated

---

## 🔐 Security Best Practices

### What Team Members Should NEVER Have:

❌ Production database credentials
❌ Production Supabase project access
❌ Production Vercel project access
❌ Direct access to main branch

### What They Should Have:

✅ Development database credentials
✅ Access to Jira
✅ Access to GitHub repository (but not main/develop write access)
✅ Slack/Discord for communication

---

## 📝 Git Commit Message Format

```
VCA-XXX: Short description (50 chars max)

- Detailed point 1
- Detailed point 2
- Detailed point 3

Closes VCA-XXX
```

**Examples:**
```bash
git commit -m "VCA-101: Fix posting_profile UUID mapping

- Add proper validation in analysesService
- Update form field resolver to send UUID
- Add error handling for invalid profiles

Closes VCA-101"
```

---

## 🐛 Emergency Hotfix Workflow

If production breaks:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-form-error

# Fix the issue
# ... make changes ...

# Commit and push
git commit -m "hotfix: Fix critical form submission error"
git push -u origin hotfix/critical-form-error

# Create PR to main (bypass normal develop flow)
# After merge, also merge hotfix back to develop
git checkout develop
git merge hotfix/critical-form-error
git push origin develop
```

---

## 📞 Getting Help

### For Team Members:

1. **Stuck on a ticket?**
   - Comment on Jira ticket
   - Message on Slack/Discord
   - Create draft PR and ask for guidance

2. **Merge conflicts?**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/VCA-XXX-your-branch
   git merge develop
   # Resolve conflicts
   git commit
   git push
   ```

3. **Accidentally committed to main?**
   - STOP immediately
   - Message lead developer (you)
   - Don't push!

---

## 📊 Success Metrics

Track these weekly:
- Number of tickets completed
- Average PR review time
- Number of bugs introduced vs fixed
- Code review feedback trends

---

## 🎓 Training Checklist for New Team Members

Before starting:
- [ ] Read this workflow document
- [ ] Setup local development environment
- [ ] Can run project locally
- [ ] Understand git branching model
- [ ] Know how to create a PR
- [ ] Understand Jira workflow
- [ ] Have access to development database only

---

## 📚 Additional Resources

- [Git Branching Best Practices](https://nvie.com/posts/a-successful-git-branching-model/)
- [Writing Good Commit Messages](https://chris.beams.io/posts/git-commit/)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)
- [Jira Workflow Guide](https://www.atlassian.com/agile/project-management/workflow)
