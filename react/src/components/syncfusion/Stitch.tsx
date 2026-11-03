import { TimelineComponent } from '@syncfusion/ej2-react-layouts';
import type { Company } from '../../types';

/* Identity-resolution stitch chain — Syncfusion Timeline.
 * Each item carries node knobs/labels; the module-level content template
 * renders markup inside each Timeline item. */
interface StitchItem { knob: string; knobCls: string; k: string; v: string; link: string }

export function stitchItems(c: Company): StitchItem[] {
  const hasEmail = !!c.email;
  const labels = [
    hasEmail ? 'matched on visitor cookie → form submit' : 'matched via reverse-IP (Snitcher)',
    hasEmail ? 'matched on email' : 'no email captured yet',
    hasEmail ? 'matched on email domain' : 'domain matched to company',
  ];
  return [
    { knob: '?', knobCls: 'anon', k: 'Anonymous visitor', v: `${c.visitorId} · ${c.source}`, link: '' },
    { knob: c.introducedBy.slice(0, 2).toUpperCase(), knobCls: '', k: `${c.introducedBy} (person)`, v: `${c.personId || 'unresolved'}${c.leadId ? ' · lead ' + c.leadId : ''}`, link: labels[0] },
    ...(hasEmail
      ? [{ knob: '@', knobCls: '', k: c.email!, v: `CRM contact${c.leadId ? ' · lead ' + c.leadId : ''}`, link: labels[1] } as StitchItem]
      : [{ knob: '@', knobCls: 'anon', k: 'No email captured', v: 'reverse-IP company match', link: labels[1] } as StitchItem]),
    { knob: '🏢', knobCls: 'co', k: c.name, v: `${c.id} · ${c.domain}`, link: labels[2] },
  ];
}

/* Module-level template — reads only fields on the record (top-level
   `template` so React portals flush). */
function stitchContent(context: { item: StitchItem; itemIndex: number }): React.ReactNode {
  const n = context.item;
  return (
    <div className="stitch-item">
      {n.link && <div className="link"><span className="lab">{n.link}</span></div>}
      <div className="node">
        <div className={`knob${n.knobCls ? ' ' + n.knobCls : ''}`}>{n.knob}</div>
        <div className="meta">
          <div className="k">{n.k}</div>
          <div className="v">{n.v}</div>
        </div>
      </div>
    </div>
  );
}

export function Stitch({ c }: { c: Company }) {
  return (
    <TimelineComponent
      cssClass="cdp-timeline-stitch"
      items={stitchItems(c).map((item) => ({ ...item } as unknown as { dotCss?: string }))}
      template={stitchContent as never}
    />
  );
}