src/app/
├── (auth)/                           # Auth routes (login, register, etc.)
│   ├── login/
│   ├── create-account/
│   └── reset-password/
│
├── (public)/                         # Public listings (no auth required)
│   ├── listings/                     # Browse available units
│   │   ├── page.tsx                  # Search/filter listings
│   │   └── [unitId]/                 # Individual listing detail
│   │       └── page.tsx
│   └── page.tsx                      # Landing page
│
├── org/                              # Organization management
│   ├── create/                       # Create new org
│   │   └── page.tsx
│   ├── select/                       # Org selector (if user has multiple orgs)
│   │   └── page.tsx
│   └── [orgSlug]/                    # 👈 Org-scoped routes (use slug, not ID)
│       ├── layout.tsx                # Org layout (sidebar, header, permissions check)
│       ├── page.tsx                  # Org dashboard/overview
│       ├── settings/                 # Org settings
│       │   └── page.tsx
│       ├── members/                  # Manage org members
│       │   ├── page.tsx
│       │   ├── invite/
│       │   │   └── page.tsx
│       │   └── [memberId]/
│       │       └── page.tsx
│       ├── properties/               # Properties management
│       │   ├── page.tsx              # List all properties
│       │   ├── create/
│       │   │   └── page.tsx
│       │   └── [propertyId]/
│       │       ├── layout.tsx        # Property context
│       │       ├── page.tsx          # Property details
│       │       ├── edit/
│       │       │   └── page.tsx
│       │       └── units/            # Units under property
│       │           ├── page.tsx      # List units
│       │           ├── create/
│       │           │   └── page.tsx
│       │           └── [unitId]/
│       │               ├── page.tsx   # Unit details
│       │               ├── edit/
│       │               │   └── page.tsx
│       │               └── tenancies/
│       │                   ├── page.tsx
│       │                   └── [tenancyId]/
│       │                       └── page.tsx
│       ├── invoices/                 # All invoices for org
│       │   ├── page.tsx
│       │   └── [invoiceId]/
│       │       └── page.tsx
│       └── payments/                 # All payments for org
│           └── page.tsx
│
├── tenant/                           # 👈 Tenant-specific portal
│   ├── layout.tsx                    # Tenant layout
│   ├── page.tsx                      # Tenant dashboard
│   ├── my-unit/                      # View their rented unit
│   │   └── page.tsx
│   ├── invoices/                     # View/pay invoices
│   │   ├── page.tsx
│   │   └── [invoiceId]/
│   │       └── page.tsx
│   └── payments/                     # Payment history
│       └── page.tsx
│
└── admin-panel/                      # 👈 Platform admin (super admin)
    └── ...