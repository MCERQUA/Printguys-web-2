# PRINTGUYS WEBSITE COMPLETION - MASTER PLAN
**Created:** 2026-01-26 17:28 UTC
**Target Completion:** 2026-01-26 (Today - Autonomous Sprint)
**Status:** IN PROGRESS

---

## OVERVIEW

This document outlines the complete plan to finish the Printguys Next.js website. Multiple z-code agents will work in parallel, managed by a cron-based orchestrator that ensures continuous progress.

---

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    CRON MANAGER (5 min)                      │
│              /z-code-manager/manager.sh                      │
│         Monitors all agents, restarts if stopped             │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ AGENT 1  │    │ AGENT 2  │    │ AGENT 3  │
   │ Database │    │ Backend  │    │ Frontend │
   │   Setup  │    │   APIs   │    │ Features │
   └──────────┘    └──────────┘    └──────────┘
          │               │               │
          └───────────────┼───────────────┘
                          ▼
              ┌─────────────────────┐
              │   TASK TRACKER      │
              │   tasks.json        │
              │   Progress logs     │
              └─────────────────────┘
```

---

## TASK CATEGORIES

### PHASE 1: CRITICAL BACKEND (Priority 1)
- [ ] T001: Connect PostgreSQL database
- [ ] T002: Run Prisma migrations
- [ ] T003: Update API routes to use real database
- [ ] T004: Set up email service (Resend)
- [ ] T005: Wire contact form to send emails
- [ ] T006: Make orders persist to database
- [ ] T007: Make designs persist to database

### PHASE 2: E-COMMERCE (Priority 2)
- [ ] T008: Build shopping cart store (Zustand)
- [ ] T009: Create cart UI components
- [ ] T010: Integrate Stripe checkout
- [ ] T011: Create checkout page
- [ ] T012: Add order confirmation emails
- [ ] T013: Build customer dashboard page
- [ ] T014: Show order history

### PHASE 3: ADMIN DASHBOARD (Priority 3)
- [ ] T015: Create admin layout
- [ ] T016: Build orders management page
- [ ] T017: Build customers list page
- [ ] T018: Add order status updates
- [ ] T019: Basic analytics dashboard

### PHASE 4: POLISH & OPTIMIZATION (Priority 4)
- [ ] T020: Add Google Analytics to all pages
- [ ] T021: Add LocalBusiness schema markup
- [ ] T022: Optimize images
- [ ] T023: Add real portfolio content
- [ ] T024: Performance audit & fixes
- [ ] T025: Security audit & fixes

---

## AGENT ASSIGNMENTS

### Agent 1: Database & Infrastructure
**Tasks:** T001-T003
**Output:** /z-code-outputs/agent1-database.md

### Agent 2: Email & Contact System
**Tasks:** T004-T005
**Output:** /z-code-outputs/agent2-email.md

### Agent 3: Orders & Designs Persistence
**Tasks:** T006-T007
**Output:** /z-code-outputs/agent3-persistence.md

### Agent 4: Shopping Cart
**Tasks:** T008-T009
**Output:** /z-code-outputs/agent4-cart.md

### Agent 5: Stripe & Checkout
**Tasks:** T010-T012
**Output:** /z-code-outputs/agent5-stripe.md

### Agent 6: Customer Dashboard
**Tasks:** T013-T014
**Output:** /z-code-outputs/agent6-customer.md

### Agent 7: Admin Dashboard
**Tasks:** T015-T019
**Output:** /z-code-outputs/agent7-admin.md

### Agent 8: SEO & Polish
**Tasks:** T020-T025
**Output:** /z-code-outputs/agent8-polish.md

---

## SUCCESS CRITERIA

1. Database connected and migrations run
2. Contact form sends emails
3. Orders saved to database
4. Designs saved to database
5. Shopping cart functional
6. Stripe checkout working
7. Customer can view order history
8. Admin can manage orders
9. All pages have analytics
10. Site passes Lighthouse audit (>80)

---

## MONITORING

- Manager cron runs every 5 minutes
- Checks `/z-code-logs/` for active agents
- Restarts any stopped agents
- Updates `/z-code-manager/status.json`
- Logs to `/z-code-manager/manager.log`
