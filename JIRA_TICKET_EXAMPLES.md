# Jira Ticket Examples - Viral Content Analyzer

## 📋 How to Create Effective Tickets

---

## Example 1: Bug Fix Ticket

### **VCA-101: Fix posting_profile dropdown UUID mapping error**

**Issue Type:** 🐛 Bug

**Priority:** High

**Assignee:** Developer 1

**Story Points:** 3

**Sprint:** Sprint 1

**Epic:** Form Builder Improvements

**Labels:** `bug`, `form-builder`, `database`, `urgent`

**Description:**

```markdown
## 🐛 Problem
When submitting the "Analyze Viral Content" form, users get a 400 Bad Request error.

**Error Message:**
```
invalid input syntax for type uuid: "posting_profile_0"
```

**Location:** Script Writer page → New Analysis form

## 📍 Where to Look
- **File:** `frontend/src/services/analysesService.ts`
- **Field:** `posting_profile` (db-dropdown type)
- **Database:** `viral_analyses` table, `profile_id` column

## 🎯 Root Cause
The `posting_profile` dropdown is sending a string value instead of UUID from the `profile_list` table.

Expected: `"550e8400-e29b-41d4-a716-446655440000"` (UUID)
Actual: `"posting_profile_0"` or `"BCH MAIN"` (string)

## ✅ Acceptance Criteria
- [ ] Dropdown sends valid UUID from `profile_list` table
- [ ] Form submits successfully without 400 error
- [ ] Value correctly stored in `viral_analyses.profile_id` column
- [ ] Console shows no errors
- [ ] Works with all profiles in the dropdown

## 🧪 Testing Steps
1. Go to Script Writer page
2. Click "New Analysis"
3. Fill required fields:
   - Reference Link: `https://example.com`
   - posting profile: Select "BCH MAIN"
   - Hook: Enter text
   - Other required fields
4. Click "Submit Analysis"
5. **Expected:** Form submits successfully, shows success toast
6. **Verify:** Check database → `viral_analyses` table → `profile_id` should contain UUID

## 🔗 Related
- Depends on: N/A
- Blocks: VCA-102 (Form validation)
- Related: VCA-100 (Form Builder Epic)

## 📎 Attachments
[Attach screenshot of error]

## 🔍 Technical Notes
The issue is in how `db-dropdown` fields are processed. Check:
1. `formFieldResolver.ts` - How options are loaded
2. `DynamicFormField.tsx` - How dropdown value is captured
3. `analysesService.ts` - How value is mapped to database column
```

**Branch:** `feature/VCA-101-fix-posting-profile-uuid`

---

## Example 2: Feature Ticket

### **VCA-102: Add form field validation for required fields**

**Issue Type:** ✨ Story

**Priority:** Medium

**Assignee:** Developer 2

**Story Points:** 5

**Sprint:** Sprint 1

**Epic:** Form Builder Improvements

**Labels:** `feature`, `form-builder`, `validation`

**Description:**

```markdown
## 📝 User Story
**As a** Script Writer
**I want** immediate feedback when I miss required fields
**So that** I don't waste time filling a long form only to get an error at submission

## 🎯 Requirements

### Must Have:
1. Real-time validation as user fills form
2. Clear error messages for each field
3. Highlight invalid fields in red
4. Disable submit button until all required fields are valid
5. Show error count (e.g., "3 errors remaining")

### Should Have:
6. Validation messages appear below each field
7. Scroll to first error on submit attempt
8. Show which fields are required with asterisk (*)

### Nice to Have:
9. Validation hints before user leaves field (onBlur)
10. Progressive validation (only show errors after first submit attempt)

## 📐 Design Mockup
[Attach Figma/design link or screenshot]

## ✅ Acceptance Criteria

### Field-Level Validation:
- [ ] Required text fields show error if empty
- [ ] URL fields validate URL format
- [ ] Number fields only accept numbers
- [ ] Dropdown fields show error if not selected
- [ ] Multi-select requires at least one selection

### Visual Feedback:
- [ ] Required fields marked with red asterisk (*)
- [ ] Invalid fields have red border
- [ ] Error messages appear below invalid fields
- [ ] Submit button disabled until form is valid
- [ ] Error count badge shows remaining errors

### User Experience:
- [ ] Validation runs on blur (leaving field)
- [ ] Real-time validation doesn't annoy user (not on every keystroke)
- [ ] Form scrolls to first error on submit attempt
- [ ] Success state shows green checkmark

## 🧪 Testing Scenarios

### Scenario 1: Empty Required Field
1. Focus on "Reference Link" field
2. Leave it empty
3. Move to next field (trigger blur)
4. **Expected:** Red border, error message "Reference Link is required"

### Scenario 2: Invalid URL
1. Enter "not-a-url" in Reference Link
2. **Expected:** Error "Please enter a valid URL (e.g., https://example.com)"

### Scenario 3: Submit with Errors
1. Fill only 2 out of 5 required fields
2. Click Submit
3. **Expected:**
   - Button disabled
   - Error badge shows "3 errors"
   - Page scrolls to first error
   - Toast: "Please fix 3 errors before submitting"

### Scenario 4: All Valid
1. Fill all required fields correctly
2. **Expected:**
   - All fields have green checkmarks
   - Submit button enabled
   - No error messages

## 📁 Files to Modify
- `frontend/src/components/DynamicAnalysisForm.tsx` - Add validation logic
- `frontend/src/components/DynamicFormField.tsx` - Add field-level validation
- `frontend/src/utils/validators.ts` - Create validation utilities (new file)
- `frontend/src/types/formBuilder.ts` - Add validation types

## 🔗 Technical Approach

### Create Validator Functions:
```typescript
// frontend/src/utils/validators.ts
export function validateRequired(value: any): string | null {
  if (!value || value.trim() === '') {
    return 'This field is required';
  }
  return null;
}

export function validateURL(value: string): string | null {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
}

export function validateNumber(value: any, min?: number, max?: number): string | null {
  const num = Number(value);
  if (isNaN(num)) return 'Please enter a valid number';
  if (min !== undefined && num < min) return `Minimum value is ${min}`;
  if (max !== undefined && num > max) return `Maximum value is ${max}`;
  return null;
}
```

### Add Validation State:
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
const [touched, setTouched] = useState<Set<string>>(new Set());
```

## 🔗 Related
- Depends on: VCA-101 (Must fix form submission first)
- Blocks: VCA-103 (Form analytics)
- Related: VCA-100 (Form Builder Epic)

## 📚 Resources
- [React Hook Form Validation](https://react-hook-form.com/get-started#Applyvalidation)
- [Yup Validation Schema](https://github.com/jquense/yup)
- [Zod TypeScript Validation](https://zod.dev/)
```

**Branch:** `feature/VCA-102-add-form-validation`

---

## Example 3: Technical Debt / Improvement Ticket

### **VCA-103: Refactor analysesService to use TypeScript discriminated unions**

**Issue Type:** 🔧 Technical Debt

**Priority:** Low

**Assignee:** Developer 1

**Story Points:** 3

**Sprint:** Sprint 2

**Epic:** Code Quality Improvements

**Labels:** `tech-debt`, `refactoring`, `typescript`

**Description:**

```markdown
## 📝 Context
The `analysesService.ts` file has grown to 250+ lines with multiple similar functions. We can improve type safety and reduce code duplication.

## 🎯 Goal
Refactor `analysesService` to:
1. Use TypeScript discriminated unions for better type safety
2. Reduce code duplication between `createAnalysis` and `updateAnalysis`
3. Improve error handling
4. Add better TypeScript types

## ✅ Acceptance Criteria
- [ ] All existing functionality works exactly the same
- [ ] No new bugs introduced
- [ ] TypeScript compilation has zero errors
- [ ] All existing tests pass
- [ ] Code is more maintainable (subjective, but aim for 20% reduction)

## 🔧 Refactoring Plan

### Step 1: Extract Common Logic
```typescript
// Before: Duplicated in both create and update
if (formData.hookVoiceNote) {
  hookVoiceUrl = await this.uploadVoiceNote(user.id, formData.hookVoiceNote, 'hook');
}
// ... repeated 4 times

// After: Single function
async uploadAllVoiceNotes(userId: string, formData: AnalysisFormData) {
  return {
    hookVoiceUrl: formData.hookVoiceNote
      ? await this.uploadVoiceNote(userId, formData.hookVoiceNote, 'hook')
      : '',
    // ... other voice notes
  };
}
```

### Step 2: Type-Safe Field Mapping
```typescript
// Add discriminated union for known vs custom fields
type KnownField = 'referenceUrl' | 'hook' | 'targetEmotion' | ...;
type FormFieldValue<T extends KnownField> = AnalysisFormData[T];

// Better type safety when mapping fields
const knownFieldMapping: Record<KnownField, string> = {
  referenceUrl: 'reference_url',
  targetEmotion: 'target_emotion',
  // ...
};
```

## 🧪 Testing Strategy
- [ ] Run all existing tests - must pass
- [ ] Manual testing of create analysis
- [ ] Manual testing of update analysis
- [ ] Test error scenarios
- [ ] Test with empty/missing fields

## 📁 Files to Modify
- `frontend/src/services/analysesService.ts` - Main refactor
- `frontend/src/types/index.ts` - Add new types if needed

## ⚠️ Risks
- High risk of introducing bugs (refactoring working code)
- Requires thorough testing
- Should be done in small, reviewable commits

## 🔗 Related
- Related: VCA-100 (Form Builder improvements will benefit from this)
```

**Branch:** `refactor/VCA-103-analyses-service-types`

---

## Example 4: Epic (Parent of Multiple Stories)

### **VCA-100: Form Builder System Improvements**

**Issue Type:** 📦 Epic

**Priority:** High

**Target Release:** v2.0

**Description:**

```markdown
## 🎯 Epic Goal
Improve the Form Builder system to be more robust, user-friendly, and maintainable.

## 📊 Success Metrics
- Reduce form submission errors by 80%
- Improve form completion rate from 60% to 85%
- Reduce support tickets related to forms by 50%

## 🗂️ Child Stories

### Phase 1: Bug Fixes (Sprint 1)
- [VCA-101] Fix posting_profile dropdown UUID mapping error ✅
- [VCA-104] Fix form fields not persisting after page refresh
- [VCA-105] Fix character tags multi-select not saving

### Phase 2: Validation & UX (Sprint 2)
- [VCA-102] Add form field validation for required fields
- [VCA-106] Add auto-save draft feature
- [VCA-107] Add progress indicator for long forms

### Phase 3: Advanced Features (Sprint 3)
- [VCA-108] Add conditional field display based on selections
- [VCA-109] Add field templates for common use cases
- [VCA-110] Add form analytics dashboard

### Phase 4: Code Quality (Sprint 4)
- [VCA-103] Refactor analysesService for better type safety
- [VCA-111] Add comprehensive unit tests
- [VCA-112] Add E2E tests for critical paths

## 🔗 Dependencies
- Requires: Database migration for custom_fields column ✅ DONE
- Requires: Supabase dev environment setup
```

---

## Example 5: Spike / Research Ticket

### **VCA-200: Research best approach for real-time form collaboration**

**Issue Type:** 🔬 Spike

**Priority:** Low

**Assignee:** Developer 2

**Story Points:** 2

**Time-box:** 4 hours

**Sprint:** Sprint 2

**Description:**

```markdown
## 🔍 Research Question
What's the best approach to allow multiple Script Writers to collaborate on the same analysis form in real-time?

## 🎯 Goals
1. Evaluate 3-5 different technical approaches
2. Compare pros/cons of each
3. Recommend one approach with implementation estimate

## 📋 Approaches to Evaluate

### Option 1: WebSockets (Socket.io)
- How it works
- Pros
- Cons
- Complexity (1-10)
- Cost estimate

### Option 2: Supabase Real-time
- How it works
- Pros
- Cons
- Complexity (1-10)
- Cost estimate

### Option 3: Polling (Simple HTTP)
- How it works
- Pros
- Cons
- Complexity (1-10)
- Cost estimate

### Option 4: Firebase Real-time Database
- How it works
- Pros
- Cons
- Complexity (1-10)
- Cost estimate

### Option 5: Operational Transform (e.g., Yjs, Automerge)
- How it works
- Pros
- Cons
- Complexity (1-10)
- Cost estimate

## ✅ Deliverables
- [ ] Create document comparing all approaches
- [ ] Include code examples for each
- [ ] Provide time/cost estimates
- [ ] Recommend best option
- [ ] Create follow-up implementation tickets

## 📊 Decision Criteria
- Development time
- Ongoing maintenance cost
- Scalability
- User experience
- Compatibility with existing stack

## ⏰ Time-box
Maximum 4 hours. If not complete, document findings so far and create follow-up spike.
```

**Branch:** `spike/VCA-200-realtime-collaboration-research`

---

## 📝 Quick Ticket Template

Copy-paste this when creating new tickets:

```markdown
## 🐛 Problem / 📝 User Story
[Describe the issue or user story]

## 🎯 Goal / Requirements
[What needs to be achieved]

## ✅ Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 🧪 Testing Steps
1. Step 1
2. Step 2
3. **Expected:** [What should happen]

## 📁 Files to Modify
- `path/to/file1.ts`
- `path/to/file2.tsx`

## 🔗 Related
- Depends on: VCA-XXX
- Blocks: VCA-YYY
- Related: VCA-ZZZ
```

---

## 🏷️ Jira Labels to Use

| Label | When to Use |
|-------|-------------|
| `bug` | Something is broken |
| `feature` | New functionality |
| `tech-debt` | Code quality improvement |
| `refactoring` | Code restructuring without behavior change |
| `documentation` | README, comments, guides |
| `urgent` | Needs immediate attention |
| `blocked` | Can't proceed due to dependency |
| `form-builder` | Related to form builder system |
| `database` | Database schema or queries |
| `ui` | User interface changes |
| `api` | Backend API changes |
| `security` | Security-related |
| `performance` | Speed/optimization |

---

## 🎯 Story Point Guide

| Points | Complexity | Time Estimate | Example |
|--------|------------|---------------|---------|
| 1 | Trivial | 1-2 hours | Update button text |
| 2 | Simple | 2-4 hours | Add new form field |
| 3 | Medium | 4-8 hours | Fix UUID mapping bug |
| 5 | Complex | 1-2 days | Add form validation system |
| 8 | Very Complex | 2-3 days | Real-time collaboration |
| 13 | Epic-sized | 1 week+ | Complete form redesign |

**Rule:** If a ticket is 13 points, break it into smaller tickets!

---

## 💡 Tips for Writing Good Tickets

### DO:
✅ Use clear, specific titles
✅ Include acceptance criteria
✅ Add testing steps
✅ Link related tickets
✅ Attach screenshots/videos
✅ Provide context (why is this needed?)
✅ Include technical notes for developers

### DON'T:
❌ Write vague titles like "Fix bug"
❌ Skip acceptance criteria
❌ Assume developer knows the context
❌ Create tickets too large (>8 points)
❌ Forget to link dependencies
❌ Mix multiple unrelated tasks in one ticket
