import { StepperComponent } from '@syncfusion/ej2-react-navigations';
import { useOpenCompany } from '../../components/layout/meta';
import { Kpi, Card, CardBody, SectionTitle } from '../../components/shared/primitives';

/* Module-level Stepper template — the step kind
 * renders as a small uppercase heading (.lk) and the step text as the value
 * line below it (.lv),. */
function loopTemplate(context: { step: { kind: string; text: string }; currentStep: number }): React.ReactNode {
  const s = context.step;
  return (
    <div className="ls">
      <div className="lk">{s.kind}</div>
      <div className="lv">{s.text}</div>
    </div>
  );
}

/* Activation performance — closed loop via Syncfusion Stepper with a
 * heading/subtitle template per step (Insight → … → Profile). */
export default function ActivationView() {
  const openCo = useOpenCompany();
  const steps = [
    { kind: 'Insight', text: 'Viewed Insights while expanding Desk', status: 'Completed' },
    { kind: 'Action', text: 'In-suite cross-sell alert', status: 'Completed' },
    { kind: 'Response', text: 'CS offered an Insights trial', status: 'Completed' },
    { kind: 'Outcome', text: 'Insights opportunity opened', status: 'Completed' },
    { kind: 'Profile', text: 'Two AppSuite products in play', status: 'Completed' },
  ];
  return (
    <div className="view">
      <div className="flex" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionTitle style={{ margin: 0 }}>Activation performance</SectionTitle>
        <span className="illus">Illustrative — portfolio scale</span>
      </div>
      <div className="grid g-4" style={{ marginBottom: 16 }}>
        <Kpi lab="Audiences activated" val="14" delta="▲ 3" deltaClass="up" />
        <Kpi lab="Messages delivered" val="18,240" delta="across channels" />
        <Kpi lab="Sales tasks created" val="128" delta="102 completed" />
        <Kpi lab="Opportunities generated" val="150" delta="from activation" deltaClass="up" />
      </div>
      <Card
        header={<>Closed loop — <span className="link-co" onClick={() => openCo('C008')}>Northwind Traders</span> Insights cross-sell</>}
        sub="Insight → action → response → outcome → updated profile"
      >
        <CardBody>
          <StepperComponent
            steps={steps}
            linear={false}
            cssClass="cdp-stepper cdp-loop-stepper"
            template={loopTemplate as never}
          />
        </CardBody>
      </Card>
    </div>
  );
}