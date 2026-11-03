import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../store/app';
import { useOpenCompany, useOpenPerson, companyOptions } from '../../components/layout/meta';
import { SfSelect } from '../../components/syncfusion/SfControls';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Stitch } from '../../components/syncfusion/Stitch';
import { Badge, Chip, Kpi, Note, KeyValTable, Card, CardBody } from '../../components/shared/primitives';
import { money, qCls } from '../../services/aggregate';
import { COMPANIES } from '../../data/seed';

/* Company profile. */
export default function CompanyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tenant } = useApp();
  void tenant;
  const cid = id && COMPANIES[id] ? id : 'C001';
  const c = COMPANIES[cid];
  const openCo = useOpenCompany();
  const openPerson = useOpenPerson();
  /* dropdown defaults to the rendered company's name. */
  const opts = companyOptions();
  const selectedName = opts.find((o) => o.value === cid)?.text ?? c.name;

  const peopleColumns: SfGridColumn[] = [
    { field: 'n', headerText: 'Person' },
    { field: 'role', headerText: 'Role', template: (d) => <span className="subtle">{d.role as string}</span> },
    { field: 'src', headerText: 'Original source' },
    { field: 'last', headerText: 'Last activity', template: (d) => <span className="subtle">{d.last as string}</span> },
    { field: 'status', headerText: 'Status', template: (d) => <Badge tone={d.cls as string}>{d.status as string}</Badge> },
  ];

  const revLabel = c.won > 0 ? money(c.won) : c.pipeline > 0 ? money(c.pipeline) : '$0';
  const xt = c.crossSell && c.crossSell.tenant && c.crossSell.tenant !== c.tenant;

  return (
    <div className="view">
      <div className="filters" style={{ marginBottom: 14 }}>
        <span className="fl">Company</span>
        <SfSelect value={selectedName} options={opts.map((o) => o.text)} width={190} onChange={(name) => {
          const found = opts.find((o) => o.text === name);
          if (found) openCo(found.value);
        }} />
        <span className="subtle" style={{ fontSize: 12 }}>Switch accounts — every profile is live</span>
      </div>

      <div className="flex wrap" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="flex">
          <div className="co-ava">{c.ini}</div>
          <div>
            <div className="co-name">{c.name}</div>
            <div className="subtle mono" style={{ fontSize: 12 }}>{c.id} · {c.domain}</div>
          </div>
        </div>
        <div className="flex wrap">
          <Badge tone={c.tenant === 'AppSuite' ? 'info' : 'brand'}>{c.tenant}</Badge>
          <Badge tone={c.statusClass}>{c.statusLabel}</Badge>
          <Badge tone={qCls(c.quality)}>{c.quality} quality</Badge>
          <button className="btn primary sm" onClick={() => navigate(`/journey?co=${c.id}`)}>View journey</button>
        </div>
      </div>

      <div className="flex wrap" style={{ marginBottom: 16, gap: 6 }}>
        <Badge tone="grey">{c.licenseType}</Badge>
        <Badge tone="grey">{c.motion}</Badge>
        <Chip style={{ fontSize: 12 }}>{c.revModel}</Chip>
      </div>

      {c.crossSell && (
        <div className="card" style={{ borderColor: '#c9ecdb', marginBottom: 16 }}>
          <div className="card-b" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Badge tone="pos">Cross-sell</Badge>
            <div>
              <b>{c.crossSell.product}</b>{' '}
              {xt ? <Badge tone="info">cross-tenant</Badge> : <Badge tone="grey">in-suite</Badge>}
              <div className="subtle" style={{ fontSize: '12.5px' }}>{c.crossSell.note}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid g-4" style={{ marginBottom: 16 }}>
        <Kpi lab={c.won > 0 ? 'Won revenue' : c.pipeline > 0 ? 'Open pipeline' : 'Revenue'} val={revLabel} valClass="mono" delta={c.revenueSub} />
        <Kpi lab="Original source" val={<span style={{ fontSize: 17 }}>{c.source}</span>} delta={`Introduced by ${c.introducedBy}`} />
        <Kpi lab="Related people" val={c.people.length} delta={c.people.map((p) => p.n).join(' · ')} />
        <Kpi lab="Products" val={<span style={{ fontSize: 16 }}>{c.productsOwned}</span>} delta={`Interest: ${c.productInterest}`} />
      </div>

      <div className="two-col">
        <div>
          <Card header="Identity resolution" sub="How anonymous activity was stitched into one company (Syncfusion Timeline)">
            <CardBody>
              <Stitch c={c} />
              <div className="mt">
                <h4 className="blk">Identity confidence</h4>
                <div className="conf-row">
                  <div className="bar"><span style={{ width: `${c.confidence}%` }} /></div>
                  <span className="pct">{c.confidence}%</span>
                </div>
              </div>
            </CardBody>
          </Card>
          <div className="card mt">
            <div className="card-h">
              <h3>Related people</h3>
              <span className="right">Click a person to open their profile</span>
            </div>
            <SfGrid dataSource={c.people as unknown as Record<string, unknown>[]} columns={peopleColumns} onRowClick={(d) => openPerson(c.id, d.n as string)} />
          </div>
        </div>
        <div>
          <Card header="Profile">
            <CardBody>
              <KeyValTable rows={[
                ['Company name', c.name],
                ['Tenant', <Badge tone={c.tenant === 'AppSuite' ? 'info' : 'brand'}>{c.tenant}</Badge>],
                ['Tenant', <Badge tone={c.tenant === 'AppSuite' ? 'info' : 'brand'}>{c.tenant}</Badge>],
                ['Domain', <span className="mono">{c.domain}</span>],
                ['Type', c.type],
                ['License / model', c.licenseType],
                ['Motion', c.motion],
                ['Revenue model', c.revModel],
                ['CRM status', c.crmStatus],
                ['Customer status', <Badge tone={c.statusClass}>{c.statusLabel}</Badge>],
                ['Journey length', c.journeyLength],
              ]} />
            </CardBody>
          </Card>
          <Card header="Data-quality warnings" style={{ marginTop: 16 }}>
            <CardBody>
              {c.dq.length ? (
                <>
                  <div className="flex" style={{ marginBottom: 10 }}>
                    <Badge tone="warn">{c.dq.length} open</Badge>
                    <span className="subtle" style={{ fontSize: 12 }}>Resolve to improve match confidence</span>
                  </div>
                  {c.dq.map((w, i) => (
                    <Chip key={i} style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 6 }}>
                      <span className="dot" style={{ background: 'var(--warn)' }} /> {w}
                    </Chip>
                  ))}
                </>
              ) : (
                <div className="flex">
                  <Badge tone="pos">All clear</Badge>
                  <span className="subtle" style={{ fontSize: 12 }}>No open data-quality issues</span>
                </div>
              )}
              {c.sourceNote && <Note><span dangerouslySetInnerHTML={{ __html: c.sourceNote }} /></Note>}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}