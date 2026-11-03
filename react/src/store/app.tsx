/* App store: Context + useMemo over the seed data. The  module-level
   `let` state maps onto React context (tenant, company/person selection, alerts). */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { SalesAlert, TenantKey } from '../types';
import { alerts as seedAlerts } from '../data/seed';
import { computeAgg } from '../services/aggregate';

export interface AppStore {
  tenant: TenantKey;
  setTenant: (t: TenantKey) => void;
  agg: ReturnType<typeof computeAgg>;
  alertList: SalesAlert[];
  setAlertStatus: (index: number, status: string) => void;
}

const Ctx = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantKey>('all');
  const [alertList, setAlertList] = useState<SalesAlert[]>(seedAlerts.map((a) => ({ ...a, pri: a.pri } as SalesAlert)));

  const agg = useMemo(() => computeAgg(tenant), [tenant]);
  const setAlertStatus = (index: number, status: string) => {
    setAlertList((list) => list.map((a, i) => (i === index ? { ...a, status } : a)));
  };

  const value = useMemo(
    () => ({ tenant, setTenant, agg, alertList, setAlertStatus }),
    [tenant, agg, alertList],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp outside AppProvider');
  return ctx;
}