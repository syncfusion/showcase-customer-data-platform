import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { useApp } from '../../store/app';
import { TENANTS, TENANT_LABELS, type TenantKey } from '../../types';

/* Tenant segmented control — Syncfusion e-btn-group One
 * shared `toggle` state; the active button is differentiated by background
 * color (brand). */
export function TenantSwitch() {
  const { tenant, setTenant } = useApp();
  return (
    <div className="seg e-btn-group cdp-btn-group" id="tenant-switch" role="group" aria-label="Tenant view" title="Tenant view">
      {(['all', ...TENANTS] as TenantKey[]).map((t) => (
        <ButtonComponent
          key={t}
          cssClass={`cdp-seg-btn e-toggle${t === tenant ? ' e-active' : ''}`}
          isToggle
          onClick={() => setTenant(t)}
        >
          {TENANT_LABELS[t]}
        </ButtonComponent>
      ))}
    </div>
  );
}