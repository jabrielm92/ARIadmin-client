# ADMIN LEAD GEN - PRODUCTION REBUILD PLAN

## Current Issues:
1. ❌ Mock data instead of real database
2. ❌ Pending review doesn't show real leads
3. ❌ Approve/reject doesn't actually work
4. ❌ Billing not automated
5. ❌ Campaign creation flow incomplete
6. ❌ Missing API routes

## What I'm Fixing NOW:

### 1. Real Database Queries
- Fetch real campaigns from MongoDB
- Fetch real pending leads
- Update lead status on approve/reject
- Track billing automatically

### 2. Complete API Routes
- GET /api/admin/lead-gen/stats (real stats)
- GET /api/admin/lead-gen/campaigns (all campaigns)
- GET /api/admin/lead-gen/pending-leads (needs review)
- POST /api/admin/lead-gen/approve-lead (approve & deliver)
- POST /api/admin/lead-gen/reject-lead (mark invalid)

### 3. Automated Billing
- Auto-increment leads delivered on approve
- Track in /admin/clients/[id]/billing
- Ready for invoicing

### 4. Working Campaign Flow
- Create campaign → Saves to DB
- Build landing page → Saves to DB
- Public page → Captures to DB with status "pending"
- Admin reviews → Approves/rejects
- Client sees only approved

### 5. Production-Ready UI
- Real data everywhere
- Proper error handling
- Loading states
- Success/error messages

## Building Now...
