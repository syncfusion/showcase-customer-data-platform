import { useApp } from '../../store/app';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Card, Kpi, SectionTitle } from '../../components/shared/primitives';
import { dqData } from '../../data/seed';

/* Data quality view — Grid with cell templates: severity badge column and a
 * Review action button per row. */
const SEVERITY_LABEL: Record<string, string> = { neg: 'High', warn: 'Medium', grey: 'Low' };

export default function DqView() {
  const { tenant } = useApp();
  void tenant;

  const columns: SfGridColumn[] = [
    { field: 'issue', headerText: 'Issue' },
    { field: 'affects', headerText: 'What it affects', template: (d) => <span className="subtle">{d.affects as string}</span> },
    { field: 'count', headerText: 'Count', textAlign: 'Right', template: (d) => <span className="mono">{d.count as number}</span> },
    { field: 'severity', headerText: 'Severity', template: (d) => (
      <Badge tone={d.severity as string}>{SEVERITY_LABEL[d.severity as string] ?? 'Low'}</Badge>
    ) },
    { field: 'review', headerText: '', textAlign: 'Right', template: () => (
      <button className="btn sm cdp-review">Review</button>
    ) },
  ];

  return (
    <div className="view">
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <SectionTitle style={{ margin: 0 }}>Database health</SectionTitle>
        <span className="illus">Illustrative — spans the full database, beyond the demo accounts</span>
      </div>
      <div className="grid g-3" style={{ marginBottom: 16 }}>
        <Kpi lab="Records healthy" val="91%" delta="▲ 1.4 pts" deltaClass="up" />
        <Kpi lab="Open issues" val="1,431" delta="across 6 categories" />
        <Kpi lab="Avg match confidence" val="88%" delta="▲ 2.0 pts" deltaClass="up" />
      </div>
      <Card header="Issue categories" sub="Each issue weakens identity, journey, or attribution accuracy">
        <SfGrid dataSource={dqData as unknown as Record<string, unknown>[]} columns={columns} />
      </Card>
    </div>
  );
}