# 🎓 New Team Member Onboarding Checklist

## Day 1: Setup & Access

### Account Setup
- [ ] GitHub account created: _______________
- [ ] Added to GitHub repository: https://github.com/arsalan507/Viralcontent
- [ ] Jira account created: _______________
- [ ] Added to Jira project: VCA
- [ ] Slack/Discord invite sent
- [ ] Development database credentials received (save in password manager!)

### Local Environment Setup

#### 1. Install Required Tools
```bash
# Check if installed:
node --version  # Should be v18+
npm --version   # Should be v9+
git --version   # Should be v2.30+

# If not installed, download from:
# Node.js: https://nodejs.org/
# Git: https://git-scm.com/
```

#### 2. Clone Repository
```bash
# Navigate to your projects folder
cd ~/Projects  # Or wherever you keep projects

# Clone the repository
git clone https://github.com/arsalan507/Viralcontent.git
cd Viralcontent

# Verify you're on main branch
git branch
# Should show: * main
```

#### 3. Create develop Branch
```bash
# Create and switch to develop branch
git checkout -b develop origin/develop

# Or if develop doesn't exist yet:
git checkout -b develop
git push -u origin develop
```

#### 4. Setup Environment Variables
```bash
# Navigate to frontend folder
cd frontend

# Create .env.local file (NOT tracked in git)
touch .env.local

# Open in your editor and add:
nano .env.local
```

**Add these lines to .env.local:**
```bash
# DEVELOPMENT DATABASE - DO NOT USE PRODUCTION!
VITE_SUPABASE_URL=https://[ASK_LEAD_FOR_DEV_URL].supabase.co
VITE_SUPABASE_ANON_KEY=[ASK_LEAD_FOR_DEV_KEY]
```

**⚠️ IMPORTANT:** Get dev credentials from lead developer. NEVER use production credentials!

#### 5. Install Dependencies
```bash
# Install all npm packages
npm install

# This might take 2-3 minutes
# You should see: "added XXX packages"
```

#### 6. Start Development Server
```bash
# Start the app locally
npm run dev

# You should see:
# VITE v7.3.1  ready in XXX ms
# ➜  Local:   http://localhost:5173/

# Open browser to: http://localhost:5173/
```

#### 7. Verify Setup
- [ ] App loads in browser without errors
- [ ] Can see login page
- [ ] Console has no red errors
- [ ] Can login with test account

---

## Day 2: Learn the Codebase

### Read Documentation
- [ ] Read [TEAM_WORKFLOW.md](./TEAM_WORKFLOW.md)
- [ ] Read [JIRA_TICKET_EXAMPLES.md](./JIRA_TICKET_EXAMPLES.md)
- [ ] Read [README.md](./README.md)
- [ ] Understand git branching strategy

### Code Exploration
- [ ] Understand folder structure:
  ```
  frontend/
    src/
      components/     ← React components
      pages/          ← Page components
      services/       ← API calls, business logic
      utils/          ← Helper functions
      types/          ← TypeScript types
  ```

- [ ] Find these important files:
  - [ ] `src/services/analysesService.ts` - Analysis CRUD operations
  - [ ] `src/components/DynamicAnalysisForm.tsx` - Main form component
  - [ ] `src/services/formBuilderService.ts` - Form configuration
  - [ ] `src/utils/formFieldResolver.ts` - Field option resolution

### Watch a Demo
- [ ] Lead developer demonstrates:
  - Creating new analysis
  - Using Form Builder
  - Reviewing analyses
  - Admin features

---

## Day 3: First Ticket

### Pick Your First Ticket
- [ ] Go to Jira board
- [ ] Pick a ticket marked "good-first-issue"
- [ ] Read ticket thoroughly
- [ ] Ask questions if anything is unclear

### Create Feature Branch
```bash
# Make sure you're on develop and it's up to date
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/VCA-XXX-short-description

# Example:
# git checkout -b feature/VCA-101-fix-dropdown-mapping
```

### Make Your First Commit
```bash
# After making changes
git status  # See what you changed

git add .   # Stage all changes

git commit -m "VCA-XXX: Brief description

- Detailed point 1
- Detailed point 2

Closes VCA-XXX"

# Push to GitHub
git push -u origin feature/VCA-XXX-short-description
```

### Create Pull Request
- [ ] Go to: https://github.com/arsalan507/Viralcontent/pulls
- [ ] Click "New Pull Request"
- [ ] Base: `develop` ← Compare: `feature/VCA-XXX-...`
- [ ] Fill PR template
- [ ] Assign to lead developer for review
- [ ] Update Jira ticket status to "Code Review"

---

## Common Commands Cheat Sheet

### Git Commands
```bash
# Check current branch
git branch

# Switch branches
git checkout branch-name

# Pull latest changes
git pull origin develop

# See what you changed
git status
git diff

# Undo uncommitted changes
git restore file-name.ts

# Undo last commit (keep changes)
git reset HEAD~1

# Update your branch with latest develop
git checkout develop
git pull origin develop
git checkout feature/VCA-XXX-...
git merge develop
```

### npm Commands
```bash
# Start dev server
npm run dev

# Build for production (to check for errors)
npm run build

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint --fix
```

### Debugging Commands
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear npm cache
npm cache clean --force

# Check TypeScript errors
npx tsc --noEmit
```

---

## 🆘 When You're Stuck

### Problem: Git Merge Conflicts
```bash
# Solution 1: Use your changes
git checkout --theirs file-name.ts

# Solution 2: Use develop's changes
git checkout --ours file-name.ts

# Solution 3: Manual resolution
# Open file, look for <<<<<<< markers
# Edit to keep what you want
# Remove conflict markers
git add file-name.ts
git commit -m "Resolve merge conflicts"
```

### Problem: App Won't Start
```bash
# Try these in order:
1. npm install
2. rm -rf node_modules && npm install
3. Delete .env.local and recreate it
4. Check console for specific error
5. Ask for help!
```

### Problem: TypeScript Errors
```bash
# Check all TypeScript errors
npx tsc --noEmit

# Common fixes:
- Add missing type imports
- Fix typos in variable names
- Add missing properties to objects
```

### Problem: Accidentally Committed to Wrong Branch
```bash
# If not pushed yet:
git log  # Find commit hash
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset HEAD~1 --hard

# If already pushed:
# Ask lead developer for help!
```

---

## 🎯 Goals for First Week

### By End of Week 1:
- [ ] Successfully completed 1-2 "good-first-issue" tickets
- [ ] Created 1-2 pull requests
- [ ] Received code review feedback
- [ ] Fixed review comments
- [ ] Had at least 1 PR merged
- [ ] Comfortable with git workflow
- [ ] Know where to find documentation
- [ ] Know who to ask for help

---

## 📞 Who to Contact

### For Technical Questions:
- **Git issues:** Lead Developer
- **Code questions:** Lead Developer
- **TypeScript errors:** Lead Developer
- **Database questions:** Lead Developer

### For Process Questions:
- **Jira workflow:** Project Manager
- **Sprint planning:** Project Manager
- **Time tracking:** Project Manager

### For Access Issues:
- **GitHub access:** Lead Developer
- **Jira access:** Project Manager
- **Database credentials:** Lead Developer (dev only!)

---

## ⚠️ Critical Rules

### NEVER:
❌ Push directly to `main` branch
❌ Push directly to `develop` branch
❌ Share production database credentials
❌ Commit `.env.local` file to git
❌ Commit with "WIP" or "test" messages
❌ Leave console.log statements in production code
❌ Skip testing your changes locally

### ALWAYS:
✅ Create feature branches from `develop`
✅ Test your changes before creating PR
✅ Write descriptive commit messages
✅ Link Jira ticket in PR description
✅ Ask questions when stuck
✅ Update Jira ticket status
✅ Respond to code review feedback promptly

---

## 🎓 Learning Resources

### Internal:
- [Team Workflow Guide](./TEAM_WORKFLOW.md)
- [Jira Ticket Examples](./JIRA_TICKET_EXAMPLES.md)
- Project README
- Code comments

### External:
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Git Tutorial](https://www.atlassian.com/git/tutorials)
- [Vite Guide](https://vitejs.dev/guide/)

---

## ✅ Onboarding Complete!

**Sign-off:**
- Developer Name: _______________________
- Date: _______________________
- Lead Developer Signature: _______________________

**Next Steps:**
- Join daily standup meetings
- Pick tickets from sprint backlog
- Start contributing!

Welcome to the team! 🎉
