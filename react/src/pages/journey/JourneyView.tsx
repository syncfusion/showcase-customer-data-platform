import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { StepperComponent } from '@syncfusion/ej2-react-navigations';
import { useOpenCompany } from '../../components/layout/meta';
import { SfSelect } from '../../components/syncfusion/SfControls';
import { SfSeg } from '../../components/syncfusion/SfSeg';
import { SfTimeline } from '../../components/syncfusion/SfTimeline';
import { Badge, Card, CardBody, KeyValTable, Note } from '../../components/shared/primitives';
import { COMPANIES, ORDER } from '../../data/seed';
import type { StepStatus } from '@syncfusion/ej2-navigations';

/* Module-level Stepper template - reads only fields on the step record. */
function stageTemplate(context: { step: { name: string; date: string; state: string }; currentStep: number }): React.ReactNode {
  const s = context.step;
  return (
    <div className={`stage ${s.state}`}>
      <div className="nm">{s.name}</div>
      <div className="dt">{s.date}</div>
    </div>
  );
}

/* Journey explorer. Journey stages use the Syncfusion Stepper.
 * Mode toggle is an e-btn-group (SfSeg); filters sit on one line.
 * The timeline is the Syncfusion Timeline (ej2-react-layouts). */
export default function JourneyView() {
  const [params, setParams] = useSearchParams();
  const [mode, setMode] = useState<'company' | 'person'>('company');
  const [person, setPerson] = useState<string>('');
  const openCo = useOpenCompany();

  const cid = params.get('co') && COMPANIES[params.get('co')!] ? params.get('co')! : 'C001';
  const c = COMPANIES[cid];
  const personNames = c.people.map((p) => p.n);
  const selectedPerson = person && personNames.includes(person) ? person : personNames[0];
  const events = mode === 'company' ? c.company : c.persons[selectedPerson] || [];
  const data = useMemo(() => events.map((e) => ({ date: e[0], act: e[1], who: e[2] })), [events]);

  const changeCompany = (name: string) => {
    const id = ORDER.find((i) => COMPANIES[i].name === name);
    if (id) setParams({ co: id });
    setPerson('');
  };

  const steps = useMemo(() => c.stages.map((s) => ({
    name: s.name,
    date: s.date,
    state: s.state,
    status: (s.state === 'done' ? 'Completed' : s.state === 'cur' ? 'InProgress' : 'Next') as string | StepStatus,
  } as { name: string; date: string; state: string; status: string | StepStatus })), [c]);

  return (
    <div className="view">
      <div className="filters" style={{ justifyContent: 'flex-start' }}>
        <span className="fl">Company</span>
        <SfSelect value={COMPANIES[cid].name} options={ORDER.map((i) => COMPANIES[i].name)} onChange={changeCompany} width={180} />
        <SfSeg
          value={mode}
          onChange={(m) => setMode(m)}
          ariaLabel="Timeline mode"
          options={[
            { key: 'company', label: 'Company timeline' },
            { key: 'person', label: 'Person timeline' },
          ]}
          style={{ marginLeft: 6 }}
        />
        {mode === 'person' && (
          <span className="flex" style={{ display: 'inline-flex', gap: 6 }}>
            <span className="fl">Person</span>
            <SfSelect value={selectedPerson} options={personNames} onChange={setPerson} width={130} />
          </span>
        )}
      </div>

      <Card style={{ marginBottom: 16 }} header="Journey stages" right={`Source: ${c.source} · ${c.motion} · ${c.tenant}`}>
        <CardBody>
          <StepperComponent steps={steps} cssClass="cdp-stepper cdp-stage-stepper" template={stageTemplate as never} />
        </CardBody>
      </Card>

      <div className="two-col">
        <Card header={`${mode === 'company' ? 'Company' : selectedPerson} timeline`} right={`${data.length} touchpoints`}>
          <CardBody>
            <SfTimeline events={data.map((d) => [d.date, d.act, d.who] as [string, string, string])} />
          </CardBody>
        </Card>
        <Card header="Touchpoint detail" right={<span className="link-co" onClick={() => openCo(c.id)}>Open profile</span>}>
          <CardBody>
            <KeyValTable rows={[
              ['Product interest', c.productInterest],
              ['Motion', c.motion],
              ['Current stage', <Badge tone={c.currentStageClass}>{c.currentStage}</Badge>],
              ['Original source', c.source],
              ['People involved', `${c.people.length} (${c.people.map((p) => p.n).join(', ')})`],
              ['Total touchpoints', String(c.touchpoints)],
              ['Duration', c.journeyLength],
            ]} />
            <Note>A B2B journey is completed by several people. The company timeline merges every related person into one ordered path.</Note>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}