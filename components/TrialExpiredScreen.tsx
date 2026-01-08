
import React, { useState } from 'react';
import { Lock, CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, LogOut, Zap, ChevronRight, Clock } from 'lucide-react';
import { PlanType, BillingCycle } from '../types';
import { PLAN_FEATURES } from '../constants';
import { cn } from '../lib/utils';

interface TrialExpiredScreenProps {
    onSelectPlan: (plan: PlanType, cycle: BillingCycle) => void;
    onLogout: () => void;
}

export const TrialExpiredScreen: React.FC<TrialExpiredScreenProps> = ({ onSelectPlan, onLogout }) => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');

    const getPlanPrice = (plan: PlanType) => {
        const basePrice = PLAN_FEATURES[plan].price;
        if (billingCycle === 'ANNUAL') {
            return (basePrice * 0.85).toFixed(2);
        }
        return basePrice.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative z-50 overflow-y-auto">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-red-900/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-6xl w-full relative z-10 flex flex-col items-center py-10">
                {/* Header Alert */}
                <div className="bg-red-950/30 border border-red-900/50 rounded-full px-6 py-2 flex items-center gap-3 mb-8 animate-pulse">
                    <AlertTriangle size={18} className="text-red-500" />
                    <span className="text-red-200 font-bold uppercase tracking-widest text-sm">Operação Pausada</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 tracking-tighter">
                    Sua jornada Carbon <span className="text-red-600">começa agora.</span>
                </h1>
                <p className="text-zinc-400 text-center max-w-2xl mb-12 text-lg font-light leading-relaxed">
                    Seus 15 dias de teste acabaram. Assine agora para desbloquear seu estúdio e manter seus dados, boxes e clientes intactos.
                </p>

                {/* Ciclo de Faturamento */}
                <div className="bg-zinc-900 p-1.5 rounded-2xl border border-white/5 flex items-center gap-2 mb-12">
                    <button 
                        onClick={() => setBillingCycle('MONTHLY')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                            billingCycle === 'MONTHLY' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-white"
                        )}
                    >
                        Pagamento Mensal
                    </button>
                    <button 
                        onClick={() => setBillingCycle('ANNUAL')}
                        className={cn(
                            "px-8 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all flex items-center gap-3",
                            billingCycle === 'ANNUAL' ? "bg-red-600 text-white shadow-glow-red" : "text-zinc-600 hover:text-white"
                        )}
                    >
                        Plano Anual <span className="bg-white/20 px-2 py-0.5 rounded text-[8px]">-15% OFF</span>
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
                    {/* START */}
                    <PlanCard 
                        name="START" 
                        price={getPlanPrice(PlanType.START)} 
                        billingCycle={billingCycle}
                        features={['Agenda Básica', 'Link de Agendamento', 'Gestão de Clientes']}
                        onSelect={() => onSelectPlan(PlanType.START, billingCycle)}
                        isElite={false}
                    />

                    {/* PRO */}
                    <PlanCard 
                        name="PRO" 
                        price={getPlanPrice(PlanType.PRO)} 
                        billingCycle={billingCycle}
                        features={['Tudo do Start', 'Módulo de Marketing', 'Portfólio Digital', 'Carbon Intelligence Basic']}
                        onSelect={() => onSelectPlan(PlanType.PRO, billingCycle)}
                        isPopular
                        isElite={false}
                    />

                    {/* ELITE */}
                    <PlanCard 
                        name="ELITE" 
                        price={getPlanPrice(PlanType.ELITE)} 
                        billingCycle={billingCycle}
                        features={['Tudo do Pro', 'Fluxo de Caixa & DRE', 'Carbon Intelligence Adv', 'Suporte Prioritário']}
                        onSelect={() => onSelectPlan(PlanType.ELITE, billingCycle)}
                        isElite={true}
                    />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-8 text-zinc-500 text-xs">
                    <span className="flex items-center gap-2"><CreditCard size={14}/> Cartão, PIX ou Boleto</span>
                    <span className="flex items-center gap-2"><Lock size={14}/> Ambiente 100% Criptografado</span>
                    <span className="flex items-center gap-2"><ShieldCheck size={14}/> Sem taxas de adesão</span>
                </div>

                <button onClick={onLogout} className="mt-16 text-zinc-600 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest transition-colors font-bold">
                    <LogOut size={14} /> Desconectar do Sistema
                </button>
            </div>
        </div>
    );
};

const PlanCard = ({ name, price, billingCycle, features, onSelect, isPopular, isElite }: any) => (
    <div className={cn(
        "relative flex flex-col rounded-[2.5rem] p-8 border transition-all duration-700 backdrop-blur-3xl group",
        isElite ? "bg-gradient-to-b from-zinc-900 to-black border-red-900/30 hover:border-red-600/50" : "bg-zinc-900/50 border-white/5 hover:border-white/10",
        isPopular && "scale-[1.05] border-white/20 z-10 shadow-2xl shadow-black"
    )}>
        {isPopular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                Recomendado
            </div>
        )}
        
        <div className="mb-8">
            <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em]",
                isElite ? "text-red-500" : "text-zinc-500"
            )}>{name}</span>
            <div className="flex items-baseline gap-1 mt-4">
                <span className="text-sm font-bold text-zinc-600">R$</span>
                <h4 className="text-5xl font-black text-white tracking-tighter">{price}</h4>
                <span className="text-xs text-zinc-600 font-bold">/mês</span>
            </div>
            <p className="text-[9px] font-bold text-zinc-700 uppercase mt-2 tracking-widest">
                {billingCycle === 'ANNUAL' ? 'Total anual economiza 15%' : 'Cobrança recorrente mensal'}
            </p>
        </div>

        <ul className="space-y-4 mb-10 flex-1">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                    <CheckCircle2 size={16} className={isElite ? "text-red-600" : "text-zinc-700"} />
                    {f}
                </li>
            ))}
        </ul>

        <button 
            onClick={onSelect}
            className={cn(
                "w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2",
                isElite ? "bg-red-600 text-white hover:bg-red-700 shadow-glow-red" : "bg-white text-black hover:bg-zinc-200"
            )}
        >
            Ativar Protocolo {name} <ChevronRight size={14} />
        </button>
    </div>
);
