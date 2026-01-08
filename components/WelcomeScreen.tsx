
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Lock, Car, ChevronRight, Activity, Cpu, Globe, Terminal, Shield, UserPlus, LogIn, ChevronLeft, ShieldAlert } from 'lucide-react';
import { BusinessModel } from '../types';
import { cn } from '../lib/utils';

interface WelcomeScreenProps {
  onSelectFlow: (role: 'CLIENT' | 'ADMIN', model: BusinessModel, mode: 'LOGIN' | 'REGISTER') => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectFlow }) => {
  const [booting, setBooting] = useState(true);
  const [view, setView] = useState<'INITIAL' | 'CLIENT_OPTIONS'>('INITIAL');

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-red-900">
      
      {/* HUD Background Layers */}
      <div className="absolute inset-0 scanner-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-red-900/5 via-transparent to-transparent opacity-50" />
      
      {/* Admin Access - Portal Secreto */}
      <div className="absolute top-8 right-8 flex items-center gap-6 z-50">
          <div className="flex flex-col items-end gap-0.5 opacity-30">
            <span className="text-[6px] font-black uppercase tracking-[0.4em] text-zinc-500">Security Layer</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[8px] font-bold text-white uppercase tracking-widest">ENCRYPTED PORTAL</span>
            </div>
          </div>
          <button 
            onClick={() => onSelectFlow('ADMIN', 'FIXED', 'LOGIN')}
            className="group relative p-4 rounded-2xl border border-white/5 bg-white/5 text-zinc-700 hover:text-red-500 hover:border-red-600/30 hover:bg-red-600/5 transition-all opacity-40 hover:opacity-100 shadow-2xl overflow-hidden"
            title="Acesso Administrador"
          >
            <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors" />
            <Lock size={14} className="group-hover:scale-110 transition-transform relative z-10" />
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
          </button>
      </div>

      <div className={cn(
        "relative z-10 w-full max-w-2xl flex flex-col items-center transition-all duration-1000",
        booting ? "opacity-0 scale-95 blur-xl" : "opacity-100 scale-100 blur-0"
      )}>
        
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl mb-8 shadow-2xl">
            <Cpu size={10} className="text-red-600 animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-[0.5em] text-zinc-500">Operating Intelligence</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-3 uppercase leading-none italic drop-shadow-2xl">
            Carbon<span className="text-red-600">Car</span>
          </h1>
          <p className="text-zinc-700 text-[8px] font-black tracking-[0.6em] uppercase opacity-60">
            Aerospace-Grade Auto Management
          </p>
        </div>

        {/* Dynamic Action Container */}
        <div className="w-full max-w-sm relative h-64">
          {view === 'INITIAL' ? (
            <button 
                onClick={() => setView('CLIENT_OPTIONS')}
                className="group relative w-full h-52 rounded-[2.5rem] overflow-hidden bg-zinc-950/80 border border-white/5 hover:border-red-600/30 transition-all duration-700 shadow-hero backdrop-blur-xl animate-in fade-in zoom-in"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=2069&auto=format&fit=crop')] bg-cover opacity-[0.03] grayscale group-hover:grayscale-0 group-hover:opacity-[0.08] transition-all duration-1000 scale-105" />
                <div className="relative h-full p-10 flex flex-col justify-between items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-700 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                    <Car size={20} />
                </div>
                <div>
                    <p className="text-red-600 text-[8px] font-black uppercase tracking-[0.5em] mb-2 opacity-60">Portal Concierge</p>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-red-500 transition-colors">Agendar Protocolo</h2>
                    <div className="flex items-center justify-center gap-2 text-zinc-600 text-[8px] font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                    Identificar Ativo <ChevronRight size={10} />
                    </div>
                </div>
                </div>
            </button>
          ) : (
            <div className="w-full space-y-3 animate-in slide-in-from-bottom-4 duration-500">
                <button 
                    onClick={() => onSelectFlow('CLIENT', 'FIXED', 'LOGIN')}
                    className="w-full p-6 bg-white hover:bg-zinc-200 rounded-[2rem] flex items-center justify-between group transition-all shadow-glow active:scale-[0.98]"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center"><LogIn size={18} /></div>
                        <div className="text-left">
                            <span className="text-[10px] font-black text-black/40 uppercase tracking-widest block leading-none">Bem-vindo de volta</span>
                            <span className="text-lg font-black text-black uppercase tracking-tighter leading-none">Entrar no Hangar</span>
                        </div>
                    </div>
                    <ChevronRight className="text-black/20 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button 
                    onClick={() => onSelectFlow('CLIENT', 'FIXED', 'REGISTER')}
                    className="w-full p-6 bg-zinc-950/80 border border-white/10 hover:border-red-600/30 rounded-[2rem] flex items-center justify-between group transition-all shadow-hero active:scale-[0.98] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 border border-red-600/20 flex items-center justify-center"><UserPlus size={18} /></div>
                        <div className="text-left">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block leading-none">Novo no sistema?</span>
                            <span className="text-lg font-black text-white uppercase tracking-tighter leading-none">Registrar Conta</span>
                        </div>
                    </div>
                    <ChevronRight className="text-zinc-800 group-hover:translate-x-1 transition-transform" />
                </button>

                <button onClick={() => setView('INITIAL')} className="w-full py-4 text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-[0.4em] flex items-center justify-center gap-2 transition-colors">
                    <ChevronLeft size={14} /> Voltar
                </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-10 flex flex-col items-center gap-3 opacity-[0.08]">
        <p className="text-white text-[6px] tracking-[0.8em] font-black uppercase italic">Carbon Systems Aerospace Engineering</p>
        <div className="flex gap-4 text-[5px] font-bold text-white uppercase tracking-[0.4em]">
          <span>© 2025 CARBON-CORP</span>
          <span className="text-red-900">•</span>
          <span>SYSTEM UPTIME: 99.99%</span>
        </div>
      </div>
    </div>
  );
};
