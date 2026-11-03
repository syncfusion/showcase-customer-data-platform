import { useMemo, useState } from 'react';
import { useApp } from '../../store/app';
import { companyOptions } from '../../components/layout/meta';
import { SfSelect } from '../../components/syncfusion/SfControls';
import { SfSeg } from '../../components/syncfusion/SfSeg';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Card, CardBody, Kpi, Note } from '../../components/shared/primitives';
import { money, computeAttr } from '../../services/aggregate';
import { COMPANIES, campaigns } from '../../data/seed';
import type { AttrModel } from '../../types';

const ATTR_DESCS: Record<AttrModel, string> = {
  first: 'All credit to the first source that introduced the company.',
  last: 'All credit to the last meaningful touch before conversion.',
  linear: 'Credit divided equally across eligible touchpoints.',
  u: 'Most credit to the first and last touches; the middle shares the rest.',
  w: 'Most credit to first, a mid-journey milestone, and last; the others share the rest.',
};

/* Revenue attribution — all tables are Syncfusion Grids (item 14), model
 * toggle is the e-btn-group (item 15). */
export default function AttributionView() {
  const { agg } = useApp();
  const [model, setModel] = useState<AttrModel>('first');
  const [attrCo, setAttrCo] = useState('C001');
  const c = COMPANIES[attrCo];
  const r = computeAttr(c, model);
  const opts = companyOptions();

  const bySourceColumns: SfGridColumn[] = [
    { field: 'source', headerText: 'Source' },
    { field: 'n', headerText: 'Accounts', textAlign: 'Right' },
    { field: 'won', headerText: 'Won revenue', textAlign: 'Right', template: (d) => <span className="mono">{money(d.won as number)}</span> },
    { field: 'pipe', headerText: 'Open pipeline', textAlign: 'Right', template: (d) => <span className="mono">{money(d.pipe as number)}</span> },
    { field: 'quality', headerText: 'Quality mix', template: (d) => <span className="subtle" style={{ fontSize: 12 }}>{d.quality as string}</span> },
  ];
  const bySourceRows = useMemo(
    () => Object.entries(agg.bySource)
      .sort((a, b) => (b[1].won + b[1].pipe) - (a[1].won + a[1].pipe))
      .map(([source, s]) => ({
        source, n: s.n, won: s.won, pipe: s.pipe,
        quality: `${s.high} high · ${s.med} med · ${s.low} low`,
      })),
    [agg],
  );

  const byProductColumns: SfGridColumn[] = [
    { field: 'product', headerText: 'Product' },
    { field: 'won', headerText: 'Won revenue', textAlign: 'Right', template: (d) => <span className="mono">{money(d.won as number)}</span> },
    { field: 'owned', headerText: 'Accounts owning', textAlign: 'Right' },
    { field: 'interest', headerText: 'Interest signals', textAlign: 'Right' },
  ];
  const byProductRows = useMemo(
    () => Object.entries(agg.byProduct)
      .sort((a, b) => b[1].won - a[1].won)
      .map(([product, p]) => ({ product, won: p.won, owned: p.owned, interest: p.interest })),
    [agg],
  );

  const campaignColumns: SfGridColumn[] = [
    { field: 'name', headerText: 'Campaign' },
    { field: 'cost', headerText: 'Cost', textAlign: 'Right', template: (d) => <span className="mono">{money(d.cost as number)}</span> },
    { field: 'leads', headerText: 'Leads', textAlign: 'Right' },
    { field: 'customers', headerText: 'Customers', textAlign: 'Right' },
    { field: 'cac', headerText: 'CAC', textAlign: 'Right', template: (d) => <span className="mono">{money(d.cac as number)}</span> },
    { field: 'roas', headerText: 'ROAS', textAlign: 'Right', template: (d) => <span className="mono">{d.roas as number}x</span> },
  ];
  const campaignRows = campaigns.map((x) => ({
    name: x.name, cost: x.cost, leads: x.leads, customers: x.customers,
    cac: x.customers ? Math.round(x.cost / x.customers) : 0,
    roas: x.cost ? +(x.revenue / x.cost).toFixed(1) : 0,
  }));

  const maxDriver = r ? Math.max(...r.rows.map((x) => x.amount)) : 0;

  return (
    <div className="view">
      <div className="grid g-4" style={{ marginBottom: 16 }}>
        <Kpi lab="Won revenue" val={money(agg.won)} valClass="mono" delta={`${agg.wonDeals} deals`} deltaClass="up" />
        <Kpi lab="Open pipeline" val={money(agg.pipeline)} valClass="mono" delta="active opps" />
        <Kpi lab="Customers" val={agg.customers} delta={`of ${agg.companies}`} />
        <Kpi lab="Avg won deal" val={money(agg.avgDeal)} valClass="mono" delta="per closed deal" />
      </div>

      <div className="two-col">
        <Card header="Revenue & pipeline by source" sub="Summed across accounts in the current tenant view">
          <SfGrid dataSource={bySourceRows as unknown as Record<string, unknown>[]} columns={bySourceColumns} />
        </Card>

        <div>
          <Card header="Attribution model" sub="How credit for a won deal is divided across touches">
            <CardBody>
              <div className="filters" style={{ marginBottom: 12 }}>
                <span className="fl">Model</span>
                <SfSeg
                  value={model}
                  onChange={setModel}
                  ariaLabel="Attribution model"
                  options={[
                    { key: 'first', label: 'First' },
                    { key: 'last', label: 'Last' },
                    { key: 'linear', label: 'Linear' },
                    { key: 'u', label: 'U-shaped' },
                    { key: 'w', label: 'W-shaped' },
                  ]}
                />
                <span className="fl" style={{ marginLeft: 8 }}>Company</span>
                <SfSelect value={c.name} options={opts.map((o) => o.text)} width={170}
                  onChange={(name) => { const f = opts.find((o) => o.text === name); if (f) setAttrCo(f.value); }} />
              </div>
              <p className="subtle" style={{ fontSize: 12.5, margin: '0 0 12px' }}>{ATTR_DESCS[model]} — {c.name}</p>
              {r && (
                <>
                  {r.rows.map((row) => (
                    <div className="driver" key={row.label}>
                      <div className="dn">{row.label}</div>
                      <div className="dtrack">
                        <div className="dbar" style={{ width: `${Math.max((row.amount / maxDriver) * 100, 3)}%`, background: 'var(--brand)' }} />
                      </div>
                      <div className="dv mono">{money(row.amount)}</div>
                    </div>
                  ))}
                  <p className="subtle mono" style={{ fontSize: 12, marginTop: 10, marginBottom: 0 }}>Total: {money(r.rows.reduce((s, x) => s + x.amount, 0))}</p>
                </>
              )}
            </CardBody>
          </Card>
          <Note>Drill any driver into companies, campaigns, products, pages, sales owners, or journey patterns. Use <b>contribution</b>, not <b>caused</b> — only controlled experiments prove causation.</Note>
        </div>
      </div>

      <div className="grid g-2 mt">
        <Card header="Revenue by product" sub="Won revenue associated with each product (license + expansion)">
          <SfGrid dataSource={byProductRows as unknown as Record<string, unknown>[]} columns={byProductColumns} />
        </Card>
        <Card header="Campaigns" sub="Paid acquisition — cost per acquired customer and return">
          <SfGrid dataSource={campaignRows as unknown as Record<string, unknown>[]} columns={campaignColumns} />
        </Card>
      </div>
    </div>
  );
}