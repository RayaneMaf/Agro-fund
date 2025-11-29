# AgroFund Platform Design Guidelines

## Design Approach

**Selected System**: Material Design with agricultural platform customization
**Rationale**: Information-dense application requiring clear data hierarchy, extensive forms, status tracking, and trust-building through professional, structured layouts. The platform handles financial transactions and employment matching, demanding clarity and usability over visual experimentation.

**Key Principles**:
- Data transparency and accessibility
- Trust through professional presentation
- Role-based interface clarity
- Efficient task completion flows

---

## Typography

**Font Family**: Inter (Google Fonts) for UI, Merriweather for headings
- **Hero/Landing Headlines**: Merriweather Bold, 48px (desktop), 32px (mobile)
- **Section Headers**: Inter SemiBold, 32px (desktop), 24px (mobile)
- **Card Titles**: Inter SemiBold, 20px
- **Body Text**: Inter Regular, 16px, line-height 1.6
- **Form Labels**: Inter Medium, 14px
- **Small Text/Metadata**: Inter Regular, 13px
- **Button Text**: Inter SemiBold, 15px

**Hierarchy**: Establish clear distinction between data labels (Medium weight) and data values (Regular weight) throughout dashboards.

---

## Layout System

**Spacing Scale**: Tailwind units of **2, 4, 6, 8, 12, 16, 20, 24** for consistency
- Component padding: p-6 or p-8
- Section spacing: py-16 (desktop), py-12 (mobile)
- Card gaps: gap-6
- Form field spacing: space-y-4
- Container max-width: max-w-7xl

**Grid Systems**:
- Project/Job cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6
- Dashboard stats: grid-cols-2 lg:grid-cols-4, gap-4
- Form layouts: Single column for better mobile experience, max-w-2xl

---

## Component Library

### Navigation
**Top Navigation Bar**:
- Fixed header, h-16
- Logo left, navigation center, user menu right
- Desktop: Horizontal nav items with subtle separators
- Mobile: Hamburger menu collapsing to slide-out panel
- User role badge displayed prominently next to name

### Landing Page Structure
1. **Hero Section** (h-screen):
   - Split layout: Left (60%) - Headline + 3 large user type buttons stacked vertically
   - Right (40%) - Hero image of agricultural field/farmers working
   - Buttons: Large (min-h-20), icon + text, full-width on mobile
   
2. **How It Works** (py-20):
   - 3-column grid showing workflow for each user type
   - Icons above, numbered steps, brief descriptions
   
3. **Key Features** (py-20):
   - 2-column grid alternating image/content
   - Feature: AI Risk Assessment, wilayaal Coverage, Secure Investments
   
4. **Stats Banner** (py-16):
   - 4-column stat display: Active Projects, Total Investments, Jobs Posted, Success Rate
   
5. **CTA Section** (py-24):
   - Centered content, primary CTA button, supporting text

### Cards

**Project Card**:
- Border card with subtle shadow
- Header: Title + AI Risk Score badge (prominent placement, top-right)
- Content area: 3-row grid showing Budget/Duration/Profit Share with labels
- Metadata row: Crop type chip, wilaya badge, Irrigation icon
- Footer: View Details button (full-width)
- Hover: Subtle elevation increase

**Job Card**:
- Similar structure to project card
- Header: Job Type + Status badge
- Content: Payment, Duration, Workers Needed
- Footer: wilaya + Apply button

**Investment/Application Status Card**:
- Timeline-style layout with status indicator (left border accent)
- Header: Project/Job title
- Status badge prominently displayed
- Progress indicator for Active investments
- Action buttons contextual to status

### Modals

**Detail Modal** (Project/Job):
- Large modal (max-w-4xl)
- Header: Title, close button, AI risk score (for projects)
- Body: 2-column layout on desktop
  - Left (60%): Full description, detailed information
  - Right (40%): Key stats sidebar, farmer/employer info card
- Footer: Primary action button (Apply/Invest), secondary close

**Form Modal** (Post Project/Job):
- Medium modal (max-w-2xl)
- Multi-step progress indicator at top for project posting
- Form sections clearly separated with spacing
- Grouped related fields (e.g., Farm Details, Financial Terms)
- wilaya selector: Searchable dropdown with zone indicators
- Submit button: Full-width, bottom sticky on mobile

### Forms

**Field Structure**:
- Label above input (Inter Medium, 14px)
- Input height: h-12
- Helper text below (13px, subtle)
- Error states: Red accent border + error text
- Required fields: Asterisk in label

**Special Inputs**:
- wilaya Selector: Autocomplete with zone/altitude display
- Soil Quality: Visual slider with labels (Poor → Excellent)
- Irrigation Type: Icon-based selection grid
- Budget/Payment: Number input with currency prefix

### Dashboard Layouts

**Investor Dashboard**:
- Header: Welcome message + quick stats row (4 metrics)
- Filter Bar: Search + dropdown filters (Status, wilaya, Crop Type, Risk Level)
- Project Grid: 3 columns on desktop, scrollable
- Empty state: Centered illustration + CTA

**Farmer Dashboard**:
- Tabbed interface: My Projects | Employment Postings
- Each tab: Add New button (top-right), list/grid toggle
- Project list: Expandable rows showing investor applications
- Accept Investor: Inline action within expanded row

**Job Seeker Dashboard**:
- Filter bar similar to investor
- Job grid: 2-3 columns
- Application tracking section: Separate view, status-grouped

### Data Display

**Status Badges**:
- Rounded-full pill style, px-3, py-1
- Clear labels: PENDING, ACTIVE, ACCEPTED, REJECTED, COMPLETED
- Icon prefix for quick scanning

**AI Risk Score**:
- Circular progress indicator or percentage badge
- Size: 64px diameter for cards, 80px for modal headers
- Risk level label below (Low/Medium/High)

**Application Lists**:
- Table format on desktop (applicant name, message preview, date, action)
- Card format on mobile (stacked)
- Inline Accept/Reject buttons

### Images

**Hero Image**: Full-height agricultural scene - farmers in field with modern equipment, wide landscape shot showing crop rows
**Feature Section Images**: 
- AI/technology visualization for risk assessment feature
- Handshake/partnership image for investment section
- Workers in field for employment section
**Placement**: Right side of hero (40% width), alternating sides in feature sections

### Animations

**Minimal, Purposeful Only**:
- Modal: Fade + scale in (0.2s)
- Card hover: Elevation transition (0.15s)
- Status badge changes: Fade transition
- No scroll animations, no parallax

---

## Accessibility

- All form inputs: Proper labels, ARIA attributes
- Focus states: Visible outline on all interactive elements
- Color not sole indicator: Use icons + text for status
- Keyboard navigation: Full support, logical tab order
- Modal: Focus trap, Escape to close

---

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2 columns for cards)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Priorities**:
- Sticky CTA buttons in modals
- Collapsible filter panels
- Simplified card layouts (vertical stack of info)
- Bottom navigation for dashboard tabs