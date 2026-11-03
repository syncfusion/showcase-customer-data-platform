import { useNavigate, useParams } from 'react-router';
import { useOpenCompany, useOpenPerson } from '../../components/layout/meta';
import { SfTimeline } from '../../components/syncfusion/SfTimeline';
import { Badge, Kpi, Card, CardBody, KeyValTable } from '../../components/shared/primitives';
import { money, personIds } from '../../services/aggregate';
import { COMPANIES } from '../../data/seed';

/* Person profile. */
export default function PersonView() {
  const { id, name } = useParams();
  const navigate = useNavigate();
  const openCo = useOpenCompany();
  const openPerson = useOpenPerson();
  const cid = id && COMPANIES[id] ? id : 'C001';
  const c = COMPANIES[cid];
  const decoded = name ? decodeURIComponent(name) : '';
  const idx = Math.max(c.people.findIndex((x) => x.n === decoded), 0);
  const p = c.people[idx] || c.people[0];
  const ids = personIds(c, idx);
  const acts = c.persons[p.n] || [];

  return (
    <div className="view">
      <div className="flex" style={{ marginBottom: 6 }}>
        <span className="link-co" onClick={() => openCo(c.id)}>← {c.name}</span>
      </div>
      <div className="flex wrap" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="flex">
          <div className="pr-ava">{p.n.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className="co-name">{p.n}</div>
            <div className="subtle" style={{ fontSize: '12.5px' }}>
              {p.role} · <span className="link-co" onClick={() => openCo(c.id)}>{c.name}</span>
            </div>
          </div>
        </div>
        <div className="flex wrap">
          <Badge tone={c.tenant === 'AppSuite' ? 'info' : 'brand'}>{c.tenant}</Badge>
          <Badge tone={p.cls}>{p.status}</Badge>
          <button className="btn primary sm" onClick={() => navigate(`/journey?co=${c.id}`)}>View journey</button>
        </div>
      </div>

      <div className="grid g-4" style={{ marginBottom: 16 }}>
        <Kpi lab="Customer stage" val={<span style={{ fontSize: 16 }}>{p.status}</span>} delta={`latest: ${p.last}`} />
        <Kpi lab="Product interest" val={<span style={{ fontSize: 16 }}>{p.product}</span>} delta={`role: ${p.role}`} />
        <Kpi lab="Original source" val={<span style={{ fontSize: 16 }}>{p.src}</span>} delta={`company: ${c.source}`} />
        <Kpi lab="Identity confidence" val={`${p.conf}%`} delta={`resolved to ${c.name}`} />
      </div>

      <div className="two-col">
        <Card header="Activity" right={`${acts.length} events`}>
          <CardBody>
            {acts.length ? <SfTimeline events={acts} /> : <span className="subtle">No recorded activity.</span>}
          </CardBody>
        </Card>
        <div>
          <Card header="Identifiers" sub="The keys used to unify this person">
            <CardBody>
              <KeyValTable rows={[
                ['Email', <span className="mono">{ids.email}</span>],
                ['Person ID', <span className="mono">{ids.pid}</span>],
                ['Website visitor ID', <span className="mono">{ids.vid}</span>],
                ['CRM lead ID', <span className="mono">{ids.lead}</span>],
                ['Snitcher ID', <span className="mono">{ids.snitcher}</span>],
              ]} />
            </CardBody>
          </Card>
          <Card header="Belongs to" style={{ marginTop: 16 }}>
            <CardBody>
              <div className="flex" style={{ justifyContent: 'space-between' }}>
                <div className="flex">
                  <div className="co-ava" style={{ width: 34, height: 34, fontSize: 12 }}>{c.ini}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    <div className="subtle mono" style={{ fontSize: '11.5px' }}>{c.id} · {c.tenant}</div>
                  </div>
                </div>
                <button className="btn sm" onClick={() => openCo(c.id)}>Open account</button>
              </div>
              <KeyValTable firstWidth="48%" rows={[
                ['Revenue model', c.revModel],
                ['Account revenue', <span className="mono">{c.won > 0 ? money(c.won) : c.pipeline > 0 ? money(c.pipeline) + ' pipeline' : '$0'}</span>],
                ['Account status', <Badge tone={c.statusClass}>{c.statusLabel}</Badge>],
                ['Other people', c.people.filter((x) => x.n !== p.n).length
                  ? <span>{c.people.filter((x) => x.n !== p.n).map((x, i) => (
                      <span key={x.n}>
                        {i > 0 && ', '}
                        <span className="link-co" onClick={() => openPerson(c.id, x.n)}>{x.n}</span>
                      </span>
                    ))}</span>
                  : '—'],
              ]} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}