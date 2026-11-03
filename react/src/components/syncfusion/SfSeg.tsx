import type { CSSProperties } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

/* Syncfusion e-btn-group segmented control used by every page-level toggle
 * (journey mode, attribution model, content role, diagnosis dimension) and
 * the tenant switch. `value` marks the e-active button, differentiated by
 * background color (brand). */
export function SfSeg<T extends string>({ options, value, onChange, ariaLabel, style, id }: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel?: string;
  style?: CSSProperties;
  id?: string;
}) {
  return (
    <div className="seg e-btn-group cdp-btn-group" style={style} role="group" id={id} aria-label={ariaLabel}>
      {options.map((o) => (
        <ButtonComponent
          key={o.key}
          cssClass={`cdp-seg-btn e-toggle${o.key === value ? ' e-active' : ''}`}
          isToggle
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </ButtonComponent>
      ))}
    </div>
  );
}