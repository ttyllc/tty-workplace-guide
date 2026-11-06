import { useState } from 'react';
import logicMap from '../data/logicMap.json';

export interface QuoteState {
  currentStep: string;
  selections: Record<string, any>;
  userInfo: {
    name: string;
    email: string;
    company: string;
  };
  totals: {
    mrr: number;
    setupFee: number;
  };
}

export const useQuote = () => {
  const [state, setState] = useState<QuoteState>({
    currentStep: 'start',
    selections: {},
    userInfo: { name: '', email: '', company: '' },
    totals: { mrr: 0, setupFee: 0 },
  });

  const updateSelection = (key: string, value: any) => {
    setState(prev => {
      const newSelections = { ...prev.selections, [key]: value };
      return {
        ...prev,
        selections: newSelections,
        totals: calculateTotals(newSelections),
      };
    });
  };

  const setStep = (step: string) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setUserInfo = (info: Partial<QuoteState['userInfo']>) => {
    setState(prev => ({
      ...prev,
      userInfo: { ...prev.userInfo, ...info },
    }));
  };

  const calculateTotals = (selections: Record<string, any>): { mrr: number; setupFee: number } => {
    let mrr = 0;
    let setupFee = 0;

    // Determine Bundle
    const bundleKey = selections['start'] === 'yes' ? 'flavor_b' : 'flavor_a';
    const bundle = (logicMap[bundleKey as keyof typeof logicMap] as any).bundle;
    mrr += bundle.mrr;
    setupFee = bundle.setup_fee;

    // Regulated Add-ons (Flavor B)
    if (bundleKey === 'flavor_b') {
      const mailboxes = selections['additional_mailboxes'] || 0;
      mrr += mailboxes * 12;
      if (selections['worm_backup']) mrr += 20;
    }

    // Common Add-ons
    const commonAddons = logicMap.common_addons.questions;
    commonAddons.forEach(addon => {
      const val = selections[addon.id];
      if (addon.type === 'integer' && val) {
        mrr += val * addon.unit_price!;
      } else if (addon.type === 'boolean' && val) {
        mrr += addon.price!;
      }
    });

    // Setup Fee Waiver
    if (selections['final_terms'] === 'yes') {
      setupFee = 0;
    }

    return { mrr, setupFee };
  };

  return { state, updateSelection, setStep, setUserInfo };
};
