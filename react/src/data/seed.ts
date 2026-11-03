/* Seed data for the COMPANIES dataset.
   Tenant/product names: Components and AppSuite, with product aliases Sign, Insights, and Desk. */
import type { Company, DqIssue, Campaign, Segment, Reco, Experiment } from '../types';

export const ORDER = ['C001', 'C002', 'C003', 'C004', 'C005', 'C006', 'C007', 'C008'];

export const COMPANIES: Record<string, Company> = {
  C001: {
    id: 'C001', name: 'ABC Technologies', domain: 'abctech.com', ini: 'AB', type: 'Enterprise', employees: '1,200',
    tenant: 'Components', licenseType: 'Commercial', motion: 'Sales-led', revModel: 'Commercial license · annual renewal',
    source: 'Google Organic', introducedBy: 'John', crmStatus: 'Opportunity won', statusLabel: 'Customer', statusClass: 'pos',
    quality: 'High', confidence: 94, won: 35000, pipeline: 0,
    productRevenue: { DataGrid: 20000, 'PDF Viewer': 15000 },
    revenueSub: '$20k initial · $15k expansion', productsOwned: 'DataGrid, PDF Viewer', productInterest: 'PDF Viewer',
    crossSell: { product: 'Sign', tenant: 'AppSuite', note: 'Legal team evaluating e-signature — a Components customer expanding into an AppSuite SaaS product.' },
    journeyLength: '18 days', currentStage: 'Opportunity', currentStageClass: 'brand', visitorId: 'V1001', personId: 'P001', leadId: 'L501',
    email: 'john@abctech.com', touchpoints: 7, dq: ["Mary's original source is inferred, not observed"],
    sourceNote: 'Company first touch stays <b>Google Organic</b>. Mary arrived <b>Direct</b> — her own source is preserved and never overwritten.',
    people: [
      { n: 'John', role: 'Engineering lead (champion)', src: 'Google Organic', product: 'DataGrid', last: 'Discovery call', status: 'Qualified lead', cls: 'pos', conf: 94 },
      { n: 'Mary', role: 'Product manager', src: 'Direct', product: 'PDF Viewer', last: 'PDF Viewer pricing', status: 'Known visitor', cls: 'info', conf: 90 },
      { n: 'David', role: 'Developer (evaluator)', src: 'Trial', product: 'PDF Viewer', last: 'PDF Viewer docs', status: 'Known visitor', cls: 'info', conf: 88 },
    ],
    stages: [
      { name: 'Awareness', date: 'Jul 1 · Google', state: 'done' },
      { name: 'Interest', date: 'Jul 1–2 · Product, Docs', state: 'done' },
      { name: 'Evaluation', date: 'Jul 5–7 · Pricing, Trial', state: 'done' },
      { name: 'Sales engagement', date: 'Jul 10–14 · Form, Call', state: 'done' },
      { name: 'Opportunity', date: 'Jul 18 · Created', state: 'cur' },
    ],
    company: [
      ['Jul 1', 'Product page viewed — DataGrid', 'John · Organic search'],
      ['Jul 2', 'Documentation viewed', 'John · Website'],
      ['Jul 5', 'Pricing page viewed', 'Mary · Direct'],
      ['Jul 7', 'Trial downloaded', 'David · Product'],
      ['Jul 10', 'Contact form submitted', 'John · Website'],
      ['Jul 14', 'Discovery call', 'John · Sales'],
      ['Jul 18', 'Opportunity created', 'CRM'],
    ],
    persons: {
      John: [
        ['Jul 1', 'Product page viewed — DataGrid', 'Google Organic'],
        ['Jul 2', 'Documentation viewed', 'Website'],
        ['Jul 10', 'Contact form submitted', 'Website'],
        ['Jul 14', 'Discovery call', 'Sales'],
      ],
      Mary: [
        ['Jul 5', 'Pricing page viewed', 'Direct'],
        ['Aug 2', 'PDF Viewer product page', 'Direct'],
        ['Aug 4', 'PDF Viewer pricing (2×)', 'Direct'],
      ],
      David: [
        ['Jul 7', 'Trial downloaded — DataGrid', 'Product'],
        ['Aug 3', 'PDF Viewer documentation', 'Website'],
      ],
    },
  },
  C002: {
    id: 'C002', name: 'XYZ Ltd', domain: 'xyz.io', ini: 'XY', type: 'Mid-market', employees: '340',
    tenant: 'Components', licenseType: 'Community → Commercial', motion: 'PLG', revModel: 'Evaluating commercial upgrade from free tier',
    source: 'LinkedIn Enterprise', introducedBy: 'Sarah', crmStatus: 'Opportunity open', statusLabel: 'Opportunity', statusClass: 'brand',
    quality: 'Medium', confidence: 83, won: 0, pipeline: 25000,
    revenueSub: 'Open pipeline · $25,000', productsOwned: 'Community license', productInterest: 'DataGrid (Commercial)',
    journeyLength: '22 days', currentStage: 'Opportunity', currentStageClass: 'brand', visitorId: 'V2210', personId: 'P045', leadId: 'L612',
    email: 'sarah@xyz.io', touchpoints: 6, dq: ['Tom is not yet linked to a CRM contact'],
    sourceNote: 'Started on the <b>Community (free)</b> license, now evaluating a commercial upgrade. Company first touch stays LinkedIn Enterprise.',
    people: [
      { n: 'Sarah', role: 'Procurement lead (economic buyer)', src: 'LinkedIn Enterprise', product: 'DataGrid', last: 'Pricing page (2×)', status: 'Opportunity', cls: 'brand', conf: 83 },
      { n: 'Tom', role: 'Developer (community user)', src: 'Direct', product: 'DataGrid', last: 'Trial download', status: 'Trial user', cls: 'grey', conf: 79 },
    ],
    stages: [
      { name: 'Awareness', date: 'Mar 3 · LinkedIn', state: 'done' },
      { name: 'Interest', date: 'Mar 4 · Product page', state: 'done' },
      { name: 'Evaluation', date: 'Mar 9–18 · Community, Pricing', state: 'done' },
      { name: 'Sales engagement', date: 'Mar 22 · Demo', state: 'done' },
      { name: 'Opportunity', date: 'Mar 25 · Upgrade quote', state: 'cur' },
    ],
    company: [
      ['Mar 3', 'LinkedIn ad clicked', 'Sarah · LinkedIn'],
      ['Mar 4', 'DataGrid product page', 'Sarah · LinkedIn'],
      ['Mar 9', 'Community license installed', 'Tom · Product'],
      ['Mar 18', 'Commercial pricing viewed (2×)', 'Sarah · Direct'],
      ['Mar 22', 'Demo booked', 'Sarah · Sales'],
      ['Mar 25', 'Upgrade opportunity created', 'CRM'],
    ],
    persons: {
      Sarah: [
        ['Mar 3', 'LinkedIn ad clicked', 'LinkedIn'],
        ['Mar 4', 'DataGrid product page', 'LinkedIn'],
        ['Mar 18', 'Commercial pricing viewed (2×)', 'Direct'],
        ['Mar 22', 'Demo booked', 'Sales'],
      ],
      Tom: [
        ['Mar 9', 'Community license installed', 'Product'],
        ['Mar 11', 'Documentation viewed', 'Website'],
      ],
    },
  },
  C003: {
    id: 'C003', name: 'MNO Corp', domain: 'mno-corp.com', ini: 'MN', type: 'Enterprise', employees: '2,500',
    tenant: 'Components', licenseType: 'Commercial', motion: 'Sales-led', revModel: 'Commercial license · renewal at risk',
    source: 'Partner referral', introducedBy: 'Priya', crmStatus: 'Customer — renewal upcoming', statusLabel: 'Customer', statusClass: 'pos',
    quality: 'High', confidence: 96, won: 48000, pipeline: 0,
    productRevenue: { Diagram: 48000 },
    revenueSub: '$48k license · renewal in 30 days', productsOwned: 'Diagram', productInterest: '—',
    journeyLength: '41 days', currentStage: 'Renewal', currentStageClass: 'warn', visitorId: 'V3050', personId: 'P077', leadId: 'L701',
    email: 'priya@mno-corp.com', touchpoints: 7, dq: [],
    sourceNote: 'Introduced through a <b>Partner referral</b>. Renewal risk flagged from a recent usage decline.',
    people: [
      { n: 'Priya', role: 'Engineering manager (champion)', src: 'Partner referral', product: 'Diagram', last: 'Renewal review', status: 'Customer', cls: 'pos', conf: 96 },
      { n: 'Ken', role: 'Architect', src: 'Direct', product: 'Diagram', last: 'Documentation', status: 'Known visitor', cls: 'info', conf: 84 },
    ],
    stages: [
      { name: 'Awareness', date: 'Jan 8 · Partner', state: 'done' },
      { name: 'Interest', date: 'Jan 12 · Docs', state: 'done' },
      { name: 'Evaluation', date: 'Jan 20 · Trial', state: 'done' },
      { name: 'Sales engagement', date: 'Feb 2 · Call', state: 'done' },
      { name: 'Closed-won', date: 'Feb 18 · $48k', state: 'done' },
      { name: 'Renewal', date: 'Jul 10 · At risk', state: 'cur' },
    ],
    company: [
      ['Jan 8', 'Partner introduction', 'Priya · Partner'],
      ['Jan 12', 'Documentation viewed', 'Ken · Website'],
      ['Jan 20', 'Trial completed', 'Priya · Product'],
      ['Feb 2', 'Sales call', 'Priya · Sales'],
      ['Feb 18', 'License purchased — $48,000', 'CRM'],
      ['Jun 30', 'Usage decline detected', 'Product'],
      ['Jul 10', 'Renewal review', 'Priya · Sales'],
    ],
    persons: {
      Priya: [
        ['Jan 8', 'Partner introduction', 'Partner'],
        ['Jan 20', 'Trial completed', 'Product'],
        ['Feb 2', 'Sales call', 'Sales'],
        ['Jul 10', 'Renewal review', 'Sales'],
      ],
      Ken: [
        ['Jan 12', 'Documentation viewed', 'Website'],
        ['Jun 30', 'Fewer sessions logged', 'Product'],
      ],
    },
  },
  C004: {
    id: 'C004', name: 'Globex Inc', domain: 'globex.com', ini: 'GL', type: 'SMB', employees: '90',
    tenant: 'Components', licenseType: 'Community', motion: 'PLG', revModel: 'Community (free) — not yet converted',
    source: 'Google Organic', introducedBy: 'Alex', crmStatus: 'Lead', statusLabel: 'Lead', statusClass: 'grey',
    quality: 'Low', confidence: 71, won: 0, pipeline: 0,
    revenueSub: 'Community user · no pipeline yet', productsOwned: 'Community license', productInterest: 'PDF Viewer',
    journeyLength: '6 days', currentStage: 'Evaluation', currentStageClass: 'brand', visitorId: 'V4120', personId: 'P090', leadId: 'L780',
    email: 'alex@globex.com', touchpoints: 4, dq: ['Core feature not used within trial'],
    sourceNote: 'Installed the <b>Community (free)</b> license but the core feature was never used — a community→commercial candidate for onboarding.',
    people: [
      { n: 'Alex', role: 'Founder (developer)', src: 'Google Organic', product: 'PDF Viewer', last: 'Trial idle', status: 'Lead', cls: 'grey', conf: 71 },
    ],
    stages: [
      { name: 'Awareness', date: 'Aug 2 · Google', state: 'done' },
      { name: 'Interest', date: 'Aug 2 · Product', state: 'done' },
      { name: 'Evaluation', date: 'Aug 4 · Community (idle)', state: 'cur' },
      { name: 'Sales engagement', date: '—', state: 'future' },
      { name: 'Opportunity', date: '—', state: 'future' },
    ],
    company: [
      ['Aug 2', 'Google search — PDF Viewer', 'Alex · Organic'],
      ['Aug 2', 'PDF Viewer product page', 'Alex · Website'],
      ['Aug 4', 'Community license installed', 'Alex · Product'],
      ['Aug 6', 'Idle — core feature unused', 'Product'],
    ],
    persons: {
      Alex: [
        ['Aug 2', 'Google search — PDF Viewer', 'Organic'],
        ['Aug 2', 'PDF Viewer product page', 'Website'],
        ['Aug 4', 'Community license installed', 'Product'],
        ['Aug 6', 'Idle — core feature unused', 'Product'],
      ],
    },
  },
  C005: {
    id: 'C005', name: 'Contoso Ltd', domain: 'contoso.com', ini: 'CO', type: 'Mid-market', employees: '210',
    tenant: 'AppSuite', licenseType: 'SaaS trial', motion: 'PLG', revModel: 'SaaS · per-seat — trial not started',
    source: 'Paid social', introducedBy: 'Nina', crmStatus: 'Known visitor', statusLabel: 'Known visitor', statusClass: 'info',
    quality: 'Low', confidence: 64, won: 0, pipeline: 0,
    revenueSub: 'Not yet in pipeline', productsOwned: '—', productInterest: 'Sign',
    journeyLength: '1 day', currentStage: 'Awareness', currentStageClass: 'grey', visitorId: 'V5090', personId: null, leadId: null,
    email: null, touchpoints: 3, dq: ['Low-confidence company match — verify domain'],
    sourceNote: 'Company identified via reverse-IP (Snitcher). No individual has been resolved to an email yet.',
    people: [
      { n: 'Nina', role: 'Legal operations', src: 'Paid social', product: 'Sign', last: 'Homepage', status: 'Known visitor', cls: 'info', conf: 64 },
    ],
    stages: [
      { name: 'Awareness', date: 'Sep 1 · Paid social (bounced)', state: 'cur' },
      { name: 'Interest', date: '—', state: 'future' },
      { name: 'Sign-up', date: '—', state: 'future' },
      { name: 'Activation', date: '—', state: 'future' },
      { name: 'Customer', date: '—', state: 'future' },
    ],
    company: [
      ['Sep 1', 'Paid social click — Sign', 'Nina · Paid social'],
      ['Sep 1', 'Sign homepage viewed', 'Nina · Website'],
      ['Sep 1', 'Session ended', '—'],
    ],
    persons: {
      Nina: [
        ['Sep 1', 'Paid social click — Sign', 'Paid social'],
        ['Sep 1', 'Sign homepage viewed', 'Website'],
        ['Sep 1', 'Session ended', '—'],
      ],
    },
  },
  C006: {
    id: 'C006', name: 'Initech', domain: 'initech.co', ini: 'IN', type: 'Mid-market', employees: '620',
    tenant: 'AppSuite', licenseType: 'SaaS', motion: 'Sales-led', revModel: 'SaaS · sales-led — pipeline $15k',
    source: 'LinkedIn Enterprise', introducedBy: 'Marco', crmStatus: 'Opportunity open', statusLabel: 'Opportunity', statusClass: 'brand',
    quality: 'Medium', confidence: 88, won: 0, pipeline: 15000,
    revenueSub: 'Open pipeline · $15,000', productsOwned: '—', productInterest: 'Insights',
    journeyLength: '20 days', currentStage: 'Opportunity', currentStageClass: 'brand', visitorId: 'V6011', personId: 'P130', leadId: 'L810',
    email: 'marco@initech.co', touchpoints: 6, dq: [],
    sourceNote: 'A sales-led <b>Insights</b> (embedded analytics) evaluation — a technical champion plus an economic buyer.',
    people: [
      { n: 'Marco', role: 'Analytics lead (champion)', src: 'LinkedIn Enterprise', product: 'Insights', last: 'POC review', status: 'Opportunity', cls: 'brand', conf: 88 },
      { n: 'Rosa', role: 'VP Data (economic buyer)', src: 'Direct', product: 'Insights', last: 'Pricing discussion', status: 'Opportunity', cls: 'brand', conf: 82 },
    ],
    stages: [
      { name: 'Awareness', date: 'Jun 3 · LinkedIn', state: 'done' },
      { name: 'Interest', date: 'Jun 5 · Insights docs', state: 'done' },
      { name: 'Evaluation', date: 'Jun 9–15 · POC', state: 'done' },
      { name: 'Sales engagement', date: 'Jun 18 · Demo, Call', state: 'done' },
      { name: 'Opportunity', date: 'Jun 23 · Created', state: 'cur' },
    ],
    company: [
      ['Jun 3', 'LinkedIn ad — Insights', 'Marco · LinkedIn'],
      ['Jun 5', 'Insights documentation', 'Marco · Website'],
      ['Jun 9', 'POC environment created', 'Marco · Product'],
      ['Jun 15', 'Embedded dashboards tested', 'Marco · Product'],
      ['Jun 18', 'Demo + pricing call', 'Rosa · Sales'],
      ['Jun 23', 'Opportunity created — $15,000', 'CRM'],
    ],
    persons: {
      Marco: [
        ['Jun 3', 'LinkedIn ad — Insights', 'LinkedIn'],
        ['Jun 5', 'Insights documentation', 'Website'],
        ['Jun 9', 'POC environment created', 'Product'],
        ['Jun 15', 'Embedded dashboards tested', 'Product'],
      ],
      Rosa: [
        ['Jun 18', 'Demo + pricing call', 'Sales'],
        ['Jun 20', 'Pricing discussion', 'Direct'],
      ],
    },
  },
  C007: {
    id: 'C007', name: 'Umbrella Co', domain: 'umbrella.co', ini: 'UM', type: 'SMB', employees: '45',
    tenant: 'Components', licenseType: 'Commercial (self-serve)', motion: 'PLG', revModel: 'Self-serve commercial license (pending)',
    source: 'Direct', introducedBy: 'Lea', crmStatus: 'Opportunity open', statusLabel: 'Opportunity', statusClass: 'brand',
    quality: 'Medium', confidence: 81, won: 0, pipeline: 9000,
    revenueSub: 'Open pipeline · $9,000', productsOwned: '—', productInterest: 'DataGrid',
    journeyLength: '4 days', currentStage: 'Opportunity', currentStageClass: 'brand', visitorId: 'V7001', personId: 'P150', leadId: 'L820',
    email: 'lea@umbrella.co', touchpoints: 4, dq: [],
    sourceNote: 'A fast, single-person self-serve <b>Direct</b> journey — the shortest path to a commercial license in the demo set.',
    people: [
      { n: 'Lea', role: 'Owner (buyer + user)', src: 'Direct', product: 'DataGrid', last: 'Checkout started', status: 'Opportunity', cls: 'brand', conf: 81 },
    ],
    stages: [
      { name: 'Awareness', date: 'May 10 · Direct', state: 'done' },
      { name: 'Interest', date: 'May 10 · Pricing', state: 'done' },
      { name: 'Evaluation', date: 'May 11–12 · Trial', state: 'done' },
      { name: 'Sales engagement', date: 'May 13 · Self-serve', state: 'done' },
      { name: 'Opportunity', date: 'May 14 · Checkout', state: 'cur' },
    ],
    company: [
      ['May 10', 'Pricing page viewed', 'Lea · Direct'],
      ['May 11', 'Trial downloaded', 'Lea · Product'],
      ['May 12', 'Trial completed', 'Lea · Product'],
      ['May 14', 'Checkout started — $9,000', 'CRM'],
    ],
    persons: {
      Lea: [
        ['May 10', 'Pricing page viewed', 'Direct'],
        ['May 11', 'Trial downloaded', 'Product'],
        ['May 12', 'Trial completed', 'Product'],
        ['May 14', 'Checkout started — $9,000', 'CRM'],
      ],
    },
  },
  C008: {
    id: 'C008', name: 'Northwind Traders', domain: 'northwind.io', ini: 'NW', type: 'Mid-market', employees: '480',
    tenant: 'AppSuite', licenseType: 'SaaS seats', motion: 'PLG', revModel: 'SaaS · per-seat (ARR $18k) · expanding',
    source: 'Google Organic', introducedBy: 'Dana', crmStatus: 'Customer — expanding', statusLabel: 'Customer', statusClass: 'pos',
    quality: 'High', confidence: 92, won: 18000, pipeline: 6000,
    productRevenue: { Desk: 18000 },
    revenueSub: '$18k ARR · +$6k seat expansion in progress', productsOwned: 'Desk', productInterest: 'Insights',
    crossSell: { product: 'Insights', tenant: 'AppSuite', note: 'Happy Desk customer viewing Insights — an in-suite cross-sell.' },
    journeyLength: '60 days', currentStage: 'Expansion', currentStageClass: 'pos', visitorId: 'V8010', personId: 'P160', leadId: 'L830',
    email: 'dana@northwind.io', touchpoints: 6, dq: [],
    sourceNote: 'A <b>product-led (PLG)</b> land-and-expand motion: self-serve signup, activated, then expanded seats — the SaaS growth loop.',
    people: [
      { n: 'Dana', role: 'Support manager (champion)', src: 'Google Organic', product: 'Desk', last: 'Seat expansion', status: 'Customer', cls: 'pos', conf: 92 },
      { n: 'Omar', role: 'IT director (admin)', src: 'Direct', product: 'Desk', last: 'Added 8 agents', status: 'Customer', cls: 'pos', conf: 88 },
    ],
    stages: [
      { name: 'Awareness', date: 'Apr 2 · Google', state: 'done' },
      { name: 'Sign-up', date: 'Apr 3 · Free trial', state: 'done' },
      { name: 'Activation', date: 'Apr 6 · First ticket resolved', state: 'done' },
      { name: 'Customer', date: 'Apr 20 · Paid · 5 seats', state: 'done' },
      { name: 'Expansion', date: 'Jun 1 · +8 seats', state: 'cur' },
    ],
    company: [
      ['Apr 2', 'Google search — help desk', 'Dana · Organic'],
      ['Apr 3', 'Desk free trial started', 'Dana · Product'],
      ['Apr 6', 'First ticket resolved (activation)', 'Dana · Product'],
      ['Apr 20', 'Converted to paid — 5 seats', 'Billing'],
      ['Jun 1', 'Expanded to 13 seats', 'Omar · Product'],
      ['Jul 8', 'Viewed Insights product page', 'Dana · Website'],
    ],
    persons: {
      Dana: [
        ['Apr 2', 'Google search — help desk', 'Organic'],
        ['Apr 3', 'Desk free trial started', 'Product'],
        ['Apr 6', 'First ticket resolved', 'Product'],
        ['Jul 8', 'Viewed Insights product page', 'Website'],
      ],
      Omar: [
        ['Apr 20', 'Converted to paid — 5 seats', 'Billing'],
        ['Jun 1', 'Added 8 agents (13 seats)', 'Product'],
      ],
    },
  },
};

export const NAME2ID: Record<string, string> = {};
ORDER.forEach((id) => { NAME2ID[COMPANIES[id].name] = id; });

/* Standalone tables */
export const dqData: DqIssue[] = [
  { issue: 'People without companies', affects: 'Weakens company-level journeys & attribution', count: 214, severity: 'warn' },
  { issue: 'Duplicate people', affects: 'Splits one buyer into many records', count: 96, severity: 'warn' },
  { issue: 'Duplicate companies', affects: 'Inflates account counts', count: 41, severity: 'neg' },
  { issue: 'Missing sources', affects: 'Breaks first-touch attribution', count: 327, severity: 'warn' },
  { issue: 'Unmatched visitors', affects: 'Anonymous activity not yet stitched', count: 612, severity: 'grey' },
  { issue: 'Low-confidence company matches', affects: 'May misattribute revenue', count: 141, severity: 'neg' },
];

export const campaigns: Campaign[] = [
  { name: 'Google DataGrid', cost: 10000, leads: 200, customers: 20, revenue: 200000 },
  { name: 'LinkedIn Insights', cost: 15000, leads: 80, customers: 10, revenue: 180000 },
];

export const drivers: Record<'source' | 'product' | 'owner', [string, number][]> = {
  source: [['Google Organic', 120000], ['Partner referrals', 90000], ['Existing-customer expansion', 50000], ['Paid social', -30000]],
  product: [['DataGrid', 70000], ['PDF Viewer', 40000], ['Diagram', 60000], ['Insights', 120000], ['Desk', 50000]],
  owner: [['A. Rivera', 95000], ['S. Okafor', 80000], ['Team unassigned', -25000], ['J. Lin', 70000]],
};

export const contentPages: Record<'revenue' | 'first' | 'lead' | 'opp', [string, number, number][]> = {
  revenue: [['DataGrid product page', 120, 1200000], ['DataGrid documentation', 85, 820000], ['Pricing page', 70, 760000], ['Insights product page', 60, 600000]],
  first: [['DataGrid product page', 210, 900000], ['Insights docs', 140, 410000], ['Homepage', 120, 380000], ['Pricing page', 70, 300000]],
  lead: [['Pricing page', 96, 760000], ['Contact form page', 88, 690000], ['Trial download page', 74, 540000], ['Demo request', 52, 410000]],
  opp: [['DataGrid documentation', 85, 820000], ['Insights POC page', 60, 600000], ['Case studies', 44, 380000], ['Security page', 38, 300000]],
};

export const segments: Segment[] = [
  { name: 'Community → Commercial upgrade', co: 'XYZ Ltd', companies: 180, activated: 150, rev: 260000 },
  { name: 'Renewal risk', co: 'MNO Corp', companies: 120, activated: 110, rev: 500000 },
  { name: 'Trial without activation', co: 'Contoso Ltd', companies: 400, activated: 380, rev: 420000 },
  { name: 'Seat expansion (PLG)', co: 'Northwind Traders', companies: 90, activated: 80, rev: 300000 },
  { name: 'Components → AppSuite cross-sell', co: 'ABC Technologies', companies: 60, activated: 45, rev: 180000, xtenant: true },
];

export const alerts: { t: string; co: string; pri: 'High' | 'Medium'; status: string; owner: string; created: string; expires: string; action: string; evidence: string[]; xtenant?: boolean }[] = [
  { t: 'Cross-sell interest', co: 'ABC Technologies', pri: 'High', status: 'Open — pending', owner: 'Account Manager', created: '2 days ago', expires: 'in 5 days', action: 'Share PDF Viewer evaluation resources.', evidence: ['PDF Viewer product page viewed', 'Documentation viewed by 2 employees', 'Pricing page viewed twice'] },
  { t: 'Community → Commercial', co: 'XYZ Ltd', pri: 'High', status: 'Open — pending', owner: 'Account Executive', created: '1 day ago', expires: 'in 6 days', action: 'Send Sarah a commercial upgrade quote with ROI examples.', evidence: ['Community license installed', 'Commercial pricing viewed twice', 'Demo booked'] },
  { t: 'Renewal risk', co: 'MNO Corp', pri: 'Medium', status: 'Open — pending', owner: 'Customer Success', created: '3 days ago', expires: 'in 2 days', action: 'Start a renewal conversation; confirm value delivered.', evidence: ['Usage decline detected', 'Fewer sessions logged by Ken', 'Renewal in 30 days'] },
  { t: 'Community idle', co: 'Globex Inc', pri: 'Medium', status: 'Open — pending', owner: 'Sales Development', created: '4 days ago', expires: 'in 1 day', action: 'Send onboarding guidance for the unused core feature.', evidence: ['Community license installed', 'Core feature never used', 'No commercial intent yet'] },
  { t: 'Seat expansion', co: 'Northwind Traders', pri: 'Medium', status: 'Open — pending', owner: 'Customer Success', created: '2 days ago', expires: 'in 8 days', action: 'Confirm the +8 seat expansion; check adoption health.', evidence: ['Expanded from 5 to 13 seats', 'High activation', 'Strong support usage'] },
  { t: 'POC follow-up', co: 'Initech', pri: 'High', status: 'Open — pending', owner: 'Account Executive', created: '1 day ago', expires: 'in 4 days', action: 'Send the Insights POC success plan and pricing to Rosa.', evidence: ['POC dashboards tested', 'Demo + pricing call held', 'Economic buyer engaged'] },
  { t: 'Cross-tenant cross-sell', co: 'ABC Technologies', pri: 'High', status: 'Open — pending', owner: 'AppSuite AE', created: '1 day ago', expires: 'in 7 days', xtenant: true, action: 'A Components customer is evaluating Sign — loop in the AppSuite team.', evidence: ['ABC legal team viewed Sign', 'Existing Components commercial customer', 'High account health'] },
];

export const recos: Reco[] = [
  { co: 'ABC Technologies', rec: 'Offer PDF Viewer demo', reason: 'Pricing & documentation activity', conf: 72, result: 'Opportunity created', cls: 'pos' },
  { co: 'XYZ Ltd', rec: 'Send commercial upgrade offer', reason: 'Community user hit commercial pricing twice', conf: 70, result: 'Upgrade quote sent', cls: 'brand' },
  { co: 'MNO Corp', rec: 'Start renewal follow-up', reason: 'Usage decline', conf: 75, result: 'Renewal discussion started', cls: 'brand' },
  { co: 'Globex Inc', rec: 'Community onboarding nudge', reason: 'Core feature not used', conf: 61, result: 'Pending', cls: 'grey' },
  { co: 'Northwind Traders', rec: 'Offer Insights (in-suite)', reason: 'Viewed Insights while expanding Desk', conf: 69, result: 'Interest confirmed', cls: 'pos' },
  { co: 'Initech', rec: 'Send Insights POC success plan', reason: 'POC completed, buyer engaged', conf: 73, result: 'Pending', cls: 'grey' },
  { co: 'ABC Technologies', rec: 'Introduce Sign (cross-tenant)', reason: 'Component customer evaluating an AppSuite product', conf: 66, result: 'AppSuite team looped in', cls: 'brand', xtenant: true },
];

export const experiments: Experiment[] = [
  { name: 'Cross-sell email', treatment: '12%', control: '7%', lift: '+5 pts', confidence: '95%', decision: 'Expand campaign', cls: 'pos' },
  { name: 'Community upgrade nudge', treatment: '18%', control: '17%', lift: '+1 pt', confidence: '61%', decision: 'No meaningful improvement', cls: 'grey' },
  { name: 'Renewal save play', treatment: '22%', control: '13%', lift: '+9 pts', confidence: '98%', decision: 'Continue', cls: 'pos' },
];

/* Quality reasons (illustrative, ABC Technologies) */
export const qualityReasons: [string, number][] = [
  ['Strong product fit', 92],
  ['Multiple engaged employees', 88],
  ['Trial completed', 95],
  ['Sales response within 2 days', 90],
  ['Opportunity progressed quickly', 86],
  ['$20,000 initial purchase', 100],
];

/* AI suggestion chips */
export const aiSuggestions: string[] = [
  'Which sources bring the most revenue?',
  "Explain ABC Technologies' attribution.",
  'Which companies should sales contact next?',
  'Where is the funnel drop-off?',
];