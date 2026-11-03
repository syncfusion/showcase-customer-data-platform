/* Domain types for the COMPANIES dataset. */

export type TenantKey = 'all' | 'Components' | 'AppSuite';
export const TENANT_LABELS: Record<TenantKey, string> = {
  all: 'Combined',
  Components: 'Components',
  AppSuite: 'AppSuite',
};
/** Tenants other than "all" */
export const TENANTS: Exclude<TenantKey, 'all'>[] = ['Components', 'AppSuite'];

export interface Person {
  n: string;
  role: string;
  src: string;
  product: string;
  last: string;
  status: string;
  cls: string;
  conf: number;
}

export interface Stage {
  name: string;
  date: string;
  state: 'done' | 'cur' | 'future';
}

export type TimelineEvent = [string, string, string]; // [date, act, who]

export interface Company {
  id: string;
  name: string;
  domain: string;
  ini: string;
  type: string;
  employees: string;
  tenant: Exclude<TenantKey, 'all'>;
  licenseType: string;
  motion: string;
  revModel: string;
  source: string;
  introducedBy: string;
  crmStatus: string;
  statusLabel: string;
  statusClass: string;
  quality: 'High' | 'Medium' | 'Low';
  confidence: number;
  won: number;
  pipeline: number;
  productRevenue?: Record<string, number>;
  revenueSub: string;
  productsOwned: string;
  productInterest: string;
  crossSell?: { product: string; tenant: Exclude<TenantKey, 'all'>; note: string };
  journeyLength: string;
  currentStage: string;
  currentStageClass: string;
  visitorId: string;
  personId: string | null;
  leadId: string | null;
  email: string | null;
  touchpoints: number;
  dq: string[];
  sourceNote: string;
  people: Person[];
  stages: Stage[];
  company: TimelineEvent[];
  persons: Record<string, TimelineEvent[]>;
}

export interface DqIssue {
  issue: string;
  affects: string;
  count: number;
  severity: 'warn' | 'neg' | 'grey';
}

export interface Campaign {
  name: string;
  cost: number;
  leads: number;
  customers: number;
  revenue: number;
}

export interface SourceAgg {
  n: number;
  won: number;
  pipe: number;
  high: number;
  med: number;
  low: number;
  cust: number;
}

export interface ProductAgg {
  won: number;
  owned: number;
  interest: number;
}

export interface Aggregates {
  won: number;
  pipeline: number;
  customers: number;
  companies: number;
  people: number;
  wonDeals: number;
  avgDeal: number;
  bySource: Record<string, SourceAgg>;
  byProduct: Record<string, ProductAgg>;
  quality: { High: number; Medium: number; Low: number };
  funnel: [string, number][];
  cvn: [string, number, number][];
}

export type AttrModel = 'first' | 'last' | 'linear' | 'u' | 'w';

export interface AttrRow {
  label: string;
  amount: number;
}
export interface AttrResult {
  desc: string;
  rows: AttrRow[];
  note: string;
}

export type DiagDim = 'source' | 'product' | 'owner';
export type ContentRole = 'revenue' | 'first' | 'lead' | 'opp';

export interface Segment {
  name: string;
  co: string;
  companies: number;
  activated: number;
  rev: number;
  xtenant?: boolean;
}

export interface SalesAlert {
  t: string;
  co: string;
  pri: 'High' | 'Medium' | 'Low';
  status: string;
  owner: string;
  created: string;
  expires: string;
  action: string;
  evidence: string[];
  xtenant?: boolean;
}

export interface Reco {
  co: string;
  rec: string;
  reason: string;
  conf: number;
  result: string;
  cls: string;
  xtenant?: boolean;
}

export interface Experiment {
  name: string;
  treatment: string;
  control: string;
  lift: string;
  confidence: string;
  decision: string;
  cls: string;
}

export interface SearchEntry {
  type: 'co' | 'pe';
  id?: string; // company id
  cid?: string; // company id for a person
  name: string;
  sub: string;
  ini: string;
}

export interface AiRule {
  k: string[];
  a: string | ((agg: Aggregates, tenant: TenantKey) => string);
  r: string | null;
}