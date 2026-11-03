import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router';
import { Sidebar, Topbar, useNavOpen } from './components/layout/Shell';
import { TenantSwitch } from './components/layout/TenantSwitch';
import { GlobalSearch } from './components/layout/GlobalSearch';
import { routeMeta } from './components/layout/meta';
import { AppProvider } from './store/app';
import { COMPANIES } from './data/seed';

import CustomersView from './pages/customers/CustomersView';
import CompanyView from './pages/company/CompanyView';
import PersonView from './pages/person/PersonView';
import DqView from './pages/dq/DqView';
import JourneyView from './pages/journey/JourneyView';
import FunnelView from './pages/funnel/FunnelView';
import PatternsView from './pages/patterns/PatternsView';
import AttributionView from './pages/attribution/AttributionView';
import DiagnosisView from './pages/diagnosis/DiagnosisView';
import QualityView from './pages/quality/QualityView';
import ContentView from './pages/content/ContentView';
import SegmentsView from './pages/segments/SegmentsView';
import AlertsView from './pages/alerts/AlertsView';
import RecosView from './pages/recos/RecosView';
import ExperimentsView from './pages/experiments/ExperimentsView';
import ActivationView from './pages/activation/ActivationView';
import AiView from './pages/ai/AiView';

/* Legacy hash deep links (#/company/C001) redirect onto BrowserRouter paths. */
export function HashRedirect({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const [v, a, b] = hash.split('/');
    if (v === 'company' && a && COMPANIES[a]) window.location.replace(`/company/${a}`);
    else if (v === 'person' && a && b) window.location.replace(`/person/${a}/${b}`);
    else if (['company', 'person'].includes(v)) window.location.replace(`/${v}${a && COMPANIES[a] ? '/' + a : ''}${b ? '/' + b : ''}`);
    else window.location.replace(`/${v || 'customers'}`);
  }, [location]);
  return <>{children}</>;
}

function Layout() {
  const { open, toggle } = useNavOpen();
  const { pathname } = useLocation();
  const seg = pathname.replace(/^\//, '').split('/')[0] || 'customers';
  const [crumbs, title] = routeMeta(seg);

  let env = 'Demo';
  if (seg === 'company' || seg === 'journey') {
    const coId = new URLSearchParams(window.location.search).get('co');
    const id = pathname.split('/')[2] || coId;
    if (id && COMPANIES[id]) env = 'Demo · ' + COMPANIES[id].name;
  } else if (seg === 'person') {
    const name = decodeURIComponent(pathname.split('/')[3] || '');
    if (name) env = 'Demo · ' + name;
  }

  return (
    <div className={`app${open ? ' open' : ''}`} id="app">
      <Sidebar open={open} onClose={() => toggle(false)} />
      <div className="cdp-main">
        <Topbar crumbs={crumbs} title={title} env={env} onBurger={() => toggle(true)}>
          <TenantSwitch />
          <GlobalSearch />
        </Topbar>
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/customers" replace />} />
            <Route path="/customers" element={<CustomersView />} />
            <Route path="/company/:id" element={<CompanyView />} />
            <Route path="/company" element={<Navigate to="/company/C001" replace />} />
            <Route path="/person/:id/:name" element={<PersonView />} />
            <Route path="/dq" element={<DqView />} />
            <Route path="/journey" element={<JourneyView />} />
            <Route path="/funnel" element={<FunnelView />} />
            <Route path="/patterns" element={<PatternsView />} />
            <Route path="/attribution" element={<AttributionView />} />
            <Route path="/diagnosis" element={<DiagnosisView />} />
            <Route path="/quality" element={<QualityView />} />
            <Route path="/content" element={<ContentView />} />
            <Route path="/segments" element={<SegmentsView />} />
            <Route path="/alerts" element={<AlertsView />} />
            <Route path="/recos" element={<RecosView />} />
            <Route path="/experiments" element={<ExperimentsView />} />
            <Route path="/activation" element={<ActivationView />} />
            <Route path="/ai" element={<AiView />} />
            <Route path="*" element={<Navigate to="/customers" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <HashRedirect>
          <Layout />
        </HashRedirect>
      </BrowserRouter>
    </AppProvider>
  );
}