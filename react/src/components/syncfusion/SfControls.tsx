import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

/* DropDownList filter/picker select. Inline width keeps the filter bar a
 * single row: label, selects, Clear, result count. */
export function SfSelect({ value, options, onChange, placeholder, width = 150 }: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number | string;
}) {
  const w = typeof width === 'number' ? `${width}px` : width;
  return (
    <DropDownListComponent
      value={value}
      dataSource={options}
      placeholder={placeholder}
      change={(args) => { if (args.isInteracted !== false) onChange(args.value as string); }}
      popupHeight="240px"
      cssClass="cdp-ddl"
      htmlAttributes={{ style: `width:${w}` }}
    />
  );
}

/* Button. */
export function SfButton({ children, primary, small, onClick, ariaLabel }: {
  children: string; primary?: boolean; small?: boolean;
  onClick?: () => void; ariaLabel?: string;
}) {
  return (
    <ButtonComponent
      cssClass={`cdp-btn${primary ? ' e-primary' : ''}${small ? ' e-small' : ''}`}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </ButtonComponent>
  );
}