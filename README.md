# Remodel Estimator

An estimating and project-management app for a remodeling company, modeled on
the Contractor Foreman menu layout.

## What works today

- **Estimates**: sections (Kitchen, Bath, Demo…), line items with qty, unit,
  unit cost, markup %, and taxable flag. It figures subtotal, discount, tax, and
  total, and also shows *internal-only* cost, gross profit, and margin.
  Status runs Draft → Sent → Approved/Declined. Estimates can be duplicated.
- **Proposal**: a customer-facing printable view (prices only, no cost or
  markup) with terms and signature lines. Use Print → Save as PDF.
- **Cost Items Database**: your price book, seeded with common remodeling
  items. Pull items into any estimate section from a searchable picker.
- **Directory**: customers.
- **Company Settings**: name, license, contact info, default tax rate, terms.
- **Dashboard**: open pipeline and approved totals.
- Every other Contractor Foreman module is in the menu as a placeholder.

Data is stored in the browser (localStorage) for now, so each device has its
own copy. See ROADMAP.md for the move to Supabase.

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
```
