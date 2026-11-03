import { useRef } from 'react';
import { AIAssistViewComponent } from '@syncfusion/ej2-react-interactive-chat';
import { useApp } from '../../store/app';
import { aiReply } from '../../services/aggregate';
import { aiSuggestions } from '../../data/seed';
import { TENANT_LABELS } from '../../types';

/* AI assistant — Syncfusion AI AssistView (item 24). promptSuggestions are the
 * suggestion chips; promptRequest bridges to the local keyword-scoring aiReply
 * engine (~220ms simulated delay) and writes the answer + its "Why" reasoning
 * back through addPromptResponse as plain text, so the default AssistView
 * response rendering (with toolbar) stays intact. */
export default function AiView() {
  const { agg, tenant } = useApp();
  const assistRef = useRef<AIAssistViewComponent | null>(null);

  const onPromptRequest = (args: { prompt?: string; cancel?: boolean }): void => {
    const q = (args.prompt ?? '').trim();
    if (!q) { args.cancel = true; return; }
    const rep = aiReply(q, agg, tenant);
    const text = rep.reason ? `${rep.answer}\n\nWhy: ${rep.reason}` : rep.answer;
    setTimeout(() => {
      assistRef.current?.addPromptResponse(text);
    }, 220);
  };

  return (
    <div className="view ai-wrap">
      <AIAssistViewComponent
        ref={assistRef}
        cssClass="cdp-assist"
        promptSuggestions={aiSuggestions}
        promptSuggestionsHeader="Ask about"
        promptPlaceholder="Ask about a company, journey, or number…"
        promptRequest={onPromptRequest as never}
        showHeader={false}
        width="100%"
        height="80vh"
      />
      <p className="subtle" style={{ fontSize: '11.5px', marginTop: 10 }}>
        Grounded in your unified profiles ({TENANT_LABELS[tenant]} view). This prototype returns illustrative answers.
      </p>
    </div>
  );
}