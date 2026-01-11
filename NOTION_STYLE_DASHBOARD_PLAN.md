# Notion-Style Admin Dashboard - Implementation Plan

## 📊 Overview

Transform the current admin dashboard to match Notion's clean, professional table design with:

✅ **Advanced filtering system** - Filter by status, content code, type, profile, etc.
✅ **Compact table design** - Small, dense rows like Notion
✅ **Easy scrolling** - Smooth horizontal/vertical scroll
✅ **Tag-based status** - Color-coded pills for status
✅ **Clean typography** - Notion-style fonts and spacing
✅ **Icon integration** - Visual indicators for content types
✅ **Sortable columns** - Click headers to sort
✅ **Quick actions** - Inline buttons for common tasks

---

## 🎨 Key Design Elements from Notion

### 1. Table Styling
```css
/* Notion-style compact table */
- Row height: 36px (compact)
- Font size: 14px (body), 12px (metadata)
- Cell padding: 8px vertical, 12px horizontal
- Border: 1px solid #e5e7eb (gray-200)
- Hover: Subtle bg-gray-50
- Selected: bg-blue-50
```

### 2. Filter System
```
[Filter icon] Filter by...
  ↓ Opens dropdown:
  ✓ content code
  ✓ Name of viral reel
  ✓ Status of the idea
  ✓ TYPE OF SHOOT
  ✓ Type of Content
  ✓ date of research
  ✓ profile
  ✓ viral content link
  + Add advanced filter
```

### 3. Status Pills (Like Notion)
```jsx
// Notion-style status badges
<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
  shoot done
</span>

<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
  idea
</span>

<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
  not approved
</span>
```

### 4. Color Palette (Based on screenshot)
```javascript
const statusColors = {
  'shoot done': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  'idea': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  'not approved': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'planned shoot': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Viral': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Hype': { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  'Emotional': { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  'FOMO - Urgency': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
};
```

---

## 🏗️ Implementation Structure

### Component Hierarchy
```
AdminDashboard.tsx
├── FilterBar (NEW)
│   ├── FilterDropdown
│   ├── ActiveFilters
│   └── ClearFilters
│
├── NotionStyleTable (NEW - replaces current tables)
│   ├── TableHeader (sortable columns)
│   ├── TableBody
│   │   ├── CompactRow
│   │   │   ├── ContentCodeCell
│   │   │   ├── StatusPillCell
│   │   │   ├── TypeTagCell
│   │   │   └── ActionsCell
│   └── TableFooter (pagination)
│
└── DetailsSidebar (slide-out panel)
    ├── QuickActions
    └── FullDetails
```

---

## 📋 Features to Implement

### Phase 1: Core Table Redesign ⭐ (Start here)

#### 1.1 Compact Table Layout
```tsx
// frontend/src/components/NotionStyleTable.tsx
interface Column {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

const NotionStyleTable = ({ data, columns, onRowClick }) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onRowClick(row)}
            >
              {columns.map(col => (
                <td
                  key={col.key}
                  className="px-3 py-2 text-sm text-gray-900"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

#### 1.2 Column Definitions for Admin Dashboard
```typescript
const columns: Column[] = [
  {
    key: 'content_id',
    label: 'content code',
    width: '120px',
    sortable: true,
    render: (value) => (
      <div className="flex items-center space-x-2">
        <DocumentTextIcon className="w-4 h-4 text-gray-400" />
        <span className="font-mono font-medium">{value || 'N/A'}</span>
      </div>
    ),
  },
  {
    key: 'hook',
    label: 'Name of viral reel',
    width: '300px',
    sortable: true,
    render: (value) => (
      <div className="line-clamp-2 text-sm">{value || 'No hook'}</div>
    ),
  },
  {
    key: 'status',
    label: 'Status of the idea',
    width: '140px',
    sortable: true,
    render: (value, row) => <StatusPill status={value} productionStage={row.production_stage} />,
  },
  {
    key: 'profile',
    label: 'profile',
    width: '140px',
    sortable: true,
    render: (value) => (
      <span className="text-sm text-gray-600">{value?.name || 'N/A'}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type of Content',
    width: '140px',
    sortable: true,
    render: (value) => <TypeTag type={value} />,
  },
  {
    key: 'created_at',
    label: 'date of research',
    width: '120px',
    sortable: true,
    render: (value) => (
      <span className="text-xs text-gray-500">
        {new Date(value).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'reference_url',
    label: 'viral content link',
    width: '120px',
    render: (value) => (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        View Link
      </a>
    ),
  },
];
```

### Phase 2: Advanced Filter System ⭐

#### 2.1 Filter Bar Component
```tsx
// frontend/src/components/FilterBar.tsx
interface Filter {
  field: string;
  operator: 'equals' | 'contains' | 'in' | 'before' | 'after';
  value: any;
}

const FilterBar = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const filterOptions = [
    { field: 'content_id', label: 'content code', type: 'text' },
    { field: 'hook', label: 'Name of viral reel', type: 'text' },
    { field: 'status', label: 'Status of the idea', type: 'select', options: ['PENDING', 'APPROVED', 'REJECTED'] },
    { field: 'production_stage', label: 'TYPE OF SHOOT', type: 'select', options: Object.values(ProductionStage) },
    { field: 'type', label: 'Type of Content', type: 'select', options: ['Viral', 'Hype', 'Emotional', 'FOMO - Urgency'] },
    { field: 'created_at', label: 'date of research', type: 'date' },
    { field: 'profile', label: 'profile', type: 'select', options: [] }, // Load from API
  ];

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      {/* Filter button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <FunnelIcon className="w-4 h-4 text-gray-500" />
          <span>Filter</span>
        </button>

        {/* Active filters */}
        <div className="flex items-center space-x-2 flex-wrap">
          {filters.map((filter, idx) => (
            <ActiveFilterPill
              key={idx}
              filter={filter}
              onRemove={() => removeFilter(idx)}
            />
          ))}
        </div>

        {filters.length > 0 && (
          <button
            onClick={() => setFilters([])}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Filter dropdown menu */}
      {showFilterMenu && (
        <FilterDropdownMenu
          options={filterOptions}
          onAddFilter={(filter) => {
            setFilters([...filters, filter]);
            onFiltersChange([...filters, filter]);
          }}
          onClose={() => setShowFilterMenu(false)}
        />
      )}
    </div>
  );
};
```

#### 2.2 Filter Logic (Client-side)
```typescript
// Filter function
const applyFilters = (data: ViralAnalysis[], filters: Filter[]) => {
  return data.filter(item => {
    return filters.every(filter => {
      const value = item[filter.field];

      switch (filter.operator) {
        case 'equals':
          return value === filter.value;
        case 'contains':
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
        case 'in':
          return filter.value.includes(value);
        case 'before':
          return new Date(value) < new Date(filter.value);
        case 'after':
          return new Date(value) > new Date(filter.value);
        default:
          return true;
      }
    });
  });
};
```

### Phase 3: Status Pills & Type Tags ⭐

#### 3.1 Status Pill Component
```tsx
// frontend/src/components/StatusPill.tsx
const StatusPill = ({ status, productionStage }) => {
  // Combine script status + production stage for rich status
  const getStatusConfig = () => {
    if (status === 'REJECTED') {
      return {
        label: 'not approved',
        bg: 'bg-red-100',
        text: 'text-red-700',
        dot: 'bg-red-500',
      };
    }

    if (status === 'PENDING') {
      return {
        label: 'idea',
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        dot: 'bg-yellow-500',
      };
    }

    // For approved scripts, use production stage
    switch (productionStage) {
      case ProductionStage.POSTED:
        return { label: 'posted', bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
      case ProductionStage.SHOOTING:
      case ProductionStage.SHOOT_REVIEW:
        return { label: 'shoot done', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
      case ProductionStage.PRE_PRODUCTION:
        return { label: 'planned shoot', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
      default:
        return { label: 'in progress', bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
      {config.label}
    </span>
  );
};
```

#### 3.2 Type Tag Component
```tsx
// frontend/src/components/TypeTag.tsx
const TypeTag = ({ type }) => {
  const typeColors = {
    'Viral': { bg: 'bg-purple-100', text: 'text-purple-700' },
    'Hype': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    'Emotional': { bg: 'bg-pink-100', text: 'text-pink-700' },
    'FOMO - Urgency': { bg: 'bg-orange-100', text: 'text-orange-700' },
    'Movie Recreation': { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  };

  const config = typeColors[type] || { bg: 'bg-gray-100', text: 'text-gray-700' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {type}
    </span>
  );
};
```

### Phase 4: Sorting & Pagination

#### 4.1 Table Sorting
```typescript
const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

const sortedData = useMemo(() => {
  if (!sortConfig) return filteredData;

  return [...filteredData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
}, [filteredData, sortConfig]);
```

#### 4.2 Pagination
```tsx
const [page, setPage] = useState(1);
const itemsPerPage = 50; // Notion shows ~50 rows

const paginatedData = useMemo(() => {
  const start = (page - 1) * itemsPerPage;
  return sortedData.slice(start, start + itemsPerPage);
}, [sortedData, page]);
```

### Phase 5: Responsive Design

```css
/* Notion-style scrolling */
.notion-table-container {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: auto;
}

/* Sticky header */
.notion-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f9fafb;
}

/* Smooth scrolling */
.notion-table-container {
  scroll-behavior: smooth;
}

/* Custom scrollbar (optional, Notion-like) */
.notion-table-container::-webkit-scrollbar {
  width: 12px;
  height: 12px;
}

.notion-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notion-table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 6px;
}

.notion-table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
```

---

## 🎯 Implementation Priority

### ✅ Phase 1: Core Table (Week 1)
1. Create NotionStyleTable component
2. Define column structure
3. Implement compact row design
4. Add hover states

### ✅ Phase 2: Filters (Week 1-2)
1. Build FilterBar component
2. Implement filter dropdown
3. Add active filter pills
4. Wire up filter logic

### ✅ Phase 3: Status & Tags (Week 2)
1. Create StatusPill component
2. Create TypeTag component
3. Map existing data to new status system

### ✅ Phase 4: Sorting & Pagination (Week 2)
1. Add sortable column headers
2. Implement sort logic
3. Add pagination controls

### ✅ Phase 5: Polish (Week 3)
1. Responsive design
2. Smooth scrolling
3. Loading states
4. Empty states

---

## 📊 Current Admin Dashboard → Notion Style Mapping

| Current Feature | Notion Equivalent | Changes Needed |
|----------------|-------------------|----------------|
| Tab-based views (Pending/Production/Team) | Single filterable table | Merge into one table with status filter |
| Large card-style rows | Compact table rows (36px height) | Redesign row layout |
| Full-width modals | Slide-out side panel | Create sidebar component |
| Status badges (various sizes) | Consistent small pills with dots | Standardize badge design |
| No filtering | Advanced filter system | Build filter bar |
| Basic sorting | Column header sorting | Add sort indicators |
| Pagination (basic) | Notion-style pagination | Improve pagination UI |

---

## 🔧 Technical Implementation

### New Files to Create
```
frontend/src/components/
├── NotionStyleTable/
│   ├── index.tsx              # Main table component
│   ├── TableHeader.tsx        # Sortable headers
│   ├── TableRow.tsx           # Compact row
│   └── TableCell.tsx          # Cell renderers
│
├── FilterBar/
│   ├── index.tsx              # Filter bar container
│   ├── FilterDropdown.tsx     # Filter menu
│   ├── ActiveFilterPill.tsx   # Active filter chip
│   └── FilterLogic.ts         # Filter utilities
│
├── StatusPill.tsx             # Status badge
├── TypeTag.tsx                # Content type tag
└── DetailsSidebar.tsx         # Slide-out panel
```

### Files to Modify
```
frontend/src/pages/
└── AdminDashboard.tsx         # Main dashboard - replace tables
```

---

## 🎨 CSS/Tailwind Tokens

```typescript
// Design tokens matching Notion
const notionTheme = {
  colors: {
    background: '#ffffff',
    backgroundHover: '#f9fafb',
    border: '#e5e7eb',
    text: '#374151',
    textMuted: '#6b7280',
    textLight: '#9ca3af',
  },
  spacing: {
    rowHeight: '36px',
    cellPaddingX: '12px',
    cellPaddingY: '8px',
  },
  typography: {
    fontSize: '14px',
    fontSizeSm: '12px',
    fontWeight: '400',
    fontWeightMedium: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
};
```

---

## 📱 Mobile Considerations

```tsx
// Responsive table - horizontal scroll on mobile
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>

// Mobile filter - bottom sheet instead of dropdown
{isMobile ? (
  <BottomSheet isOpen={showFilters}>
    <FilterMenu />
  </BottomSheet>
) : (
  <FilterDropdown />
)}
```

---

## ✅ Success Metrics

After implementation, the admin dashboard should have:

- ✅ **50+ rows visible** without scrolling (like Notion)
- ✅ **<100ms filter response** time
- ✅ **Instant sorting** on column click
- ✅ **Clean, minimal design** matching Notion aesthetic
- ✅ **Easy scanning** - user can quickly find any project
- ✅ **Professional look** - comparable to Notion, Airtable, Linear

---

## 🚀 Next Steps

Ready to implement when you approve! This will give you a **professional, scalable admin dashboard** that:

1. ✅ Handles hundreds of scripts efficiently
2. ✅ Provides powerful filtering and sorting
3. ✅ Looks modern and professional (Notion-quality)
4. ✅ Easy to scan and find information
5. ✅ Mobile-responsive

**Estimated implementation time:** 1-2 weeks
**Priority:** High (since this is the main admin interface)

Let me know when you're ready to start, or if you want to discuss any changes to the plan!
