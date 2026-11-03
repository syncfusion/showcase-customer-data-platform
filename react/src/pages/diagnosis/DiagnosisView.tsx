import { useState } from 'react';
import { SfSeg } from '../../components/syncfusion/SfSeg';
import { Card, CardBody, Note, SectionTitle } from '../../components/shared/primitives';
import { money } from '../../services/aggregate';
import { drivers } from '../../data/seed';
import type { DiagDim } from '../../types';

/* Revenue diagnosis — driver bars (positive/negative). */
export default function DiagnosisView() {
  const [dim, setDim] = useState<DiagDim>('source');
  const rows = drivers[dim];
  const max = Math.max(...rows.map((r) => Math.abs(r[1])));

  return (
    <div className="view">
      <div className="flex wrap" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
        <SectionTitle style={{ margin: 0 }}>Revenue change · this quarter vs last</SectionTitle>
        <div className="flex">
          <span className="illus">Illustrative — needs historical periods</span>
          <SfSeg
            value={dim}
            onChange={setDim}
            ariaLabel="Dimension"
            options={[
              { key: 'source', label: 'By source' },
              { key: 'product', label: 'By product' },
              { key: 'owner', label: 'By sales owner' },
            ]}
          />
        </div>
      </div>
      <Card
        header={`Top drivers by ${dim}`}
        right={<span>Net change: <b style={{ color: 'var(--pos)' }}>+$300,000</b></span>}
      >
        <CardBody>
          {rows.map((r) => {
            const pos = r[1] >= 0;
            const w = Math.max((Math.abs(r[1]) / max) * 100, 4);
            return (
              <div className="driver" key={r[0]}>
                <div className="dn">{r[0]}</div>
                <div className="dtrack">
                  <div className="dbar" style={{ width: `${w}%`, background: pos ? 'var(--pos)' : 'var(--neg)' }} />
                </div>
                <div className="dv" style={{ color: pos ? 'var(--pos)' : 'var(--neg)' }}>{pos ? '+' : ''}{money(r[1])}</div>
              </div>
            );
          })}
        </CardBody>
      </Card>
      <Note>
        <span>Drill any driver into companies, campaigns, products, pages, sales owners, or journey patterns. Use <b>contribution</b>, not <b>caused</b> — only controlled experiments prove causation.</span>
      </Note>
    </div>
  );
}