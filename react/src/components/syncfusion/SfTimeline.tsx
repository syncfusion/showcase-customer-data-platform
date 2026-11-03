import { TimelineComponent } from '@syncfusion/ej2-react-layouts';
import type { CSSProperties } from 'react';
import type { TimelineEvent } from '../../types';

/* Module-level template — reads only fields on the record. Uses the Timeline's
 * top-level `template` so the React portals are flushed (per-item `content`
 * templates are not portal-flushed by the React wrapper). Markup mirrors the
 * source `.tl .ev` structure (dot + date/act/who) . */
export function timelineTemplate(context: { item: { date: string; act: string; who: string }; itemIndex: number }): React.ReactNode {
  const it = context.item;
  return (
    <div className="ev" data-date={it.date} data-index={context.itemIndex}>
      <span className="pt" aria-hidden="true" />
      <span className="date">{it.date}</span>
      <span className="act">{it.act}</span>
      <span className="who">{it.who}</span>
    </div>
  );
}

/* Syncfusion Timeline (vertical) styled via `.tl` look via
 * cssClass="cdp-timeline" overrides in app.css. */
export function SfTimeline({ events, style }: { events: TimelineEvent[]; style?: CSSProperties }) {
  return (
    <TimelineComponent
      cssClass="cdp-timeline"
      style={style}
      items={events.map((e) => ({ date: e[0], act: e[1], who: e[2], dotCss: 'cdp-dot' }))}
      template={timelineTemplate as never}
    />
  );
}