import { useState } from 'react';
import { useApp } from '../../store/app';
import { useOpenCompany } from '../../components/layout/meta';
import { SfButton } from '../../components/syncfusion/SfControls';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Kpi, Card, CardBody, KeyValTable } from '../../components/shared/primitives';
import { inTenant } from '../../services/aggregate';

const alertClosed = (a: { status: string }) => /^(Accepted|Dismissed|Completed|Snoozed)/.test(a.status);

/* Sales alerts — queue via Syncfusion Grid with selectable rows
 * detail pane + status workflow. */
export default function AlertsView() {
  const { tenant, alertList, setAlertStatus } = useApp();
  const openCo = useOpenCompany();
  const [selected, setSelected] = useState<number>(0);

  const vis = alertList
    .map((a, i) => ({ a, i }))
    .filter((x) => (x.a.xtenant ? tenant === 'all' : inTenant(x.a.co, tenant)));
  const sel = vis.some((x) => x.i === selected) ? selected : vis.length ? vis[0].i : -1;
  const a = sel >= 0 ? alertList[sel] : null;
  const closed = a ? alertClosed(a) : false;

  const columns: SfGridColumn[] = [
    { field: 't', headerText: 'Alert', template: (d) => (
      <span>{d.t as string}{d.xtenant as boolean ? <> <Badge tone="info">cross-tenant</Badge></> : null}</span>
    ) },
    { field: 'co', headerText: 'Company', template: (d) => (
      <span className="link-co" onClick={(e) => { e.stopPropagation(); openCo(d.co as string); }}>{d.co as string}</span>
    ) },
    { field: 'pri', headerText: 'Priority', template: (d) => (
      <Badge tone={d.pri === 'High' ? 'neg' : d.pri === 'Medium' ? 'warn' : 'grey'}>{d.pri as string}</Badge>
    ) },
    { field: 'status', headerText: 'Status', template: (d) => (
      <span className="subtle" style={{ fontSize: 12 }}>{d.status as string}</span>
    ) },
    { field: 'done', headerText: '', textAlign: 'Right', template: (d) => (
      <span className="subtle">{alertClosed(d as unknown as { status: string }) ? '✓' : '›'}</span>
    ) },
  ];
  const rows = vis.map(({ a: al, i }) => ({ ...al, id: i }));

  return (
    <div className="view">
      <div className="grid g-4" style={{ marginBottom: 16 }}>
        <Kpi lab="Alerts generated" val="128" delta="last 30 days" />
        <Kpi lab="Accepted" val="82%" delta="▲ 5 pts" deltaClass="up" />
        <Kpi lab="Avg response time" val="1.9d" delta="faster" deltaClass="up" />
        <Kpi lab="False-positive rate" val="7%" delta="target <10%" deltaClass="down" />
      </div>
      <div className="two-col">
        <Card header="Alert queue" right="Click an alert · company names link to profiles">
          <SfGrid
            dataSource={rows as unknown as Record<string, unknown>[]}
            columns={columns}
            cssClass={sel >= 0 ? 'cdp-alerts-grid' : undefined}
            onRowClick={(d) => setSelected(d.id as number)}
          />
        </Card>
        <Card>
          {!a ? (
            <CardBody><span className="subtle">No alert selected.</span></CardBody>
          ) : (
            <>
              <div className="card-h">
                <h3>{a.t}</h3>
                <span className="right">Priority: {a.pri}</span>
              </div>
              <CardBody>
                <div style={{ fontWeight: 640 }}>
                  <span className="link-co" onClick={() => openCo(a.co)}>{a.co}</span>
                  {a.xtenant ? <> <Badge tone="info">cross-tenant</Badge></> : null}
                </div>
                <p className="subtle" style={{ fontSize: '12.5px', margin: '2px 0 12px' }}>Status: {a.status}</p>
                <h4 className="blk">Evidence</h4>
                <ul style={{ margin: '0 0 12px', paddingLeft: 18, fontSize: 13, color: 'var(--ink-2)' }}>
                  {a.evidence.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
                <h4 className="blk">Recommended action</h4>
                <p style={{ fontSize: 13, margin: '0 0 12px' }}>{a.action}</p>
                <KeyValTable firstWidth="42%" rows={[
                  ['Owner', a.owner],
                  ['Created', <span className="mono">{a.created}</span>],
                  ['Expires', <span className="mono">{a.expires}</span>],
                ]} />
                <div className="flex mt">
                  {closed ? (
                    <>
                      <Badge tone="pos">{a.status.split(' — ')[0]}</Badge>
                      <SfButton small onClick={() => setAlertStatus(sel, 'Open — pending')}>Reopen</SfButton>
                    </>
                  ) : (
                    <>
                      <SfButton primary small onClick={() => setAlertStatus(sel, 'Accepted — action taken')}>Accept</SfButton>
                      <SfButton small onClick={() => setAlertStatus(sel, 'Snoozed — 7 days')}>Snooze</SfButton>
                      <SfButton small onClick={() => setAlertStatus(sel, 'Dismissed — by owner')}>Dismiss</SfButton>
                    </>
                  )}
                </div>
              </CardBody>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}