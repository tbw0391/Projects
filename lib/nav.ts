// Menu modeled on the Contractor Foreman side drawer. `ready` marks modules
// that are built; everything else routes to a placeholder page for now.
export type NavItem = { label: string; href: string; ready?: boolean };
export type NavGroup = { label?: string; items: NavItem[] };

const stub = (label: string): NavItem => ({
  label,
  href: `/m/${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`,
});

export const NAV: NavGroup[] = [
  {
    items: [
      { label: 'Dashboard', href: '/', ready: true },
      stub('Crew Schedule'),
      stub('Invoices'),
      stub('Leads'),
      stub('Permits'),
      stub('Documents'),
      stub('Calendar'),
      stub('Projects'),
      stub('Opportunities'),
      stub('Time Cards'),
      { label: 'Directory', href: '/directory', ready: true },
      stub('Notes'),
      stub('Daily Logs'),
      stub("To-Do's"),
      { label: 'Estimates', href: '/estimates', ready: true },
      stub('Payments'),
      stub('Service Tickets'),
      stub('Change Orders'),
      stub('Work Orders'),
      stub('Punchlists'),
      stub('Files & Photos'),
      stub('Safety Meetings'),
      stub('RFI & Notices'),
      stub('Incidents'),
      stub('Vehicle Logs'),
      stub('Equipment Logs'),
      stub('Inspections'),
      stub('Bills'),
      stub('Purchase Orders'),
      stub('Forms & Checklists'),
      stub('Sub-Contracts'),
      stub('Reports'),
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Cost Items Database', href: '/cost-items', ready: true },
      { label: 'Company Settings', href: '/settings', ready: true },
    ],
  },
];

export const ALL_NAV = NAV.flatMap((g) => g.items);
