import { useApp } from '../../store/app';
import { useOpenCompany } from '../../components/layout/meta';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Badge, Card, CardBody, KeyValTable } from '../../components/shared/primitives';
import { money, inTenant } from '../../services/aggregate';
import { segments } from '../../data/seed';

/* Segments & audiences — audiences table via Syncfusion Grid
 * . */
export default function SegmentsView() {
  const { tenant } = useApp();
  const openCo = useOpenCompany();
  const vis = segments.filter((s) => (s.xtenant ? tenant === 'all' : inTenant(s.co, tenant)));

  const columns: SfGridColumn[] = [
    { field: 'name', headerText: 'Segment', template: (d) => (
      <span>{d.name as string}{d.xtenant as boolean ? <> <Badge tone="info">cross-tenant</Badge></> : null}</span>
    ) },
    { field: 'co', headerText: 'Demo member', template: (d) => (
      <span className="link-co" onClick={(e) => { e.stopPropagation(); openCo(d.co as string); }}>{d.co as string}</span>
    ) },
    { field: 'companies', headerText: 'Companies', textAlign: 'Right' },
    { field: 'activated', headerText: 'Activated', textAlign: 'Right' },
    { field: 'rev', headerText: 'Revenue', textAlign: 'Right', template: (d) => <span className="mono">{money(d.rev as number)}</span> },
  ];
  const rows = vis.map((s) => ({ ...s }));

  return (
    <div className="view">
      <div className="two-col">
        <Card header="Audiences" right="Demo members shown; counts illustrative">
          <SfGrid dataSource={rows as unknown as Record<string, unknown>[]} columns={columns} />
        </Card>
        <Card header="Components → AppSuite cross-sell" sub="The marquee cross-tenant play">
          <CardBody>
            <h4 className="blk">Include when</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="chip" style={{ justifyContent: 'flex-start' }}><Badge tone="pos">AND</Badge> Active Components commercial customer</div>
              <div className="chip" style={{ justifyContent: 'flex-start' }}><Badge tone="pos">AND</Badge> Viewed an AppSuite product recently (e.g. Sign)</div>
              <div className="chip" style={{ justifyContent: 'flex-start' }}><Badge tone="pos">AND</Badge> Healthy account (High quality)</div>
            </div>
            <h4 className="blk" style={{ marginTop: 14 }}>Exclude when</h4>
            <div className="chip" style={{ justifyContent: 'flex-start', width: '100%' }}><Badge tone="neg">NOT</Badge> Already an AppSuite customer</div>
            <KeyValTable firstWidth="48%" rows={[
              ['Owner', 'AppSuite Account Exec'],
              ['Destination', 'Sales alerts · Email'],
              ['Boundary', 'Cross-tenant — visible in Combined view'],
              ['Activation status', <Badge tone="pos">Active</Badge>],
            ]} />
            <p className="subtle" style={{ fontSize: 12, marginTop: 10 }}>
              <span className="link-co" onClick={() => openCo('C001')}>ABC Technologies</span> is a Components commercial customer now evaluating Sign.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}