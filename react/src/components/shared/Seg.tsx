import type { CSSProperties } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

/* Segmented control — Syncfusion e-btn-group (same pattern as TenantSwitch).
 * The active option is differentiated by background color (brand). */
export function Seg<T extends string>({ options, value, onChange, style }: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  style?: CSSProperties;
}) {
  return (
    <div className="seg e-btn-group cdp-btn-group" style={style} role="group">
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