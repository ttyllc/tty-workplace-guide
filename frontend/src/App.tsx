import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuote } from './hooks/useQuote';
import logicMap from './data/logicMap.json';
import AdminPanel from './components/AdminPanel';
import ChatBubble from './components/chat/ChatBubble';
import LandingPage from './components/layout/LandingPage';

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
    <span className="font-mono font-bold tabular-nums">
      ${displayValue.toLocaleString()}
    </span>
  );
};

const PriceSummary: React.FC<{ totals: { mrr: number; setupFee: number } }> = ({ totals }) => {
  const grandTotal = totals.mrr + totals.setupFee;
  
  return (
    <div className="p-8 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold text-fg uppercase tracking-widest">Quote Summary</h3>
        <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 text-accent text-[9px] font-bold uppercase tracking-tighter rounded-full border border-accent/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Estimate
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center group cursor-default">
          <span className="text-sm text-muted group-hover:text-fg transition-colors duration-200">Monthly Recurring</span>
          <PriceTicker value={totals.mrr} />
        </div>
        <div className="flex justify-between items-center group cursor-default">
          <span className="text-sm text-muted group-hover:text-fg transition-colors duration-200">One-time Setup</span>
          <PriceTicker value={totals.setupFee} />
        </div>
        
        <div className="pt-6 mt-6 border-t border-border flex justify-between items-end">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">Estimated Total</span>
           <motion.div 
             key={grandTotal}
             initial={{ scale: 0.98, opacity: 0.8 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: "spring", stiffness: 400, damping: 25 }}
             className="text-3xl font-black text-accent font-mono tabular-nums tracking-tighter relative"
           >
             <PriceTicker value={grandTotal} />
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 0.3, scale: 1.2 }}
               exit={{ opacity: 0, scale: 0.8 }}
               transition={{ duration: 0.4 }}
               className="absolute inset-0 bg-accent blur-xl -z-10"
             />
           </motion.div>
        </div>
      </div>
    </div>
  );
};

const AIAssistant: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-grow p-8 flex flex-col bg-bg overflow-y-auto">
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
  const { state, updateSelection, setStep, setUserInfo } = useQuote();

  if (window.location.pathname === '/admin') {
    return <AdminPanel />;
  }

  if (showLanding) {
    return <LandingPage onStartConfigurator={() => setShowLanding(false)} />;
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
               <p className="text-muted">Select the path that best describes your business needs.</p>
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
                   <p className="text-muted text-sm mb-4">Click to select this configuration path.</p>
                   <div className="mt-auto flex justify-end">
                     <span className="text-accent font-bold">Select →</span>
                   </div>
                 </div>
               ))}
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
               <p className="text-muted">The ideal foundation for your business infrastructure.</p>
             </div>
              <div className="card-selection border-accent/20 bg-accent/5">
 
               <ul className="space-y-4 mb-8">
                 {stepData.bundle.features.map((f: string, i: number) => (
                   <li key={i} className="flex items-center gap-3 text-fg">
                     <span className="text-accent bg-accent/10 rounded-full p-1">
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
               <p className="text-muted">Tailor your package with specific add-ons and capacities.</p>
             </div>
             <div className="grid gap-4">
                {stepData.questions.map((q: any) => (
                  <div key={q.id} className="card-selection items-center justify-between flex p-4">
 
                   <div className="flex flex-col">
                     <label className="text-lg font-semibold">{q.text}</label>
                     {q.desc && <p className="text-sm text-muted">{q.desc}</p>}
                   </div>
                   {q.type === 'integer' ? (
                     <div className="flex items-center gap-3">
                       <button 
                         onClick={() => updateSelection(q.id, Math.max(0, (state.selections[q.id] || 0) - 1))}
                         className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface"
                       >-</button>
                       <input
                         type="number"
                         className="w-12 p-2 border rounded text-center font-mono font-bold"
                         value={state.selections[q.id] || 0}
                         onChange={(e) => updateSelection(q.id, parseInt(e.target.value) || 0)}
                       />
                       <button 
                         onClick={() => updateSelection(q.id, (state.selections[q.id] || 0) + 1)}
                         className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface"
                       >+</button>
                     </div>
                   ) : (
                    <input
                      type="checkbox"
                      className="w-6 h-6 rounded border-border text-accent focus:ring-accent"
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
               <p className="text-muted">Please review and accept the final terms of service.</p>
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
                     <span className="text-accent font-bold">Select →</span>
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
               <p className="text-muted">Tell us who you are so we can generate your official quote.</p>
             </div>
             <form className="max-w-xl space-y-6" onSubmit={(e) => { e.preventDefault(); setStep('summary'); }}>
               {stepData.fields.map((f: any) => (
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
                className="bg-accent text-surface px-6 py-3 rounded-xl font-semibold transition-all hover:bg-accent-hover active:scale-95 shadow-md hover:shadow-accent/20 w-full"
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
              <p className="text-muted">Everything looks ready. One last check before submission.</p>
            </div>
             <div className="card-selection space-y-6">

              <div className="grid grid-cols-2 gap-4">
                 <div className="text-muted">Company</div>
                <div className="font-bold">{state.userInfo.company}</div>
                 <div className="text-muted">Configuration</div>
                <div className="font-bold">{state.selections['start'] === 'yes' ? 'Fiduciary & Tax' : 'Business Base'}</div>
              </div>
               <div className="pt-6 border-t border-border flex justify-between items-center">
                <span className="text-xl font-bold">Total MRR</span>
                <span className="text-3xl font-mono font-extrabold text-accent">${state.totals.mrr}</span>
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
                  className="bg-accent text-surface px-6 py-3 rounded-xl font-semibold transition-all hover:bg-accent-hover active:scale-95 shadow-md hover:shadow-accent/20 bg-green-600 hover:bg-green-700"
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] h-screen overflow-hidden">
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
  );
};

export default App;
