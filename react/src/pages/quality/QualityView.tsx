import { useApp } from '../../store/app';
import { useOpenCompany } from '../../components/layout/meta';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Tooltip, Category, ColumnSeries, DataLabel } from '@syncfusion/ej2-react-charts';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Card, CardBody, Note } from '../../components/shared/primitives';
import { money } from '../../services/aggregate';
import { qualityReasons } from '../../data/seed';

/* Customer quality distribution via Syncfusion Chart
 * (column series, brand palette, no theme series colors), tables via Grid. */
export default function QualityView() {
  const { agg } = useApp();
  const openCo = useOpenCompany();
  const q = agg.quality;
  const tot = agg.companies || 1;

  const bySourceColumns: SfGridColumn[] = [
    { field: 'source', headerText: 'Source' },
    { field: 'n', headerText: 'Accounts', textAlign: 'Right' },
    { field: 'won', headerText: 'Won revenue', textAlign: 'Right', template: (d) => <span className="mono">{money(d.won as number)}</span> },
    { field: 'custPct', headerText: '% customers', textAlign: 'Right', template: (d) => <span className="mono">{d.custPct as number}%</span> },
    { field: 'quality', headerText: 'Quality mix', template: (d) => <span className="subtle" style={{ fontSize: 12 }}>{d.quality as string}</span> },
  ];
  const bySourceRows = Object.entries(agg.bySource)
    .sort((a, b) => b[1].won - a[1].won)
    .map(([source, s]) => ({
      source, n: s.n, won: s.won,
      custPct: Math.round((s.cust / s.n) * 100),
      quality: `${s.high} high · ${s.med} med · ${s.low} low`,
    }));

  const chartData = [
    { tier: 'High', count: q.High },
    { tier: 'Medium', count: q.Medium },
    { tier: 'Low', count: q.Low },
  ];
  const pointColor = (data: { tier: string }): string =>
    data.tier === 'High' ? '#0E9F6E' : data.tier === 'Medium' ? '#3A4DB3' : '#B87708';

  return (
    <div className="view">
      <div className="two-col">
        <Card header="Quality distribution" sub={`Demo accounts by tier (current tenant) — ${tot} total`}>
          <CardBody>
            <ChartComponent
              primaryXAxis={{ valueType: 'Category', title: 'Quality tier' }}
              primaryYAxis={{ minimum: 0, majorTickLines: { width: 0 }, labelFormat: '' }}
              tooltip={{ enable: true }}
              legendSettings={{ visible: false }}
              width="100%"
              height="220px"
              palettes={['#3A4DB3']}
              pointRender={(args) => { args.fill = pointColor({ tier: chartData[args.pointIndex]?.tier ?? '' }); void args; }}
            >
              <Inject services={[ColumnSeries, Legend, Tooltip, Category, DataLabel]} />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={chartData}
                  xName="tier"
                  yName="count"
                  type="Column"
                  cornerRadius={{ topLeft: 6, topRight: 6 }}
                  dataLabel={{ visible: true, position: 'Outside', name: 'DataLabel' } as never}
                />
              </SeriesCollectionDirective>
            </ChartComponent>
          </CardBody>
        </Card>
        <Card header="Why tiers differ" sub="Signals behind each tier">
          <CardBody>
            {qualityReasons.map((r, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div className="flex" style={{ justifyContent: 'space-between', fontSize: 12.5 }}>
                  <span>{r[0]}</span><span className="mono subtle">{r[1]}%</span>
                </div>
                <div className="bar"><span style={{ width: `${r[1]}%`, background: 'var(--brand)' }} /></div>
              </div>
            ))}
            <Note>High-tier accounts convert and expand more — quality is a leading indicator.</Note>
          </CardBody>
        </Card>
      </div>

      <Card header={<span>Quality & conversion by source — <span className="link-co" onClick={() => openCo('C001')}>ABC Technologies</span> is the tier benchmark</span>} style={{ marginTop: 16 }}>
        <SfGrid dataSource={bySourceRows as unknown as Record<string, unknown>[]} columns={bySourceColumns} />
      </Card>
    </div>
  );
}