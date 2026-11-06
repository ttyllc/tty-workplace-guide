import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from './hooks/useQuote';
import logicMap from './data/logicMap.json';
import AdminPanel from './components/AdminPanel';
import ChatBubble from './components/chat/ChatBubble';

const PriceTicker = ({ value }: { value: number }) => {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="font-mono font-bold"
    >
      ${value}
    </motion.span>
  );
};

const PriceSummary: React.FC<{ totals: { mrr: number; setupFee: number } }> = ({ totals }) => (
  <div className="p-8 border-b border-slate-200 bg-white">
    <h3 className="text-xl font-bold mb-6">Quote Summary</h3>
    <div className="space-y-4">
      <div className="flex justify-between text-slate-600">
        <span>Monthly Recurring (MRR)</span>
        <PriceTicker value={totals.mrr} />
      </div>
      <div className="flex justify-between text-slate-600">
        <span>One-time Setup Fee</span>
        <PriceTicker value={totals.setupFee} />
      </div>
      <div className="pt-4 border-t border-slate-200 flex justify-between text-lg font-bold">
        <span>Estimated Total</span>
        <div className="text-indigo-600 font-mono">
          <PriceTicker value={totals.mrr + totals.setupFee} />
        </div>
      </div>
    </div>
  </div>
);

const AIAssistant: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-grow p-8 flex flex-col bg-slate-50">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
        AI
      </div>
      <h4 className="font-bold text-slate-800">Assistant</h4>
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const { state, updateSelection, setStep, setUserInfo } = useQuote();

  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  const renderStep = () => {
    const stepData = logicMap[state.currentStep as keyof typeof logicMap] as any;
    if (!stepData) return <div className="p-8 text-center">Step not found</div>;

    return (
      <motion.div 
        key={state.currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-12"
      >
        {/* 1. Initial Question */}
        {state.currentStep === 'start' && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">{stepData.question}</h2>
              <p className="text-slate-600">Select the path that best describes your business needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(stepData.options).map(([key, opt]: [string, any]) => (
                <div 
                  key={key}
                  onClick={() => {
                    updateSelection('start', key);
                    setStep(opt.target);
                  }}
                  className={`card-selection ${state.selections['start'] === key ? 'selected' : ''}`}
                >
                  <h3 className="text-xl font-bold mb-2">{opt.label}</h3>
                  <p className="text-slate-500 text-sm mb-4">Click to select this configuration path.</p>
                  <div className="mt-auto flex justify-end">
                    <span className="text-indigo-600 font-bold">Select →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Bundle Confirmation / Info */}
        {(state.currentStep === 'flavor_a' || state.currentStep === 'flavor_b') && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">{stepData.bundle.name}</h2>
              <p className="text-slate-600">The ideal foundation for your business infrastructure.</p>
            </div>
            <div className="card-selection border-indigo-100 bg-indigo-50/10">
              <ul className="space-y-4 mb-8">
                {stepData.bundle.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <span className="text-indigo-600 bg-indigo-100 rounded-full p-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span> 
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button
                  onClick={() => setStep(stepData.next)}
                  className="btn-primary"
                >
                  Continue to Add-ons
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Add-ons */}
        {(state.currentStep === 'regulated_addons' || state.currentStep === 'common_addons') && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Customize Your Solution</h2>
              <p className="text-slate-600">Tailor your package with specific add-ons and capacities.</p>
            </div>
            <div className="grid gap-4">
              {stepData.questions.map((q: any) => (
                <div key={q.id} className="card-selection items-center justify-between flex p-4">
                  <div className="flex flex-col">
                    <label className="text-lg font-semibold">{q.text}</label>
                    {q.desc && <p className="text-sm text-slate-500">{q.desc}</p>}
                  </div>
                  {q.type === 'integer' ? (
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateSelection(q.id, Math.max(0, (state.selections[q.id] || 0) - 1))}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                      >-</button>
                      <input
                        type="number"
                        className="w-12 p-2 border rounded text-center font-mono font-bold"
                        value={state.selections[q.id] || 0}
                        onChange={(e) => updateSelection(q.id, parseInt(e.target.value) || 0)}
                      />
                      <button 
                        onClick={() => updateSelection(q.id, (state.selections[q.id] || 0) + 1)}
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50"
                      >+</button>
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      checked={!!state.selections[q.id]}
                      onChange={(e) => updateSelection(q.id, e.target.checked)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setStep(stepData.next)}
                className="btn-primary"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* 4. Final Terms */}
        {state.currentStep === 'final_terms' && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">{stepData.question}</h2>
              <p className="text-slate-600">Please review and accept the final terms of service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(stepData.options).map(([key, opt]: [string, any]) => (
                <div 
                  key={key}
                  onClick={() => {
                    updateSelection('final_terms', key);
                    setStep(opt.next);
                  }}
                  className={`card-selection ${state.selections['final_terms'] === key ? 'selected' : ''}`}
                >
                  <h3 className="text-xl font-bold mb-2">{opt.label}</h3>
                  <div className="mt-auto flex justify-end">
                    <span className="text-indigo-600 font-bold">Select →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. User Info Form */}
        {state.currentStep === 'user_info' && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Final Details</h2>
              <p className="text-slate-600">Tell us who you are so we can generate your official quote.</p>
            </div>
            <form className="max-w-xl space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('summary'); }}>
              {stepData.fields.map((f: any) => (
                <div key={f.id} className="flex flex-col gap-2">
                  <label className="font-semibold text-slate-700">{f.label}</label>
                  <input
                    type={f.type}
                    required={f.required}
                    className="input-field"
                    value={state.userInfo[f.id as keyof typeof state.userInfo]}
                    onChange={(e) => setUserInfo({ [f.id]: e.target.value })}
                  />
                </div>
              ))}
              <button
                type="submit"
                className="btn-primary w-full"
              >
                Review Final Quote
              </button>
            </form>
          </div>
        )}

        {/* 6. Summary & Submission */}
        {state.currentStep === 'summary' && (
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Review Your Solution</h2>
              <p className="text-slate-600">Everything looks ready. One last check before submission.</p>
            </div>
            <div className="card-selection space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-slate-500">Company</div>
                <div className="font-bold">{state.userInfo.company}</div>
                <div className="text-slate-500">Configuration</div>
                <div className="font-bold">{state.selections['start'] === 'yes' ? 'Fiduciary & Tax' : 'Business Base'}</div>
              </div>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xl font-bold">Total MRR</span>
                <span className="text-3xl font-mono font-extrabold text-indigo-600">${state.totals.mrr}</span>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setStep('user_info')}
                  className="btn-secondary"
                >
                  Edit Info
                </button>
                <button
                  onClick={async () => {
                    const payload = {
                      ...state.userInfo,
                      bundle: state.selections['start'] === 'yes' ? 'Flavor B' : 'Flavor A',
                      addons: state.selections,
                      mrr: state.totals.mrr,
                      setup_fee: state.totals.setupFee,
                      agreement: state.selections['final_terms'] === 'yes',
                    };
                    try {
                      const res = await fetch('/api/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                      });
                      if (res.ok) alert('Quote submitted successfully!');
                    } catch (e) {
                      alert('Error submitting quote');
                    }
                  }}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  Submit Quote
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="app-container">
      <div className="config-panel">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Workplace Solutions Guide</h1>
          <p className="text-slate-600">Design your compliant business infrastructure.</p>
        </header>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
      <div className="summary-panel">
        <PriceSummary totals={state.totals} />
        <AIAssistant>
          <ChatBubble quoteContext={{ selections: state.selections, totals: state.totals }} />
        </AIAssistant>
      </div>
    </div>
  );
};

export default App;
