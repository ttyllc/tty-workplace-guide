import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from './hooks/useQuote';
import logicMap from './data/logicMap.json';
import AdminPanel from './components/AdminPanel';
import ChatBubble from './components/chat/ChatBubble';
import LandingPage from './components/LandingPage';
import LiveTicker from './components/LiveTicker';

const StepProgress: React.FC<{ currentStep: string }> = ({ currentStep }) => {
  const steps = [
    { id: 'start', label: 'Path' },
    { id: 'bundle', label: 'Bundle' },
    { id: 'addons', label: 'Add-ons' },
    { id: 'terms', label: 'Terms' },
    { id: 'info', label: 'Details' },
    { id: 'summary', label: 'Review' },
  ];

  const getStepIndex = (step: string) => {
    if (step === 'start') return 0;
    if (step === 'flavor_a' || step === 'flavor_b') return 1;
    if (step === 'regulated_addons' || step === 'common_addons') return 2;
    if (step === 'final_terms') return 3;
    if (step === 'user_info') return 4;
    if (step === 'summary') return 5;
    return -1;
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className={`w-7 h-7 rounded-full text-[11px] font-bold transition-all duration-300 z-10 relative flex items-center justify-center ${
              i <= currentIndex 
                ? 'bg-accent text-surface shadow-lg shadow-accent/30 scale-110' 
                : 'bg-surface text-muted border border-border'
            }`}>
              {i < currentIndex ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : i + 1}
            </div>
          </div>
          
          {step.label && (
            <span className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
              i === currentIndex ? 'text-fg opacity-100' : 'text-muted opacity-60'
            }`}>
              {step.label}
            </span>
          )}
          
           {i < steps.length - 1 && (
             <div className="relative w-12 h-px bg-border mx-2">
               <motion.div 
                 className="absolute top-0 left-0 h-full bg-accent"
                 initial={{ width: 0 }}
                 animate={{ width: i < currentIndex ? '100%' : '0%' }}
                 transition={{ duration: 0.4, ease: "easeInOut" }}
               />
             </div>
           )}
        </div>
      ))}
    </div>
  );
};

const PriceTicker = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 400;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeProgress);
      
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.span 
      key={value}
      initial={{ scale: 0.9, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="font-mono font-bold tabular-nums inline-block"
    >
      ${displayValue.toLocaleString()}
    </motion.span>
  );
};

const PriceSummary: React.FC<{ totals: { mrr: number; setupFee: number } }> = ({ totals }) => {
  const grandTotal = totals.mrr + totals.setupFee;
  
  return (
    <div className="p-8 border-b border-border bg-surface/40 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xs font-black text-muted uppercase tracking-[0.2em]">Quote Summary</h3>
        <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-tighter rounded-full border border-accent/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Estimate
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center group cursor-default">
          <span className="text-sm text-muted group-hover:text-fg transition-colors duration-200 font-medium">Monthly Recurring</span>
          <PriceTicker value={totals.mrr} />
        </div>
        <div className="flex justify-between items-center group cursor-default">
          <span className="text-sm text-muted group-hover:text-fg transition-colors duration-200 font-medium">One-time Setup</span>
          <PriceTicker value={totals.setupFee} />
        </div>
        
        <div className="pt-6 mt-6 border-t border-border flex justify-between items-end">
          <span className="text-xs font-black text-muted uppercase tracking-widest">Estimated Total</span>
            <motion.div 
              key={grandTotal}
              initial={{ scale: 0.98, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="text-4xl font-black text-accent font-mono tabular-nums tracking-tighter relative"
            >
              <PriceTicker value={grandTotal} />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1.3 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-accent blur-2xl -z-10"
              />
            </motion.div>
        </div>
      </div>
    </div>
  );
};


const AIAssistant: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-grow p-8 flex flex-col ai-panel-bg overflow-y-auto">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-accent/20">
        AI
      </div>
      <h4 className="font-bold text-fg tracking-tight">Assistant</h4>
    </div>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const { state, updateSelection, setUserInfo } = useQuote();

  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  if (showLanding) {
    return <LandingPage onStartConfigurator={() => setShowLanding(false)} />;
  }

  const renderConfigurator = () => {
    const startData = logicMap.start;
    const path = state.selections['start'];
    const selectedBundle = path === 'yes' ? logicMap.flavor_b.bundle : logicMap.flavor_a.bundle;
    const regulatedAddons = logicMap.regulated_addons;
    const commonAddons = logicMap.common_addons;
    const termsData = logicMap.final_terms;
    const userData = logicMap.user_info;

    return (
      <div className="space-y-20 pb-32">
        {/* Section 1: Business Path */}
        <section className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-extrabold mb-4">{startData.question}</h2>
            <p className="text-muted">Select the path that best describes your business needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(startData.options).map(([key, opt]: [string, any]) => (
              <div 
                key={key}
                onClick={() => updateSelection('start', key)}
                className={`card-selection ${path === key ? 'selected' : ''}`}
              >
                <h3 className="text-xl font-bold mb-2">{opt.label}</h3>
                <p className="text-muted text-sm mb-4">Click to select this configuration path.</p>
                <div className="mt-auto flex justify-end">
                  <span className="text-accent font-bold">Select →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Selected Bundle */}
        {path && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">{selectedBundle.name}</h2>
              <p className="text-muted">The ideal foundation for your business infrastructure.</p>
            </div>
            <div className="card-selection border-accent/20 bg-accent/5">
              <ul className="space-y-4 mb-8">
                {selectedBundle.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-fg">
                    <span className="text-accent bg-accent/10 rounded-full p-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span> 
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Section 3: Add-ons */}
        {path && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Customize Your Solution</h2>
              <p className="text-muted">Tailor your package with specific add-ons and capacities.</p>
            </div>
            
            <div className="space-y-12">
              {/* Regulated Add-ons (Conditional) */}
              {path === 'yes' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-fg uppercase tracking-wider">Regulatory Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {regulatedAddons.questions.map((q: any) => (
                    <div 
                      key={q.id} 
                      onClick={() => q.type === 'boolean' && updateSelection(q.id, !state.selections[q.id])}
                      className={`card-row ${state.selections[q.id] ? 'selected' : ''}`}
                    >
                      <div className="flex flex-col">
                        <label className="text-lg font-semibold">{q.text}</label>
                        {q.desc && <p className="text-sm text-muted">{q.desc}</p>}
                      </div>
                      {q.type === 'integer' ? (
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => updateSelection(q.id, Math.max(0, (state.selections[q.id] || 0) - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface">-</button>
                          <input type="number" className="w-12 p-2 border rounded text-center font-mono font-bold bg-transparent" value={state.selections[q.id] || 0} onChange={(e) => updateSelection(q.id, parseInt(e.target.value) || 0)} />
                          <button onClick={() => updateSelection(q.id, (state.selections[q.id] || 0) + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface">+</button>
                        </div>
                      ) : (
                        <input type="checkbox" className="w-6 h-6 rounded border-border text-accent focus:ring-accent" checked={!!state.selections[q.id]} onChange={(e) => updateSelection(q.id, e.target.checked)} onClick={(e) => e.stopPropagation()} />
                      )}
                    </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Add-ons */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-fg uppercase tracking-wider">Common Enhancements</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {commonAddons.questions.map((q: any) => (
                    <div 
                      key={q.id} 
                      onClick={() => q.type === 'boolean' && updateSelection(q.id, !state.selections[q.id])}
                      className={`card-row ${state.selections[q.id] ? 'selected' : ''}`}
                    >
                      <div className="flex flex-col">
                        <label className="text-lg font-semibold">{q.text}</label>
                        {q.desc && <p className="text-sm text-muted">{q.desc}</p>}
                      </div>
                      {q.type === 'integer' ? (
                        <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => updateSelection(q.id, Math.max(0, (state.selections[q.id] || 0) - 1))} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface">-</button>
                          <input type="number" className="w-12 p-2 border rounded text-center font-mono font-bold bg-transparent" value={state.selections[q.id] || 0} onChange={(e) => updateSelection(q.id, parseInt(e.target.value) || 0)} />
                          <button onClick={() => updateSelection(q.id, (state.selections[q.id] || 0) + 1)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface">+</button>
                        </div>
                      ) : (
                        <input type="checkbox" className="w-6 h-6 rounded border-border text-accent focus:ring-accent" checked={!!state.selections[q.id]} onChange={(e) => updateSelection(q.id, e.target.checked)} onClick={(e) => e.stopPropagation()} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 4: Final Terms */}
        {path && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">{termsData.question}</h2>
              <p className="text-muted">Please review and accept the final terms of service.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(termsData.options).map(([key, opt]: [string, any]) => (
                <div 
                  key={key}
                  onClick={() => updateSelection('final_terms', key)}
                  className={`card-selection ${state.selections['final_terms'] === key ? 'selected' : ''}`}
                >
                  <h3 className="text-xl font-bold mb-2">{opt.label}</h3>
                  <div className="mt-auto flex justify-end">
                    <span className="text-accent font-bold">Select →</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: User Info Form */}
        {path && state.selections['final_terms'] && (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-extrabold mb-4">Final Details</h2>
              <p className="text-muted">Tell us who you are so we can generate your official quote.</p>
            </div>
            <form className="max-w-xl space-y-6" onSubmit={(e) => e.preventDefault()}>
              {userData.fields.map((f: any) => (
                <div key={f.id} className="flex flex-col gap-2">
                  <label className="font-semibold text-fg">{f.label}</label>
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
                onClick={async () => {
                  const payload = {
                    ...state.userInfo,
                    bundle: path === 'yes' ? 'Flavor B' : 'Flavor A',
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
                className="btn-primary w-full"
              >
                Submit Final Quote
              </button>
            </form>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] h-screen overflow-hidden">
      <div className="overflow-y-auto p-8 lg:p-12 border-r border-border bg-surface">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-fg mb-2">Workplace Solutions Guide</h1>
          <p className="text-muted">Design your compliant business infrastructure.</p>
        </header>
        {renderConfigurator()}
      </div>
      <div className="bg-bg flex flex-col border-l border-border">
        <PriceSummary totals={state.totals} />
        <AIAssistant>
          <ChatBubble quoteContext={{ selections: state.selections, totals: state.totals }} />
        </AIAssistant>
      </div>
    </div>
  );
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
                   className="btn-primary"
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
        <div className="flex flex-col h-screen overflow-hidden">
          <LiveTicker />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] flex-grow overflow-hidden">
            <div className="overflow-y-auto p-8 lg:p-12 border-r border-border bg-surface">
              <header className="mb-12">
                <h1 className="text-4xl font-extrabold text-fg mb-2">Workplace Solutions Guide</h1>
                <p className="text-muted">Design your compliant business infrastructure.</p>
              </header>
              <StepProgress currentStep={state.currentStep} />
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </div>
            <div className="bg-bg flex flex-col border-l border-border">
              <PriceSummary totals={state.totals} />
              <AIAssistant>
                <ChatBubble quoteContext={{ selections: state.selections, totals: state.totals }} />
              </AIAssistant>
            </div>
          </div>
        </div>
  );

};

export default App;
