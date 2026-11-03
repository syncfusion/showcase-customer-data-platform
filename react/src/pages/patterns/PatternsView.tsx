import { useMemo } from 'react';
import { ListViewComponent } from '@syncfusion/ej2-react-lists';
import { useApp } from '../../store/app';
import { useOpenCompany } from '../../components/layout/meta';
import { Kpi, Card, CardBody } from '../../components/shared/primitives';
import { tenantIds } from '../../services/aggregate';
import { COMPANIES } from '../../data/seed';

/* Journey patterns — converting / non-converting paths render through
 * the Syncfusion ListView (each path = one list entry: company + source/motion/
 * duration). */
export default function PatternsView() {
  const { tenant } = useApp();
  const openCo = useOpenCompany();
  const cs = useMemo(() => tenantIds(tenant).map((id) => COMPANIES[id]), [tenant]);

  const won = cs.filter((c) => c.statusLabel === 'Customer' || c.statusLabel === 'Opportunity');
  const lost = cs.filter((c) => c.statusLabel === 'Known visitor' || c.statusLabel === 'Lead');

  const durs = cs.map((c) => ({ n: c.name, d: parseInt(c.journeyLength) })).filter((x) => !isNaN(x.d));
  const mn = durs.length ? durs.reduce((a, b) => (b.d < a.d ? b : a)) : { n: '—', d: 0 };
  const mx = durs.length ? durs.reduce((a, b) => (b.d > a.d ? b : a)) : { n: '—', d: 0 };

  const toItems = (list: typeof cs, showStage: boolean) => list.map((c) => ({
    id: c.id,
    text: c.name,
    badge: `${c.source} · ${c.motion} · ${showStage ? c.currentStage : c.journeyLength}`,
    cid: c.id,
  }));

  /* Module-level template reading only record fields : full-width
     .chip row — company link left, subtle source/motion/duration right). */
  const rowTemplate = (context: { text: string; badge: string; cid: string }): React.ReactNode => (
    <div className="chip cdp-path-row">
      <span className="link-co" onClick={(e) => { e.stopPropagation(); openCo(context.cid); }}>{context.text}</span>
      <span className="subtle" style={{ fontSize: '11.5px' }}>{context.badge}</span>
    </div>
  );

  return (
    <div className="view">
      <div className="grid g-2">
        <Card header="Converting paths" right="From demo journeys">
          <CardBody>
            <ListViewComponent
              dataSource={toItems(won, false)}
              fields={{ text: 'text' }}
              template={rowTemplate as never}
              cssClass="cdp-listview cdp-paths"
              showHeader={false}
            />
          </CardBody>
        </Card>
        <Card header="Non-converting paths" right="From demo journeys">
          <CardBody>
            <ListViewComponent
              dataSource={toItems(lost, true)}
              fields={{ text: 'text' }}
              template={rowTemplate as never}
              cssClass="cdp-listview cdp-paths"
              showHeader={false}
            />
          </CardBody>
        </Card>
      </div>
      <div className="grid g-4 mt">
        <Kpi lab="Shortest journey" val={`${mn.d} days`} delta={mn.n} />
        <Kpi lab="Longest journey" val={`${mx.d} days`} delta={mx.n} />
        <Kpi lab="Converting" val={won.length} delta="demo accounts" />
        <Kpi lab="Non-converting" val={lost.length} delta="demo accounts" />
      </div>
    </div>
  );
}