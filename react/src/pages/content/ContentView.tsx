import { useState } from 'react';
import { useApp } from '../../store/app';
import { SfSeg } from '../../components/syncfusion/SfSeg';
import { SfGrid, type SfGridColumn } from '../../components/syncfusion/SfGrid';
import { Card, SectionTitle } from '../../components/shared/primitives';
import { money } from '../../services/aggregate';
import { contentPages } from '../../data/seed';
import type { ContentRole } from '../../types';

const CTITLES: Record<ContentRole, string> = {
  revenue: 'Revenue-associated pages',
  first: 'First-touch pages',
  lead: 'Lead-creation pages',
  opp: 'Opportunity-assisting pages',
};

/* Content contribution — pages table via Grid, role toggle via
 * e-btn-group with highlighted active state. */
export default function ContentView() {
  const [role, setRole] = useState<ContentRole>('revenue');
  const { tenant } = useApp();
  void tenant;
  const rows = contentPages[role];
  const max = Math.max(...rows.map((r) => r[2]));

  const columns: SfGridColumn[] = [
    { field: 'page', headerText: 'Page' },
    { field: 'influence', headerText: 'Customers influenced', textAlign: 'Right' },
    { field: 'revenue', headerText: 'Revenue associated', textAlign: 'Right', template: (d) => <span className="mono">{money(d.revenue as number)}</span> },
    { field: 'share', headerText: 'Share', template: (d) => (
      <div className="bar"><span style={{ width: `${((d.revenue as number) / max) * 100}%` }} /></div>
    ) },
  ];
  const data = rows.map((r) => ({ page: r[0], influence: r[1], revenue: r[2], share: '' }));

  return (
    <div className="view">
      <div className="filters" style={{ justifyContent: 'space-between', marginBottom: 14 }}>
        <SectionTitle style={{ margin: 0 }}>Pages in successful journeys</SectionTitle>
        <div className="flex">
          <span className="illus">Illustrative — needs page analytics</span>
          <SfSeg
            value={role}
            onChange={setRole}
            ariaLabel="Content role"
            options={[
              { key: 'revenue', label: 'Revenue-associated' },
              { key: 'first', label: 'First-touch' },
              { key: 'lead', label: 'Lead-creation' },
              { key: 'opp', label: 'Opportunity-assisting' },
            ]}
          />
        </div>
      </div>
      <Card header={CTITLES[role]} right="Association, not causation">
        <SfGrid dataSource={data as unknown as Record<string, unknown>[]} columns={columns} />
      </Card>
    </div>
  );
}