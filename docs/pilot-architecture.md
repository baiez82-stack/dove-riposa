# Dove Riposa - pilot architecture

## Commercial pilot
- Founding municipality: 12 months free from production activation.
- Goal: validate citizen demand, operational workload, data quality, accessibility routing and Live events.
- After the pilot, commercial terms are agreed separately; the free year is not an automatic entitlement for later municipalities.

## Product boundary
Citizen-facing:
- no account required;
- search and location only;
- Precision navigation;
- accessible/assisted routes;
- Live closures and works;
- privacy-minimized analytics.

Operator-facing:
- authenticated named users;
- admin/operator/viewer roles;
- CSV import and validation;
- data quality review;
- accessibility field survey;
- Precision markers;
- Live events;
- reports and audit log.

## Architecture
- Next.js on Vercel.
- Supabase Postgres + Auth.
- Multi-tenant data model with organization_id on every operational entity.
- RLS for authenticated municipal users.
- No anonymous direct table access.
- Citizen search/report APIs are mediated by Next.js route handlers with validation, rate limiting and bounded results.
- Analytics are stored as daily aggregate counters, not visitor profiles.
- Server-only Supabase secret remains only in Vercel environment variables.

## Pilot readiness gates
Before real municipal data:
1. Create Supabase project in EU region.
2. Apply schema migration and run security advisors.
3. Configure Auth and create named operator accounts.
4. Configure Vercel environment variables.
5. Replace demo arrays with database-backed APIs.
6. Add rate limiting / anti-bot to public search.
7. Add CSV preview, column mapping and validation before write.
8. Add audit writes for admin mutations.
9. Define DPA / Art. 28 roles, subprocessors and retention with the municipality/DPO.
10. Load official cemetery plan and validate accessibility segments on site.
