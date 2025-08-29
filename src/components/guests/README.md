# Guests Components

A comprehensive, modular set of components for listing and managing guests with advanced filtering, searching, and viewing capabilities.

## Features

### 📊 **Statistics Dashboard**
- **Total Guests**: Shows the overall count of guests
- **Active Guests**: Count of currently active guests
- **Inactive Guests**: Count of inactive guests

### 🔍 **Search & Filter**
- **Real-time Search**: Search by guest name, email, or ID number
- **Status Filtering**: Filter by active/inactive status
- **Combined Filtering**: Use search and filters together
- **Visual Indicators**: Badges show active filters and result counts

### 📋 **Dual View Modes**

#### Table View
- Clean, data-dense table layout
- Sortable columns for all guest data
- Status badges for quick identification
- Action buttons for guest management
- Responsive design with mobile optimization

#### Grid View
- Card-based layout using existing GuestCard component
- Visual appeal with better spacing
- Maintains all filtering and search functionality
- Responsive grid that adapts to screen size

### 🎨 **UI/UX Features**
- **Consistent Design**: Uses shadcn/ui components throughout
- **Responsive Layout**: Works on all screen sizes
- **Loading States**: Proper fallbacks and loading indicators
- **Empty States**: Informative messages when no data matches
- **Accessibility**: Proper ARIA labels and keyboard navigation

### ⚡ **Performance**
- **Optimized Filtering**: Uses useMemo for efficient re-renders
- **Client-side Operations**: Fast search and filter without API calls
- **Minimal Re-renders**: Efficient state management

## Components

### GuestsLister (Main Component)
The primary component that orchestrates the entire guests listing experience.

```tsx
interface GuestsListerProps {
  guests: Guest[];
}

type FilterType = "all" | "active" | "inactive";
```

### GuestsTable (Separated Component)
A dedicated table component for displaying guests in tabular format.

```tsx
interface GuestsTableProps {
  guests: Guest[];
  searchTerm?: string;
  filterType?: string;
}
```

### GuestCard (Existing Component)
Individual guest card component used in grid view.

### GuestDetailsDialog (Extracted Component)
A reusable dialog component for displaying detailed guest information.

```tsx
interface GuestDetailsDialogProps {
  guest: Guest;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

## Usage

```tsx
// Import individual components
import GuestsLister from "@/components/guests/GuestsLister";
import GuestsTable from "@/components/guests/GuestsTable";
import GuestDetailsDialog from "@/components/guests/GuestDetailsDialog";

// Or import from index
import { GuestsLister, GuestsTable, GuestCard, GuestDetailsDialog } from "@/components/guests";

// In your page component
<GuestsLister guests={guestData} />

// Or use table directly
<GuestsTable guests={filteredGuests} searchTerm="search" filterType="active" />

// Use dialog independently
<GuestDetailsDialog
  guest={selectedGuest}
  open={isOpen}
  onOpenChange={setIsOpen}
/>
```

## State Management

- `searchTerm`: Controls the search input
- `filterType`: Controls the status filter dropdown
- `currentView`: Toggles between "table" and "grid" views
- `filteredGuests`: Computed array of guests matching search and filter criteria

## Dependencies

- `@/components/ui/*`: shadcn/ui components
- `@/generated/prisma`: Guest type definitions
- `lucide-react`: Icons
- `next/link`: Navigation

## Integration

The components integrate seamlessly with:
- Existing `GuestCard` component for grid view
- Guest management actions and routing
- Authentication and user context
- Responsive design system

## Benefits of Separation

### Code Organization
- **Single Responsibility**: Each component has a focused purpose
- **Maintainability**: Easier to update and debug individual components
- **Reusability**: GuestsTable can be used independently in other contexts

### Performance
- **Smaller Bundle**: Components can be imported individually
- **Better Tree Shaking**: Unused components won't be included in builds
- **Focused Re-renders**: Changes to table logic don't affect the main component

### Development Experience
- **Easier Testing**: Test table functionality in isolation
- **Better IntelliSense**: More specific prop types and autocomplete
- **Cleaner Code**: Reduced complexity in the main component

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure
- Proper focus management
- ARIA labels and descriptions
