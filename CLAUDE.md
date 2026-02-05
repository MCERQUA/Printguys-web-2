# PrintGuys Next.js - Project Instructions

## ⚠️⚠️⚠️ CRITICAL RULE - NEVER DELETE ANYTHING ⚠️⚠️⚠️

**ABSOLUTELY FORBIDDEN:**
- ❌ NEVER delete files - NOT EVER
- ❌ NEVER use `rm` command
- ❌ NEVER suggest deleting anything
- ❌ NEVER "clean up" by removing files
- ❌ NEVER delete logs, executors, scripts, configs
- ❌ NEVER delete /images/ or /public/ folders
- ❌ NEVER delete research files, prompts, or outputs
- ❌ NEVER delete "old" or "broken" files

**IF FILES SHOULDN'T BE IN GIT:**
- ✅ Use .gitignore to exclude them
- ✅ Ask the user first
- ✅ Leave everything in place

**CONSEQUENCES:**
- Deleting downloaded images wastes time and money
- Deletions cannot be easily recovered
- USE .GITIGNORE FOR EXCLUSIONS, NOT DELETION

## ⚠️ CRITICAL: Production vs Localhost

**DEPLOYMENT TARGET: NETLIFY (Production)**

- This site deploys to Netlify via GitHub (auto-deploy on push to main)
- **NEVER hardcode localhost URLs** in production code
- Use localhost ONLY for local build testing with `npm run build`
- Server components should query Prisma directly, NOT fetch API routes with URLs
- All environment variables must be set in Netlify, not just locally

```bash
# Local testing ONLY
npm run build  # Verify build works locally
npm run dev    # Local development server

# Production
git push origin main  # Deploys to Netlify automatically
```

## Build & Deployment

This project deploys to **Netlify** with auto-deploy on push to main.

### Critical: Prisma on Netlify

Netlify caches `node_modules`, which means Prisma Client doesn't regenerate automatically. The build script MUST include `prisma generate`:

```json
"build": "prisma generate && next build"
```

**NEVER change the build script to just `next build`** - it will fail on Netlify.

### Before Pushing Changes

1. **Run build locally first** to catch errors:
   ```bash
   npm run build
   ```

2. **Check for TypeScript errors**:
   ```bash
   npx tsc --noEmit
   ```

3. **If you modify Prisma schema**, always run:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Database

### PRODUCTION DATABASE (IMPORTANT!)

**The production PostgreSQL database runs on THIS VPS at localhost:5432**

- **Location**: This VPS (178.156.162.212)
- **Port**: 5432
- **Database Name**: printguys
- **User**: printguys
- **Connection**: Netlify connects remotely to this VPS database
- **Local DATABASE_URL**: `postgresql://printguys:printguys_secure_2026@localhost:5432/printguys`

This means:
- When running `prisma db push` locally, you ARE updating the production database
- The DATABASE_URL in .env points to the PRODUCTION database (not a local dev DB)
- There is NO separate development database - be careful!

### Database Schema Management

- **ORM**: Prisma with PostgreSQL
- **Schema**: `prisma/schema.prisma`
- After schema changes, run: `npx prisma generate` && `npx prisma db push`

### Design Studio Share URLs (NEW)

Recent additions for shareable designs:
- `shareId` - Unique 8-character ID for public sharing
- `parentDesignId` - Links forked designs to originals
- `forkCount` - Tracks how many times a design was forked
- `viewCount` - Tracks design popularity

API endpoints:
- `/api/designs` - Create/save designs (returns shareUrl)
- `/api/designs/share/[shareId]` - Public endpoint to view shared designs
- `/api/designs/[shareId]/fork` - Fork a shared design

## Key Directories

- `/src/app/blanks/` - Blank products catalog
- `/src/app/api/blanks/` - Blanks API routes
- `/src/app/design-studio/` - Design studio tool
- `/src/stores/` - Zustand state management
- `/src/scripts/` - Data import scripts (run locally, not in build)
- `/src/components/layout/` - Header, Footer, FloatingDesignButton
- `/src/components/design-studio/` - Canvas, Sidebar, Toolbar, Export Modal

## Printguys Brand Style

### Typography
- **Bold, aggressive fonts**: `font-black`, `font-bold`
- **Uppercase headers**: `uppercase` for emphasis
- **Tight tracking**: `tracking-tighter` for large headlines
- **Wide tracking**: `tracking-[0.3em]` for badges/labels

### Colors
- **Primary**: Red (`red-500`, `red-600`)
- **Backgrounds**: Black (`bg-black`, `bg-gray-900`)
- **Accents**: Red glows (`shadow-red-500/50`)

### Effects
- **Hover states**: `hover:scale-105`, `hover:bg-red-600`
- **Shadows**: `shadow-2xl`, `shadow-red-600/50`
- **Transitions**: `transition-all duration-300`
- **Backdrop blur**: `backdrop-blur-md`, `backdrop-blur-xl`

### Button Styles
- **Primary CTA**: `bg-red-600 hover:bg-red-600 text-white font-black uppercase`
- **Secondary**: `border-2 border-white/20 hover:border-white text-white`
- **Icons**: Use lucide-react (PenTool, ShoppingBag, Wrench, Sparkles, etc.)

## Environment Variables Required on Netlify

- `DATABASE_URL` - PostgreSQL connection string (connects to VPS at 178.156.162.212:5432)
- `CLERK_SECRET_KEY` - Clerk auth
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- All other `NEXT_PUBLIC_CLERK_*` variables

### VPS Information

- **IP**: 178.156.162.212
- **OS**: Ubuntu 24.04
- **Database**: PostgreSQL 16 running on VPS (localhost:5432)
- **Connection**: Netlify connects remotely to VPS database
- **Database Credentials** (in .env, DO NOT COMMIT):
  - User: `printguys`
  - Password: `printguys_secure_2026`
  - Database: `printguys`

### Running Database Commands

To run SQL directly:
```bash
PGPASSWORD=printguys_secure_2026 psql -h localhost -U printguys -d printguys -c "YOUR_SQL_HERE"
```

To run Prisma commands:
```bash
npx prisma db push  # Syncs schema (affects production!)
npx prisma studio   # Opens Prisma Studio (database GUI)
```

## Common Build Failures

| Error | Solution |
|-------|----------|
| `PrismaClientInitializationError` | Ensure `prisma generate` is in build script |
| `Module not found: @prisma/client` | Run `npm install` then `prisma generate` |
| ESLint errors | Fix or add `ignoreDuringBuilds: true` in next.config |
| Type errors | Run `npx tsc --noEmit` locally first |
| API returns empty on Netlify | Don't hardcode `localhost` - use headers to get host |

## Server Components: Data Fetching

**BEST PRACTICE**: Server components should query Prisma directly, NOT fetch API routes:

```typescript
// BAD - Server component fetching its own API
const res = await fetch(`${baseUrl}/api/products`);

// GOOD - Server component querying database directly
import { prisma } from "@/lib/prisma";

export default async function Page() {
  const products = await prisma.blankProduct.findMany({
    where: { isActive: true },
  });
  // ...
}
```

API routes (`/api/*`) are for:
- Client-side fetches (React Query, SWR, fetch from useEffect)
- External integrations (webhooks, third-party services)
- NOT for server components to call themselves

## Navigation & Menu Structure

### Desktop Menu (Top Nav)

**Dropdowns:**
- **Shop** (ShoppingBag icon): Shop Blanks, Catalog, Pricing
- **Tools** (Wrench icon): Design Studio, Get a Quote
- **Services** (Sparkles icon): All services with icons and descriptions
- **More**: Contact Us, About Us

**Auth Section (right side):**
- **Logged out**: Sign In (ghost), Sign Up (red button)
- **Logged in**: Account dropdown → Dashboard, My Orders, User profile
- Cart icon

### Mobile Menu

- Full-screen slide-in from right (w-96 on desktop)
- Organized sections with colored headers:
  - Shop (red icon)
  - Tools (blue icon)
  - Services (purple icon, 2-column grid)
- Sign In / Create Account buttons at bottom
- Backdrop blur effect

### Floating Design Studio Button

- **Location**: Fixed bottom-right
- **Behavior**: Appears after scrolling 300px down
- **Hidden on**: Design Studio pages (/design-studio, /design-studio/shared/*)
- **Effects**: Pulse animation, expands on hover to show "DESIGN" text
- **File**: `/src/components/layout/FloatingDesignButton.tsx`

## Authentication & User Accounts

**Provider**: Clerk (https://dashboard.clerk.com)

### User Dashboard

- **Route**: `/dashboard`
- **Features**:
  - Order count, saved designs count, total spent
  - Recent orders list
  - Quick actions: Create New Design, Get a Quote
- **Sub-pages**:
  - `/dashboard/orders` - All orders
  - `/dashboard/orders/[id]` - Single order details
