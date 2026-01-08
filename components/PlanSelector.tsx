import React from 'react';
import { PlanType } from '../types';
import { PLAN_FEATURES } from '../constants';

interface PlanSelectorProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({ currentPlan, onSelectPlan }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full md:w-64 bg-zinc-950 border-t border-zinc-900 p-4 z-30 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      
      {/* Plan Selector */}
      <div>
        <p className="text-[10px] text-zinc-500 uppercase font-bold mb-2">Simular Plano (Demo)</p>
        <div className="flex gap-1">
            {(Object.keys(PLAN_FEATURES) as PlanType[]).map((plan) => (
            <button
                key={plan}
                onClick={() => onSelectPlan(plan)}
                className={`flex-1 text-xs py-2 rounded font-medium transition-all
                ${currentPlan === plan 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'}
                `}
            >
                {plan}
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};