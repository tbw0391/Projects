# Roadmap

Build order: the money path first (estimate → approve → invoice → get paid),
then field ops.

## Phase 1: Estimating (done)
Estimates, cost items database, customers, printable proposal, company settings.

## Phase 2: Backend and accounts (done)
- Supabase: Postgres tables for company, customers, cost_items, estimates
  (sections and items as JSONB or child tables), with row-level security per company.
- Auth (email magic link), user roles (owner, estimator, field crew).
- Deploy to Vercel.

## Phase 3: Win the job
- Leads / Opportunities pipeline
- Email the proposal with an online accept + e-signature link
- Approved estimate → Project (auto-creates budget from estimate lines)

## Phase 4: Run the job
- Projects hub, Change Orders (priced like estimates), Work Orders, Sub-Contracts,
  Purchase Orders, Bills
- Schedule / Crew Schedule / Calendar
- Time Cards with Clock In / Out (GPS optional)
- Daily Logs, Files & Photos (Supabase Storage), Punchlists, To-Do's, Notes

## Phase 5: Get paid
- Invoices (progress billing off estimate %), Payments (Stripe), QuickBooks sync
- Reports: job costing (estimate vs. actual), WIP, profit by job

## Phase 6: Compliance and fleet
Permits, Inspections, Safety Meetings, Incidents, RFI & Notices, Vehicle Logs,
Equipment Logs, Forms & Checklists, Service Tickets
