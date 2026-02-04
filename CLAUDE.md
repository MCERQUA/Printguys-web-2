# PrintGuys Next.js - Project Instructions

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

- **ORM**: Prisma with PostgreSQL
- **Schema**: `prisma/schema.prisma`
- After schema changes, run `prisma generate` AND `prisma db push`

## Key Directories

- `/src/app/blanks/` - Blank products catalog
- `/src/app/api/blanks/` - Blanks API routes
- `/src/stores/` - Zustand state management
- `/scripts/` - Data import scripts (run locally, not in build)

## Environment Variables Required on Netlify

- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_SECRET_KEY` - Clerk auth
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- All other `NEXT_PUBLIC_CLERK_*` variables

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
