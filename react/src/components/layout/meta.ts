import * as seed from '../../data/seed';

/* Route metadata (source META) — breadcrumbs + page title per view. */
export const META: Record<string, [string, string]> = {
  customers: ['Foundation', 'Customers & Companies'],
  company: ['Foundation', 'Company profile'],
  person: ['Foundation', 'Person profile'],
  dq: ['Foundation', 'Data quality'],
  journey: ['Journeys', 'Journey explorer'],
  funnel: ['Journeys', 'Funnel'],
  patterns: ['Journeys', 'Journey patterns'],
  attribution: ['Revenue & Attribution', 'Revenue attribution'],
  diagnosis: ['Revenue & Attribution', 'Revenue diagnosis'],
  quality: ['Revenue & Attribution', 'Customer quality'],
  content: ['Revenue & Attribution', 'Content contribution'],
  segments: ['Activation', 'Segments & audiences'],
  alerts: ['Activation', 'Sales alerts'],
  recos: ['Activation', 'Recommendations'],
  experiments: ['Activation', 'Experiments'],
  activation: ['Activation', 'Activation performance'],
  ai: ['Assistant', 'Ask the platform'],
};

export function routeMeta(view: string): [string, string] {
  return META[view] ?? META.customers;
}

export function companyOptions(): { text: string; value: string }[] {
  return seed.ORDER.map((id) => ({ text: seed.COMPANIES[id].name, value: id }));
}

import { useNavigate } from 'react-router';

export function useOpenCompany(): (id: string) => void {
  const navigate = useNavigate();
  return (id: string) => navigate(`/company/${id}`);
}

export function useOpenPerson(): (cid: string, name: string) => void {
  const navigate = useNavigate();
  return (cid: string, name: string) => navigate(`/person/${cid}/${encodeURIComponent(name)}`);
}