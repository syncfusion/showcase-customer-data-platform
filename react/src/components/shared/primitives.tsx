import type { ReactNode } from 'react';

/* Shared presentational primitives . Badges use the e-badge tone
   classes; chips use e-chip styling via app.css. */

export function Badge({ tone, children }: { tone: string; children: ReactNode }) {
  return <span className={`badge b-${tone}`}>{children}</span>;
}

export function Chip({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <span className="chip" style={style}>{children}</span>;
}

/* Syncfusion Card (e-card CSS classes). KPI layout uses the cdp-kpi
 * metrics via the cdp-kpi override class. */
export function Kpi({ lab, val, valClass, delta, deltaClass }: {
  lab: string; val: ReactNode; valClass?: string; delta: ReactNode; deltaClass?: string;
}) {
  return (
    <div className="e-card cdp-kpi">
      <div className="e-card-content">
        <div className="kpi">
          <div className="lab">{lab}</div>
          <div className={`val${valClass ? ' ' + valClass : ''}`}>{val}</div>
          <div className={`delta${deltaClass ? ' ' + deltaClass : ''}`}>{delta}</div>
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="section-title" style={style}>{children}</div>;
}

export function Note({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="note" style={style}><span>ℹ️</span><span>{children}</span></div>;
}

export function Illus({ children }: { children: ReactNode }) {
  return <span className="illus">{children}</span>;
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return <tr><td colSpan={colSpan} className="subtle" style={{ textAlign: 'center', padding: '22px' }}>{children}</td></tr>;
}

/* Card wrapper: e-card surfaces are equivalent;
   e-card CSS classes are used on Grid containers via cssClass). */
export function Card({ header, sub, right, children, style }: {
  header?: ReactNode; sub?: ReactNode; right?: ReactNode; children?: ReactNode; style?: React.CSSProperties;
}) {
  return (
    <div className="card" style={style}>
      {(header || right) && (
        <div className="card-h">
          <h3>{header}</h3>
          {sub && <p className="sub">{sub}</p>}
          {right && <span className="right">{right}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function CardBody({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return <div className="card-b" style={style}>{children}</div>;
}

/* Key-value rows rendered as a two-column grid (Grid-backed tables live in
   components/syncfusion/SfGrid; */
export function KeyValTable({ rows, firstWidth }: { rows: [ReactNode, ReactNode][]; firstWidth?: string }) {
  return (
    <table style={{ fontSize: '12.5px' }}>
      <tbody>
        {rows.map(([k, v], i) => (
          <tr key={i}><td className="subtle" style={{ width: firstWidth || '45%' }}>{k}</td><td>{v}</td></tr>
        ))}
      </tbody>
    </table>
  );
}