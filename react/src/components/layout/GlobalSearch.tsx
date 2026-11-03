import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AutoCompleteComponent } from '@syncfusion/ej2-react-dropdowns';
import { buildSearchIndex } from '../../services/aggregate';
import type { SearchEntry } from '../../types';

const INDEX = buildSearchIndex();
/* AutoComplete typed dataSource; fields.value='name' keeps typed entries. */
const INDEX_DATA = INDEX as unknown as { [key: string]: Object }[];

/* Global search — Syncfusion AutoComplete : custom
   item template (avatar + title + sub + kind label), empty template, select →
   navigate. Keyboard navigation (ArrowUp/Down/Enter/Escape) is native. */
function SearchItemTemplate(context: { id?: number; [key: string]: unknown }): React.ReactNode {
  void context.id;
  const m = context as unknown as SearchEntry;
  return (
    <div className="r">
      <div className={`ic ${m.type}`}>{m.ini}</div>
      <div className="meta">
        <div className="tt">{m.name}</div>
        <div className="st">{m.sub}</div>
      </div>
      <span className="kind">{m.type === 'co' ? 'Company' : 'Person'}</span>
    </div>
  );
}

export function GlobalSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const pickByName = (name: string): void => {
    const m = INDEX.find((x) => x.name === name);
    setValue('');
    if (!m) return;
    if (m.type === 'co' && m.id) navigate(`/company/${m.id}`);
    else if (m.cid) navigate(`/person/${m.cid}/${encodeURIComponent(m.name)}`);
  };

  return (
    <div className="search e-control-wrapper" style={{ position: 'relative', flex: 1, maxWidth: 360, minWidth: 160 }}>
      <AutoCompleteComponent
        dataSource={INDEX_DATA}
        fields={{ value: 'name' }}
        placeholder="Search companies or people…"
        cssClass="cdp-search"
        htmlAttributes={{ 'aria-label': 'Search', autocomplete: 'off' }}
        value={value}
        itemTemplate={SearchItemTemplate as never}
        filterType="Contains"
        minLength={1}
        noRecordsTemplate="No matches"
        showClearButton={false}
        select={(args: { itemData?: { [key: string]: Object } }) => {
          const name = args.itemData?.['name'] as string | undefined;
          if (name) pickByName(name);
        }}
      />
      <style>{`
        .search .e-autocomplete { width: 100%; }
        .search .e-input, .search input[type="text"] {
          width: 100%; font-family: inherit; font-size: 13px;
          padding: 9px 12px 9px 32px;
          border: 1px solid var(--line-strong); border-radius: 9px;
          background: var(--surface) url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2375809A' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E") no-repeat 10px center;
          box-shadow: none;
        }
        .search .e-input:focus { outline: none; border-color: var(--brand); }
        .search .e-popup .e-nodata, .search .e-popup .e-list-item { font-size: 12.5px; }
      `}</style>
    </div>
  );
}