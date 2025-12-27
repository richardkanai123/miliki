# Miliki

A full-stack property management and house-hunting platform designed for the Kenyan market. Miliki streamlines the relationship between landlords, agents, and tenants through automated invoicing, secure role-based access, and integrated M-Pesa payments.

## Features

- **Multi-tenant Architecture** — Organizations (landlords/agents) manage their own properties and tenants
- **Role-Based Access Control** — Super Admin, Landlord, Agent, and Tenant roles with granular permissions
- **Property & Unit Management** — Track properties, units, occupancy status, and amenities
- **Lease Management** — Create and manage rental agreements with automated tracking
- **Automated Invoicing** — Monthly rent invoice generation with payment reconciliation
- **M-Pesa Integration** — Seamless local payments via Safaricom Daraja API (STK Push)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router & Server Actions) |
| Language | TypeScript |
| Authentication | Better-Auth (with Organization & Multi-tenancy plugins) |
| Database | Neon (PostgreSQL) |
| ORM | Prisma |
| Payments | Safaricom Daraja API |
| Styling | Tailwind CSS 4, shadcn/ui |
| Linting | Biome |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Neon PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/miliki.git
cd miliki

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and other credentials

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
miliki/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/         # Authentication routes
│   │   └── dashboard/      # Protected dashboard routes
│   ├── components/         # React components
│   │   └── ui/             # shadcn/ui components
│   └── lib/                # Utilities and configurations
│       ├── auth.ts         # Better-Auth configuration
│       ├── auth-client.ts  # Auth client
│       └── db.ts           # Prisma client
├── public/                 # Static assets
└── package.json
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# Better-Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# M-Pesa (Daraja API)
MPESA_CONSUMER_KEY="your-consumer-key"
MPESA_CONSUMER_SECRET="your-consumer-secret"
MPESA_PASSKEY="your-passkey"
MPESA_SHORTCODE="your-shortcode"
```

## License

MIT

