# Property Components

This directory contains all property-related components organized in a modular structure for better maintainability and reusability.

## 📁 Structure

```
src/components/property/
├── README.md                     # This file
├── index.ts                      # Main exports
├── PropertiesLister.tsx         # Main orchestrator component
├── PropertyLink.tsx             # Individual property card
├── PropertyDetails.tsx          # Detailed property view
├── PropertyEmptyState.tsx       # Empty state component
├── PropertyGrid.tsx             # Grid layout for properties
├── filters/                     # Filter-related components
│   ├── index.ts
│   ├── PropertySearchInput.tsx
│   ├── PropertyFilters.tsx
│   ├── PropertySortDropdown.tsx
│   ├── PropertyActiveFilters.tsx
│   └── PropertyFiltersBar.tsx
├── hooks/                       # Custom hooks
│   └── usePropertyFilters.ts
└── EditDialogs/                 # Property editing dialogs
    ├── index.ts
    ├── BasicInfoEditDialog.tsx
    ├── AmenitiesEditDialog.tsx
    ├── PoliciesEditDialog.tsx
    ├── FeesEditDialog.tsx
    └── NotesEditDialog.tsx
```

## 🎯 Main Components

### PropertiesLister
**Main orchestrator component** that combines all filter components and displays properties.

```tsx
<PropertiesLister 
    properties={properties}
    showSearch={true}
    showFilters={true}
    emptyStateMessage="No properties found"
    className=""
/>
```

**Props:**
- `properties`: Array of Property objects
- `showSearch`: Enable/disable search functionality
- `showFilters`: Enable/disable filter functionality
- `emptyStateMessage`: Custom message for empty state
- `className`: Additional CSS classes

### PropertyGrid
**Responsive grid layout** for displaying property cards with animations.

```tsx
<PropertyGrid properties={filteredProperties} />
```

### PropertyEmptyState
**Empty state component** shown when no properties match filters or when list is empty.

```tsx
<PropertyEmptyState 
    hasActiveFilters={true}
    emptyStateMessage="No properties found"
    onClearFilters={clearFilters}
/>
```

## 🔍 Filter Components

### PropertyFiltersBar
**Main filter container** that orchestrates all filter components.

```tsx
<PropertyFiltersBar
    searchQuery={searchQuery}
    onSearchChange={setSearchQuery}
    showSearch={true}
    statusFilter={statusFilter}
    onStatusChange={setStatusFilter}
    // ... other props
/>
```

### Individual Filter Components

- **PropertySearchInput**: Search by title/location
- **PropertyFilters**: Status and size dropdown filters
- **PropertySortDropdown**: Sorting options
- **PropertyActiveFilters**: Visual badges for active filters

## 🪝 Custom Hook

### usePropertyFilters
**Custom hook** that manages all filtering, sorting, and search logic.

```tsx
const {
    searchQuery,
    statusFilter,
    sizeFilter,
    filteredAndSortedProperties,
    hasActiveFilters,
    clearAllFilters,
    handleSortChange,
    // ... other values
} = usePropertyFilters({ properties })
```

**Returns:**
- **State**: All filter state values
- **Setters**: Functions to update filter state
- **Computed**: Filtered/sorted properties, unique values
- **Actions**: Clear filters, handle sort changes

## 🎨 Benefits of This Structure

### ✅ Modularity
- Each component has a single responsibility
- Easy to test individual components
- Reusable across different contexts

### ✅ Maintainability
- Logic is separated from UI
- Easy to modify individual filter components
- Clear separation of concerns

### ✅ Performance
- Custom hook optimizes filtering with useMemo
- Components only re-render when necessary
- Efficient state management

### ✅ Developer Experience
- TypeScript support throughout
- Clear prop interfaces
- Comprehensive exports from index files

## 🚀 Usage Examples

### Basic Usage
```tsx
import { PropertiesLister } from '@/components/property'

<PropertiesLister properties={userProperties} />
```

### Custom Configuration
```tsx
import { PropertiesLister } from '@/components/property'

<PropertiesLister 
    properties={properties}
    showSearch={false}
    showFilters={true}
    emptyStateMessage="Start by adding your first property!"
/>
```

### Using Individual Components
```tsx
import { 
    PropertyGrid, 
    PropertySearchInput, 
    usePropertyFilters 
} from '@/components/property'

const CustomPropertyList = ({ properties }) => {
    const { filteredAndSortedProperties, searchQuery, setSearchQuery } = 
        usePropertyFilters({ properties })

    return (
        <div>
            <PropertySearchInput 
                value={searchQuery} 
                onChange={setSearchQuery} 
            />
            <PropertyGrid properties={filteredAndSortedProperties} />
        </div>
    )
}
```

## 🔧 Extending

To add new filter options:

1. **Update the hook**: Add new state in `usePropertyFilters.ts`
2. **Create filter component**: Add new filter component in `filters/`
3. **Update FilterBar**: Include new component in `PropertyFiltersBar.tsx`
4. **Export**: Add exports to appropriate index files

This modular structure makes it easy to add new features while maintaining clean, testable code.
