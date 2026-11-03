import { useApp } from '../../store/app';
import { useOpenCompany } from '../../components/layout/meta';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Card, Note, SectionTitle } from '../../components/shared/primitives';
import { inTenant } from '../../services/aggregate';
import { recos } from '../../data/seed';

/* Recommendations — next-best-actions table via Syncfusion Grid
 * (confidence as a Grid column template,). */
export default function RecosView() {
  const { tenant } = useApp();
  const openCo = useOpenCompany();
  const vis = recos.filter((r) => (r.xtenant ? tenant === 'all' : inTenant(r.co, tenant)));

  const columns: SfGridColumn[] = [
    { field: 'co', headerText: 'Company', template: (d) => (
      <span>
        <span className="link-co" onClick={(e) => { e.stopPropagation(); openCo(d.co as string); }}>{d.co as string}</span>
        {d.xtenant as boolean ? <> <Badge tone="info">cross-tenant</Badge></> : null}
      </span>
    ) },
    { field: 'rec', headerText: 'Recommendation' },
    { field: 'reason', headerText: 'Reason', template: (d) => <span className="subtle" style={{ fontSize: '12.5px' }}>{d.reason as string}</span> },
    { field: 'conf', headerText: 'Confidence', template: (d) => (
      <div className="conf-row">
        <div className="bar"><span style={{ width: `${d.conf as number}%` }} /></div>
        <span className="pct">{d.conf as number}%</span>
      </div>
    ) },
    { field: 'result', headerText: 'Result', template: (d) => <Badge tone={d.cls as string}>{d.result as string}</Badge> },
  ];
  const rows = vis.map((r) => ({ ...r }));

  return (
    <div className="view">
      <div className="filters" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <SectionTitle style={{ margin: 0 }}>Next-best actions</SectionTitle>
        <span className="badge b-grey">Rule-based, with reasons — predictive scores added as data matures</span>
      </div>
      <Card>
        <SfGrid dataSource={rows as unknown as Record<string, unknown>[]} columns={columns} />
      </Card>
      <Note>Confidence is a rule score, not a prediction — every recommendation shows its reason.</Note>
    </div>
  );
}