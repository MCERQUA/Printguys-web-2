# PrintGuys Next.js - Project Instructions

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

## Server Components: Fetching API Routes

**NEVER** hardcode `localhost` for server-side API fetches:

```typescript
// BAD - fails on Netlify
const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// GOOD - uses request headers
const { headers } = await import("next/headers");
const headersList = await headers();
const host = headersList.get("host") || "localhost:3000";
const protocol = headersList.get("x-forwarded-proto") || "http";
const baseUrl = `${protocol}://${host}`;
```
