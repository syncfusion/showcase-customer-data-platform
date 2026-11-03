import { useApp } from '../../store/app';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Card, CardBody } from '../../components/shared/primitives';

/* Module-level ListView template — stage name left, mono duration right. */
function durationTemplate(context: { text: string; badge: string }): React.ReactNode {
  return (
    <div className="cdp-lv-row">
      <span className="cdp-lv-text">{context.text}</span>
      <span className="cdp-lv-val mono">{context.badge}</span>
    </div>
  );
}

/* Funnel — custom CSS bars;
 * stage durations via Syncfusion ListView, converted-vs-non-converted table via Grid. */
export default function FunnelView() {
  const { agg } = useApp();
  const f = agg.funnel;
  const top = f[0][1] || 1;

  const durations = [
    { id: 'kl', text: 'Known → Lead', badge: '5.1 days' },
    { id: 'lq', text: 'Lead → Qualified', badge: '3.8 days' },
    { id: 'qo', text: 'Qualified → Opportunity', badge: '6.4 days' },
    { id: 'oc', text: 'Opportunity → Customer', badge: '12.0 days' },
  ];

  const cvnColumns: SfGridColumn[] = [
    { field: 'label', headerText: 'Journey behaviour' },
    { field: 'custPct', headerText: 'Customers', textAlign: 'Right', template: (d) => <span className="mono">{d.custPct as number}%</span> },
    { field: 'nonPct', headerText: 'Non-customers', textAlign: 'Right', template: (d) => <span className="mono subtle">{d.nonPct as number}%</span> },
    { field: 'gap', headerText: 'Gap', template: (d) => {
      const w = Math.min(Math.abs((d.custPct as number) - (d.nonPct as number)), 100);
      return (
        <div className="conf-row">
          <div className="bar"><span style={{ width: `${w}%`, background: 'var(--brand)' }} /></div>
          <span className="pct">{(d.custPct as number) - (d.nonPct as number)} pts</span>
        </div>
      );
    } },
  ];
  const cvnRows = agg.cvn.map((r) => ({ label: r[0], custPct: r[1], nonPct: r[2], gap: '' }));

  return (
    <div className="view">
      <div className="two-col">
        <Card header="Conversion funnel" sub="Computed from the demo accounts in the current tenant view">
          <CardBody>
            <div className="funnel">
              {f.map((r, i) => {
                const prev = i ? f[i - 1][1] : null;
                const conv = prev ? `${Math.round((r[1] / (prev || 1)) * 100)}% of prev` : '';
                return (
                  <div className="fr" key={i}>
                    <div className="flabel">{r[0]}</div>
                    <div className="ftrack">
                      <div className="ffill" style={{ width: `${Math.max((r[1] / top) * 100, 10)}%` }}>{r[1]}</div>
                    </div>
                    <div className="fconv">{conv}</div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
        <Card header="Stage duration" right={<span className="illus">Illustrative</span>}>
          <CardBody>
            <ListViewComponent
              dataSource={durations}
              fields={{ text: 'text' }}
              template={durationTemplate as never}
              cssClass="cdp-listview cdp-listview-rows"
              showHeader={false}
            />
          </CardBody>
        </Card>
      </div>

      <Card
        style={{ marginTop: 16 }}
        header="Converted vs non-converted behaviour"
        sub="Computed from each account's activities — pattern, not causation"
      >
        <SfGrid dataSource={cvnRows as unknown as Record<string, unknown>[]} columns={cvnColumns} />
        <CardBody style={{ paddingTop: 0 }}><p className="subtle" style={{ fontSize: 12, margin: 0 }}>Small demo set, so treat as directional.</p></CardBody>
      </Card>
    </div>
  );
}