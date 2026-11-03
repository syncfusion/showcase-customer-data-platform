/* Pure aggregation & derived-logic services. */
import { COMPANIES, NAME2ID, ORDER } from '../data/seed';
import type {
  Aggregates, AttrModel, AttrResult, Company, SearchEntry, TenantKey, TimelineEvent,
} from '../types';

export const STAGE_RANK: Record<string, number> = {
  'Known visitor': 1, Lead: 2, 'Qualified lead': 3, Opportunity: 4, Customer: 5,
};

export const money = (n: number): string =>
  (n < 0 ? '-$' : '$') + Math.abs(Math.round(n)).toLocaleString('en-US');

export const qCls = (q: string): string => (q === 'High' ? 'brand' : q === 'Medium' ? 'grey' : 'warn');

export function tenantIds(tenant: TenantKey): string[] {
  return ORDER.filter((id) => tenant === 'all' || COMPANIES[id].tenant === tenant);
}

export function coTenant(name: string): string | null {
  const c = COMPANIES[NAME2ID[name]];
  return c ? c.tenant : null;
}

export function inTenant(name: string, tenant: TenantKey): boolean {
  return tenant === 'all' || coTenant(name) === tenant;
}

/* ===== computeAgg port ===== */
export function computeAgg(tenant: TenantKey): Aggregates {
  const cs = tenantIds(tenant).map((id) => COMPANIES[id]);
  const won = cs.reduce((s, c) => s + c.won, 0);
  const pipeline = cs.reduce((s, c) => s + c.pipeline, 0);
  const customers = cs.filter((c) => c.statusLabel === 'Customer').length;
  const companies = cs.length;
  const people = cs.reduce((s, c) => s + c.people.length, 0);
  const wonDeals = cs.filter((c) => c.won > 0).length;
  const avgDeal = wonDeals ? won / wonDeals : 0;

  const bySource: Aggregates['bySource'] = {};
  cs.forEach((c) => {
    const s = (bySource[c.source] ??= { n: 0, won: 0, pipe: 0, high: 0, med: 0, low: 0, cust: 0 });
    s.n++; s.won += c.won; s.pipe += c.pipeline;
    s[c.quality === 'High' ? 'high' : c.quality === 'Medium' ? 'med' : 'low']++;
    if (c.statusLabel === 'Customer') s.cust++;
  });

  const byProduct: Aggregates['byProduct'] = {};
  cs.forEach((c) => {
    if (c.productRevenue) for (const p in c.productRevenue) {
      (byProduct[p] ??= { won: 0, owned: 0, interest: 0 }).won += c.productRevenue[p];
    }
  });
  cs.forEach((c) => {
    (c.productsOwned || '').split(',').map((s) => s.trim()).forEach((p) => {
      if (p && p !== '—' && p !== 'Community license') (byProduct[p] ??= { won: 0, owned: 0, interest: 0 }).owned++;
    });
  });
  cs.forEach((c) => {
    const p = (c.productInterest || '').replace(' (Commercial)', '');
    if (p && p !== '—') (byProduct[p] ??= { won: 0, owned: 0, interest: 0 }).interest++;
  });

  const quality = {
    High: cs.filter((c) => c.quality === 'High').length,
    Medium: cs.filter((c) => c.quality === 'Medium').length,
    Low: cs.filter((c) => c.quality === 'Low').length,
  };

  const funnel: [string, number][] = (
    [['Known companies', 1], ['Leads', 2], ['Qualified leads', 3], ['Opportunities', 4], ['Customers', 5]] as [string, number][]
  ).map(([label, rank]) => [label, cs.filter((c) => (STAGE_RANK[c.statusLabel] ?? 0) >= rank).length]);

  const eventsOf = (c: Company): string[] =>
    [...c.company, ...Object.values(c.persons).flat()].map((e) => (e[1] + ' ' + e[2]).toLowerCase());
  const did = (c: Company, re: RegExp): boolean => eventsOf(c).some((t) => re.test(t));
  const conv = cs.filter((c) => c.statusLabel === 'Customer');
  const non = cs.filter((c) => c.statusLabel !== 'Customer');
  const pct = (arr: Company[], re: RegExp): number =>
    arr.length ? Math.round((arr.filter((c) => did(c, re)).length / arr.length) * 100) : 0;
  const cvn: [string, number, number][] = [
    ['Viewed documentation', /document/],
    ['Viewed pricing', /pricing/],
    ['Downloaded trial', /trial|community license installed/],
    ['Spoke with Sales', /call|demo|discovery/],
  ].map(([label, re]) => [label as string, pct(conv, re as RegExp), pct(non, re as RegExp)]);

  return { won, pipeline, customers, companies, people, wonDeals, avgDeal, bySource, byProduct, quality, funnel, cvn };
}

export function tenantSummary(): Record<'Components' | 'AppSuite', { n: number; won: number }> {
  const s = { Components: { n: 0, won: 0 }, AppSuite: { n: 0, won: 0 } };
  ORDER.forEach((id) => {
    const c = COMPANIES[id];
    if (s[c.tenant]) { s[c.tenant].n++; s[c.tenant].won += c.won; }
  });
  return s;
}

/* ===== personIds port ===== */
export function personIds(c: Company, idx: number): { pid: string; vid: string; lead: string; snitcher: string; email: string } {
  const p = c.people[idx];
  return {
    pid: idx === 0 && c.personId ? c.personId : 'P' + c.id.slice(1) + (idx + 1),
    vid: idx === 0 ? c.visitorId : 'V' + c.id.slice(1) + (idx + 1),
    lead: idx === 0 ? c.leadId || '—' : '—',
    snitcher: 'SN-' + c.id.slice(1) + (idx + 1),
    email: c.email && idx === 0 ? c.email : p.n.toLowerCase() + '@' + c.domain,
  };
}

/* ===== attribution port (first/last/linear/u/w) ===== */
export function computeAttr(c: Company, model: AttrModel): AttrResult | null {
  const amount = c.won > 0 ? c.won : c.pipeline;
  if (!amount) return null;
  const kind = c.won > 0 ? 'won revenue' : 'open pipeline';
  const ev = c.company;
  const N = ev.length;
  const L = (i: number) => ev[i][1];
  const descs: Record<AttrModel, string> = {
    first: 'All credit to the first source that introduced the company.',
    last: 'All credit to the last meaningful touch before conversion.',
    linear: 'Credit divided equally across eligible touchpoints.',
    u: 'Most credit to the first and last touches; the middle shares the rest.',
    w: 'Most credit to first, a mid-journey milestone, and last; the others share the rest.',
  };
  const R = Math.round;
  let rows: [string, number][];
  if (model === 'first') rows = [[c.source + ' — first touch', amount]];
  else if (model === 'last') rows = [[L(N - 1) + ' — last touch', amount]];
  else if (model === 'linear') {
    const each = R(amount / N);
    rows = ev.map((e, i) => [e[1], i === N - 1 ? amount - each * (N - 1) : each] as [string, number]);
  } else if (model === 'u') {
    if (N < 3) {
      const h = R(amount / 2);
      rows = [[c.source + ' — first', h], [L(N - 1) + ' — last', amount - h]];
    } else {
      const ends = R(amount * 0.4), mid = amount - 2 * ends, each = R(mid / (N - 2));
      rows = [[c.source + ' — first', ends]];
      for (let i = 1; i < N - 1; i++) rows.push([L(i), each]);
      rows.push([L(N - 1) + ' — last', ends]);
    }
  } else {
    if (N < 3) {
      const h = R(amount / 2);
      rows = [[c.source + ' — first', h], [L(N - 1) + ' — last', amount - h]];
    } else {
      const m = Math.floor(N / 2), t = R(amount * 0.3), rest = amount - 3 * t, others = N - 3, each = others > 0 ? R(rest / others) : 0;
      rows = [];
      for (let i = 0; i < N; i++) {
        if (i === 0) rows.push([c.source + ' — first', t]);
        else if (i === N - 1) rows.push([L(i) + ' — last', t]);
        else if (i === m) rows.push([L(i) + ' — milestone', t]);
        else rows.push([L(i), each]);
      }
    }
  }
  return { desc: descs[model], rows: rows.map(([label, v]) => ({ label, amount: v })), note: `Based on <b>${money(amount)}</b> ${kind} · ${N} eligible touchpoints` };
}

/* ===== global search index ===== */
export function buildSearchIndex(): SearchEntry[] {
  const SEARCH: SearchEntry[] = [];
  ORDER.forEach((id) => {
    const c = COMPANIES[id];
    SEARCH.push({ type: 'co', id, name: c.name, sub: c.tenant + ' · ' + c.type + ' · ' + c.source, ini: c.ini });
    c.people.forEach((p) => SEARCH.push({ type: 'pe', cid: id, name: p.n, sub: p.role + ' · ' + c.name, ini: p.n.slice(0, 2).toUpperCase() }));
  });
  return SEARCH;
}

/* ===== AI reply engine (keyword scoring) ===== */
import type { AiRule, Aggregates as Agg } from '../types';
import { money as fmt } from './aggregate';

export const AI_RULES: AiRule[] = [
  {
    k: ['source', 'revenue', 'best', 'most'],
    a: (agg: Agg, tenant: TenantKey) => {
      const rows = Object.entries(agg.bySource).sort((x, y) => y[1].won - x[1].won).filter((r) => r[1].won > 0);
      const top = rows[0];
      return top
        ? `In the current view (<b>${tenant === 'all' ? 'Combined' : tenant}</b>), the top source by won revenue is <b>${top[0]}</b> (${fmt(top[1].won)}).`
        : `No won revenue in the current view yet — open pipeline totals ${fmt(agg.pipeline)}.`;
    },
    r: 'Summed from the accounts in the current tenant view — see Revenue & pipeline by source.',
  },
  {
    k: ['attribution', 'abc', 'credit', 'model'],
    a: `For ABC Technologies' win, credit shifts by model: <b>First</b> → Google Organic; <b>Last</b> → the discovery call; <b>Linear</b> → even split; <b>W-shaped</b> → first, a milestone, and last weighted highest.`,
    r: 'Open Revenue attribution → pick any company to recompute from its own touchpoints.',
  },
  {
    k: ['contact', 'next', 'sales', 'who', 'cross'],
    a: `Highest priority right now: <b>ABC Technologies</b> (Sign cross-tenant), <b>XYZ Ltd</b> (community→commercial upgrade), <b>Northwind</b> (Insights in-suite), and <b>Initech</b> (POC follow-up).`,
    r: 'From open sales alerts and segments; each has an owner assigned.',
  },
  {
    k: ['drop', 'funnel', 'stage', 'stuck'],
    a: (agg: Agg) => {
      const f = agg.funnel;
      return `In this view: ${f[0][1]} known, ${f[2][1]} qualified, ${f[3][1]} reached opportunity, ${f[4][1]} became customers.`;
    },
    r: `Computed from each account's furthest stage — see the Funnel screen.`,
  },
  {
    k: ['tenant', 'components', 'appsuite', 'difference'],
    a: `Components accounts run a <b>license model</b> (Community vs Commercial, renewals) mostly PLG or self-serve; AppSuite accounts are <b>SaaS per-seat (ARR)</b>. Use the tenant switch (top bar) to scope every dashboard, or Combined to see cross-sell across both.`,
    r: 'Tenant is a first-class field on every account — the boundary that makes this productizable later.',
  },
  {
    k: ['quality', 'why'],
    a: `ABC Technologies is <b>High</b> quality: strong product fit, multiple engaged employees, completed trial, fast sales response, and a quickly-progressing opportunity.`,
    r: 'Transparent rule-based score. See Customer quality.',
  },
];

export function aiReply(q: string, agg: Agg, tenant: TenantKey): { answer: string; reason: string | null } {
  const t = q.toLowerCase();
  let best: AiRule | null = null;
  let score = 0;
  AI_RULES.forEach((rule) => {
    const s = rule.k.filter((k) => t.includes(k)).length;
    if (s > score) { score = s; best = rule; }
  });
  if (!best || score === 0) {
    return {
      answer: 'I can answer from unified profiles, journeys, revenue, attribution, and activation — scoped to the current tenant view. Try a suggestion above.',
      reason: null,
    };
  }
  const rule = best as AiRule;
  return { answer: typeof rule.a === 'function' ? rule.a(agg, tenant) : rule.a, reason: rule.r };
}

/* Timeline typing helper */
export type { TimelineEvent };
export { COMPANIES, NAME2ID, ORDER };
export const eventsOfPerson = (c: Company, name: string): TimelineEvent[] => c.persons[name] || [];