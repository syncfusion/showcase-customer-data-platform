import { useMemo, useState } from 'react';
import { useApp } from '../../store/app';
import { useOpenCompany, useOpenPerson } from '../../components/layout/meta';
import { SfSelect } from '../../components/syncfusion/SfControls';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Chip, Kpi } from '../../components/shared/primitives';
import { money, tenantIds, tenantSummary } from '../../services/aggregate';
import { COMPANIES } from '../../data/seed';
import { TENANT_LABELS } from '../../types';

const PRODUCTS = ['All products', 'DataGrid', 'PDF Viewer', 'Diagram', 'Sign', 'Insights', 'Desk'];
const SOURCES = ['All sources', 'Google Organic', 'Direct', 'LinkedIn Enterprise', 'Partner referral', 'Paid social', 'Trial'];
const STAGES = ['All stages', 'Known visitor', 'Lead', 'Trial user', 'Qualified lead', 'Opportunity', 'Customer'];

/* Customers view: filters (SfSelect), KPIs, tenant split chips, people table (Grid). */
export default function CustomersView() {
  const { tenant, agg } = useApp();
  const [product, setProduct] = useState('All products');
  const [source, setSource] = useState('All sources');
  const [stage, setStage] = useState('All stages');
  const openCo = useOpenCompany();
  const openPerson = useOpenPerson();

  const ids = useMemo(() => tenantIds(tenant), [tenant]);
  const all = useMemo(
    () => ids.flatMap((id) => COMPANIES[id].people.map((p) => ({ ...p, cid: id, co: COMPANIES[id] }))),
    [ids],
  );
  const rows = useMemo(
    () => all.filter((r) =>
      (product === 'All products' || r.product.indexOf(product) >= 0) &&
      (source === 'All sources' || r.src === source) &&
      (stage === 'All stages' || r.status === stage)),
    [all, product, source, stage],
  );

  const conf = Math.round(ids.reduce((a, id) => a + COMPANIES[id].confidence, 0) / (ids.length || 1));
  const ts = tenantSummary();

  const columns: SfGridColumn[] = [
    { field: 'n', headerText: 'Person', template: (d) => <span>{d.n as string}</span> },
    { field: 'co', headerText: 'Company', template: (d) => {
      const r = d as unknown as { cid: string; co: typeof COMPANIES[string] };
      return <span className="link-co" onClick={(e) => { e.stopPropagation(); openCo(r.cid); }}>{r.co.name}</span>;
    } },
    { field: 'tenant', headerText: 'Tenant', template: (d) => {
      const r = d as unknown as { co: typeof COMPANIES[string] };
      return <Badge tone={r.co.tenant === 'AppSuite' ? 'info' : 'brand'}>{r.co.tenant}</Badge>;
    } },
    { field: 'src', headerText: 'Original source' },
    { field: 'product', headerText: 'Product interest' },
    { field: 'status', headerText: 'Status', template: (d) => <Badge tone={d.cls as string}>{d.status as string}</Badge> },
    { field: 'conf', headerText: 'Conf.', textAlign: 'Right', template: (d) => (
      <div className="conf-row">
        <div className="bar" style={{ width: 60 }}><span style={{ width: `${d.conf as number}%` }} /></div>
        <span className="pct">{d.conf as number}%</span>
      </div>
    ) },
  ];

  return (
    <div className="view">
      <div className="filters">
        <span className="fl">Filter</span>
        <SfSelect value={product} options={PRODUCTS} onChange={setProduct} />
        <SfSelect value={source} options={SOURCES} onChange={setSource} />
        <SfSelect value={stage} options={STAGES} onChange={setStage} />
        <button className="clear" onClick={() => { setProduct('All products'); setSource('All sources'); setStage('All stages'); }}>Clear</button>
        <span className="res-count">{`${rows.length} of ${all.length} people`}</span>
      </div>
      <div className="grid g-4" style={{ marginBottom: 12 }}>
        <Kpi lab="Companies" val={agg.companies} delta={`${agg.people} people`} />
        <Kpi lab="Customers" val={agg.customers} delta={`won ${money(agg.won)}`} deltaClass="up" />
        <Kpi lab="Open pipeline" val={money(agg.pipeline)} valClass="mono" delta="across active opps" />
        <Kpi lab="Avg confidence" val={`${conf}%`} delta="identity match" />
      </div>
      <div className="flex wrap" style={{ marginBottom: 16 }}>
        <Chip><Badge tone="brand">Components</Badge> {`${ts.Components.n} accounts · ${money(ts.Components.won)} won`}</Chip>
        <Chip><Badge tone="info">AppSuite</Badge> {`${ts.AppSuite.n} accounts · ${money(ts.AppSuite.won)} won`}</Chip>
        <span className="subtle" style={{ fontSize: 12 }}>Viewing: <b>{TENANT_LABELS[tenant]}</b></span>
      </div>
      <div className="card">
        <div className="card-h">
          <h3>People &amp; companies</h3>
          <span className="right">Click a person for their profile · click a company name for the account</span>
        </div>
        {rows.length ? (
          <SfGrid dataSource={rows as unknown as Record<string, unknown>[]} columns={columns} onRowClick={(d) => openPerson(d.cid as string, d.n as string)} />
        ) : (
          <table><tbody><tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 26 }}>
            No people match these filters. <span className="link-co" onClick={() => { setProduct('All products'); setSource('All sources'); setStage('All stages'); }}>Clear filters</span>
          </td></tr></tbody></table>
        )}
      </div>
    </div>
  );
}