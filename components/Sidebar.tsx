
import React from 'react';
import { LayoutDashboard, Calendar, Users, Settings, BarChart3, Zap, X, Store, Lock, Megaphone, LogOut } from 'lucide-react';
import { PlanType, BusinessModel } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentPlan: PlanType;
  businessModel: BusinessModel;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onLogout?: () => void; 
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentPlan, 
  isOpen, 
  onClose,
  onUpgrade,
  onLogout
}) => {
  
  const isLocked = (minPlan?: PlanType) => {
    if (!minPlan) return false;
    if (minPlan === PlanType.PRO && currentPlan === PlanType.START) return true;
    if (minPlan === PlanType.ELITE && currentPlan !== PlanType.ELITE) return true;
    return false;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'schedule', label: 'Agenda & Boxes', icon: Calendar },
    { id: 'crm', label: 'Clientes', icon: Users },
    { id: 'marketing', label: 'Reputação', icon: Megaphone, minPlan: PlanType.PRO },
    { id: 'finance', label: 'Financeiro', icon: BarChart3, minPlan: PlanType.ELITE },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    onClose(); 
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-72 bg-[#09090b]/90 backdrop-blur-xl border-r border-white/5 flex flex-col 
      transform transition-transform duration-500 ease-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
      md:translate-x-0 md:static shadow-2xl md:shadow-none
    `}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-glow">
            <Store className="text-white w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight leading-none">CarbonCar</h1>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-bold mt-1">
                {currentPlan} OS
            </p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden text-white/40 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const locked = isLocked(item.minPlan);
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => !locked && handleTabClick(item.id)}
              disabled={locked}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 group relative overflow-hidden
                ${active 
                  ? 'text-white' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'}
                ${locked ? 'opacity-40 cursor-not-allowed hover:bg-transparent' : ''}
              `}
            >
              {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-transparent border-l-2 border-red-600/80" />
              )}
              
              <div className="flex items-center gap-3 relative z-10">
                <item.icon size={16} className={active ? 'text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'text-white/40 group-hover:text-white transition-colors'} />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {locked && <Lock size={10} className="text-white/20" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#121212] to-[#0a0a0a] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-2 relative z-10">
                <Zap className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-bold text-white/80 tracking-wider">INTELIGÊNCIA</span>
            </div>
            
            <p className="text-[10px] text-white/40 leading-relaxed mb-4 relative z-10">
            {currentPlan === PlanType.ELITE 
                ? "Análise de dados em tempo real ativa." 
                : "Desbloqueie insights de IA para maximizar sua receita."}
            </p>
            
            {currentPlan !== PlanType.ELITE && (
                <button 
                    onClick={onUpgrade}
                    className="w-full py-2.5 bg-white/5 hover:bg-red-900/20 border border-white/10 hover:border-red-900/30 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all group-hover:shadow-glow"
                >
                    Upgrade de Plano
                </button>
            )}
        </div>
      </div>

      <div className="p-6 border-t border-white/5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white/60">AD</span>
            </div>
            <div>
                <p className="text-xs text-white font-bold">Admin</p>
                <p className="text-[10px] text-white/30">Gerente de Estúdio</p>
            </div>
            </div>
            
            {onLogout && (
                <button 
                    onClick={onLogout}
                    className="p-2 text-white/20 hover:text-red-500 hover:bg-red-900/10 rounded-lg transition-colors"
                    title="Sair"
                >
                    <LogOut size={16} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
