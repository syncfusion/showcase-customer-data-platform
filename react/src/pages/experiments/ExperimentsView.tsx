import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Card, CardBody } from '../../components/shared/primitives';
import { money } from '../../services/aggregate';
import { experiments } from '../../data/seed';

/* Experiments — Grid tables + cross-sell email detail and the green incremental-result callout. */
export default function ExperimentsView() {
  const columns: SfGridColumn[] = [
    { field: 'name', headerText: 'Experiment' },
    { field: 'treatment', headerText: 'Treatment', textAlign: 'Right', template: (d) => <span className="mono">{d.treatment as string}</span> },
    { field: 'control', headerText: 'Control', textAlign: 'Right', template: (d) => <span className="mono subtle">{d.control as string}</span> },
    { field: 'lift', headerText: 'Lift', textAlign: 'Right', template: (d) => (
      <span style={{ color: d.cls === 'pos' ? 'var(--pos)' : 'var(--muted)', fontWeight: 600 }}>{d.lift as string}</span>
    ) },
    { field: 'confidence', headerText: 'Confidence', template: (d) => <span className="mono subtle" style={{ fontSize: 12 }}>{d.confidence as string}</span> },
    { field: 'decision', headerText: 'Decision', template: (d) => <Badge tone={d.cls as string}>{d.decision as string}</Badge> },
  ];
  const rows = experiments.map((r) => ({ ...r }));

  /* Dimensions: Opportunities / Purchases / Revenue. */
  const treatmentRows = [
    { metric: 'Opportunities', value: '20' },
    { metric: 'Purchases', value: '12' },
    { metric: 'Revenue', value: money(240000) },
  ];
  const controlRows = [
    { metric: 'Opportunities', value: '12' },
    { metric: 'Purchases', value: '7' },
    { metric: 'Revenue', value: money(140000) },
  ];
  const metricColumns: SfGridColumn[] = [
    { field: 'metric', headerText: 'Metric' },
    { field: 'value', headerText: 'Value', textAlign: 'Right', template: (d) => <span className="mono">{d.value as string}</span> },
  ];

  return (
    <div className="view">
      <Card header="Experiments" sub="Treatment vs control — does the action actually lift the outcome?">
        <SfGrid dataSource={rows as unknown as Record<string, unknown>[]} columns={columns} />
      </Card>

      <Card style={{ marginTop: 16 }} header="Cross-sell email — detail">
        <CardBody>
          <div className="grid g-2">
            <div>
              <h4 className="blk">Treatment · 100 accounts (campaign)</h4>
              <SfGrid dataSource={treatmentRows as unknown as Record<string, unknown>[]} columns={metricColumns} />
            </div>
            <div>
              <h4 className="blk">Control · 100 accounts (no campaign)</h4>
              <SfGrid dataSource={controlRows as unknown as Record<string, unknown>[]} columns={metricColumns} />
            </div>
          </div>
          <div className="note" style={{ borderStyle: 'solid', borderColor: '#c9ecdb', background: 'var(--pos-weak)' }}>
            <span>✓</span>
            <span>Estimated incremental result: <b>+5 purchases</b>, <b>+$100,000 revenue</b>. Without the control group the platform could show correlation but not lift.</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}