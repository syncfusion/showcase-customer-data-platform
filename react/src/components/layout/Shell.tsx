import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { SidebarComponent, AppBarComponent } from '@syncfusion/ej2-react-navigations';
import { ChipListComponent } from '@syncfusion/ej2-react-buttons';

/* Sidebar: Syncfusion SidebarComponent — one nav list, fixed 250px on desktop; overlay + scrim ≤900px . */

export const NAV_GROUPS: { label: string; items: { view: string; label: string }[] }[] = [
  {
    label: 'Foundation',
    items: [
      { view: 'customers', label: 'Customers & Companies' },
      { view: 'company', label: 'Company profile' },
      { view: 'dq', label: 'Data quality' },
    ],
  },
  {
    label: 'Journeys',
    items: [
      { view: 'journey', label: 'Journey explorer' },
      { view: 'funnel', label: 'Funnel' },
      { view: 'patterns', label: 'Journey patterns' },
    ],
  },
  {
    label: 'Revenue & Attribution',
    items: [
      { view: 'attribution', label: 'Revenue attribution' },
      { view: 'diagnosis', label: 'Revenue diagnosis' },
      { view: 'quality', label: 'Customer quality' },
      { view: 'content', label: 'Content contribution' },
    ],
  },
  {
    label: 'Activation',
    items: [
      { view: 'segments', label: 'Segments & audiences' },
      { view: 'alerts', label: 'Sales alerts' },
      { view: 'recos', label: 'Recommendations' },
      { view: 'experiments', label: 'Experiments' },
      { view: 'activation', label: 'Activation performance' },
    ],
  },
  {
    label: 'Assistant',
    items: [{ view: 'ai', label: 'Ask the platform' }],
  },
];

/** Map the current location to the active nav view (person → company profile). */
export function navViewFor(pathname: string): { view: string; parent: string } {
  const seg = pathname.replace(/^\//, '').split('/')[0] || 'customers';
  if (seg === 'person') return { view: 'person', parent: 'company' };
  return { view: seg, parent: seg };
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const { parent } = navViewFor(pathname);
  const [desktop, setDesktop] = useState(typeof window === 'undefined' ? true : window.innerWidth > 900);
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth > 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isOpen = desktop || open;

  return (
    <>
      <SidebarComponent
        type="Auto"
        width="250px"
        isOpen={isOpen}
        showBackdrop={false}
        enableGestures={false}
        style={{ background: '#101a30', color: '#c4cbdb' }}
      >
        <div className="brand">
          <div className="mark">CDP</div>
          <div>
            <h1>Customer Data Platform 360</h1>
            <small>Identity → Revenue → Action</small>
          </div>
        </div>
        <nav className="nav" id="nav">
          {NAV_GROUPS.map((g) => (
            <div className="group" key={g.label}>
              <div className="group-label">{g.label}</div>
              {g.items.map((it) => (
                <NavLink
                  key={it.view}
                  to={`/${it.view}`}
                  onClick={() => !desktop && onClose()}
                  className={({ isActive }) =>
                    (isActive || (parent === it.view && it.view === 'company')) ? 'active' : ''
                  }
                >
                  {it.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </SidebarComponent>
      {!desktop && open && (
        <div className="scrim" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(16,26,48,.4)', zIndex: 35 }} />
      )}
    </>
  );
}

export function useNavOpen(): { open: boolean; toggle: (v?: boolean) => void } {
  const [open, setOpen] = useState(false);
  const toggle = (v?: boolean) => setOpen((cur) => (v === undefined ? !cur : v));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return { open, toggle };
}

/** Sticky topbar — Syncfusion AppBarComponent: crumbs, title,
 *  search slot, tenant switch, e-chip environment pill. */
export function Topbar({ crumbs, title, env, onBurger, children }: {
  crumbs: string; title: string; env: string; onBurger: () => void; children?: React.ReactNode;
}) {
  return (
    <AppBarComponent position="Top" isSticky={true} colorMode="Light" cssClass="cdp-topbar">
      <button className="burger" onClick={onBurger} aria-label="Open navigation">☰</button>
      <div>
        <div className="crumbs">{crumbs}</div>
        <h2>{title}</h2>
      </div>
      <div className="spacer" />
      {children}
      <ChipListComponent text={env} cssClass="cdp-env" />
    </AppBarComponent>
  );
}