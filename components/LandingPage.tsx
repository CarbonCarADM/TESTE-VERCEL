
import React, { useState } from 'react';
import { 
    ChevronRight, Zap, ShieldCheck, Check, ChevronDown, 
    Car, Activity, Lock, MousePointer2, Share2, Star,
    LayoutDashboard, Clock, Wallet, Sparkles, TrendingUp, Cpu, Globe
} from 'lucide-react';
import { PlanType } from '../types';
import { cn } from '../lib/utils';

interface LandingPageProps {
    onEnterSystem: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterSystem }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-red-900 selection:text-white relative overflow-x-hidden">
            
            {/* Camada de Background Premium - Gradientes e Vidro */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-900/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 scanner-grid opacity-[0.03]" />
            </div>

            {/* Navbar - Frosted Glass */}
            <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-glow-red">
                            <Car className="text-white w-6 h-6" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase italic">Carbon<span className="text-red-600">Car</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                        <a href="#features" className="hover:text-red-500 transition-colors">Tecnologia</a>
                        <a href="#plans" className="hover:text-red-500 transition-colors">Planos</a>
                        <a href="#testimonials" className="hover:text-red-500 transition-colors">Elite</a>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onEnterSystem} className="text-[10px] font-black uppercase tracking-widest hover:text-white text-zinc-500 transition-colors">Acessar</button>
                        <button onClick={onEnterSystem} className="bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl active:scale-95">Começar Missão</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-48 pb-32 px-6 overflow-hidden z-10">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-10 animate-fade-in shadow-2xl">
                        <Cpu size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-400 italic">Core Carbon Intelligence v3.0 Online</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-800 uppercase leading-[0.85] italic">
                        REDEFINA O <br/>
                        <span className="text-red-600 drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]">DETALHAMENTO</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-500 mb-14 max-w-2xl mx-auto leading-relaxed font-bold uppercase tracking-widest opacity-80">
                        A plataforma operacional definitiva para estéticas que buscam performance nominal e lucratividade de elite.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up">
                        <button onClick={onEnterSystem} className="w-full sm:w-auto px-12 py-5 bg-red-600 hover:bg-red-700 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all shadow-glow-red hover:scale-105 flex items-center justify-center gap-3 group">
                            <Zap size={18} className="group-hover:animate-pulse" /> Criar Conta Grátis
                        </button>
                        <button onClick={onEnterSystem} className="w-full sm:w-auto px-12 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 backdrop-blur-xl">
                            Live Demo <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Preview Hud */}
                    <div className="mt-24 relative group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-transparent to-transparent z-20" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-transparent blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative z-10 p-1 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-hero overflow-hidden">
                             <img 
                                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" 
                                alt="Dashboard Preview" 
                                className="rounded-[2.2rem] w-full max-w-6xl grayscale hover:grayscale-0 transition-all duration-1000 opacity-60 hover:opacity-100"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Features - Glass Cards */}
            <section id="features" className="py-32 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.6em] mb-4">Módulos Táticos</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Engenharia de Gestão</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={LayoutDashboard}
                            title="Monitor de Pátio"
                            description="Controle visual de boxes em tempo real. Saiba exatamente onde cada ativo está e qual o progresso nominal do serviço."
                        />
                        <FeatureCard 
                            icon={Clock}
                            title="Concierge 24/7"
                            description="Link de agendamento público premium. Seu cliente reserva o horário sem fricção, integrado diretamente na sua grade."
                        />
                        <FeatureCard 
                            icon={Wallet}
                            title="DRE Inteligente"
                            description="Fluxo de caixa consolidado e visão de lucro líquido. Decisões baseadas em dados financeiros, não em suposições."
                        />
                        <FeatureCard 
                            icon={Sparkles}
                            title="Carbon AI Core"
                            description="Nossa inteligência artificial analisa gargalos e sugere ações táticas para aumentar seu faturamento médio."
                        />
                        <FeatureCard 
                            icon={ShieldCheck}
                            title="Vault Security"
                            description="Checklists digitais com fotos e assinaturas. Proteção total contra reclamações indevidas e controle de danos."
                        />
                        <FeatureCard 
                            icon={TrendingUp}
                            title="LTV Accelerator"
                            description="Sistema de fidelização e lembretes automáticos. Mantenha o pátio sempre cheio com o ciclo de retorno otimizado."
                        />
                    </div>
                </div>
            </section>

            {/* Plans Section - Ultra Glass */}
            <section id="plans" className="py-32 relative z-10 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.6em] mb-4">Investimento</h2>
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-20">Protocolos de Escala</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <PlanCard 
                            title="START" 
                            price="47" 
                            features={['Até 100 Clientes', 'Agenda Digital', 'Link Público', 'Suporte Padrão']} 
                            onSelect={onEnterSystem}
                        />
                        <PlanCard 
                            title="PRO" 
                            price="97" 
                            isPopular 
                            features={['Clientes Ilimitados', 'IA Carbon Basic', 'Módulo Financeiro', 'Portfólio Digital']} 
                            onSelect={onEnterSystem}
                        />
                        <PlanCard 
                            title="ELITE" 
                            price="147" 
                            features={['DRE Avançado', 'Carbon AI Pro', 'Multi-Unidades', 'Suporte VIP 24h']} 
                            onSelect={onEnterSystem}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 border-t border-white/5 bg-black/40 backdrop-blur-3xl relative z-10">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                            <Car className="text-white w-5 h-5" />
                        </div>
                        <span className="font-black text-xl uppercase italic tracking-tighter">CarbonCar</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        <a href="#" className="hover:text-red-500 transition-colors">Termos</a>
                        <a href="#" className="hover:text-red-500 transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-red-500 transition-colors">Contato</a>
                    </div>
                    <div className="text-right">
                         <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.3em]">Carbon Systems Aerospace-Level Management</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, description }: any) => (
    <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-red-600/30 transition-all group backdrop-blur-xl shadow-hero">
        <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 shadow-2xl">
            <Icon className="text-red-600 group-hover:text-white w-8 h-8 transition-colors" />
        </div>
        <h3 className="text-xl font-black mb-4 uppercase tracking-tighter text-white group-hover:text-red-500 transition-colors">{title}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed font-bold uppercase tracking-tight opacity-60 group-hover:opacity-100 transition-opacity">{description}</p>
    </div>
);

const PlanCard = ({ title, price, features, isPopular, onSelect }: any) => (
    <div className={cn(
        "p-10 rounded-[3rem] border flex flex-col items-center relative transition-all duration-700 backdrop-blur-3xl group shadow-hero",
        isPopular 
            ? 'bg-zinc-950/80 border-red-600 scale-105 z-10 shadow-glow-red' 
            : 'bg-black/40 border-white/5 hover:border-white/20'
    )}>
        {isPopular && (
            <div className="absolute -top-4 bg-white text-black text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-2xl">
                Configuração Elite
            </div>
        )}
        <h3 className="text-xl font-black mb-4 uppercase tracking-[0.4em] text-zinc-500">{title}</h3>
        <div className="flex items-baseline gap-2 mb-10">
            <span className="text-sm font-black text-zinc-700 uppercase tracking-widest">R$</span>
            <span className="text-6xl font-black text-white tabular-nums tracking-tighter italic">{price}</span>
            <span className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">/mês</span>
        </div>
        <ul className="space-y-5 w-full mb-12">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <Check className="text-red-500 w-4 h-4 flex-shrink-0" strokeWidth={4} />
                    {f}
                </li>
            ))}
        </ul>
        <button onClick={onSelect} className={cn(
            "w-full py-5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all active:scale-95 shadow-xl",
            isPopular 
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-glow-red' 
                : 'bg-white/5 hover:bg-white text-black'
        )}>
            Selecionar Protocolo
        </button>
    </div>
);
