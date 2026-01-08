
import React, { useState, useEffect } from 'react';
import { 
  Save, Store, LayoutGrid, Clock, ListPlus, Trash2, Edit2, Plus, Zap, Check, ShieldCheck, Gem, Sparkles, X, CreditCard, ChevronRight, Info, Building2, Image as ImageIcon, RefreshCw, MapPin
} from 'lucide-react';
import { BusinessModel, PlanType, BusinessSettings, ServiceItem, BillingCycle } from '../types';
import { PLAN_FEATURES } from '../constants';
import { cn } from '../lib/utils';

interface SettingsProps {
  businessModel: BusinessModel;
  currentPlan: PlanType;
  onUpgrade: (plan: PlanType) => void;
  settings: BusinessSettings;
  onUpdateSettings: (s: BusinessSettings) => void;
  services: ServiceItem[];
  onUpdateServices: (s: ServiceItem[]) => void;
  initialTab?: 'operacional' | 'servicos' | 'geral';
}

export const Settings: React.FC<SettingsProps> = ({ 
    currentPlan, onUpgrade, 
    settings, onUpdateSettings, services, onUpdateServices,
    initialTab = 'operacional'
}) => {
  const [activeTab, setActiveTab] = useState<'operacional' | 'servicos' | 'geral'>(initialTab);
  const [loading, setLoading] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(settings?.billingCycle || 'MONTHLY');

  // Estado local para permitir edição fluida (Draft State)
  const [localSettings, setLocalSettings] = useState<BusinessSettings>(settings);

  useEffect(() => {
      setLocalSettings(settings);
  }, [settings]);

  const [serviceForm, setServiceForm] = useState<Partial<ServiceItem>>({
      name: '', description: '', durationMinutes: 60, price: 0, 
      compatibleVehicles: ['CARRO', 'SUV'], active: true, allowsFixed: true
  });

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleSave = async () => {
    setLoading(true);
    try {
        await onUpdateSettings(localSettings);
    } catch (e) {
        alert('Erro ao salvar protocolo.');
    } finally {
        setLoading(false);
    }
  };

  const openServiceModal = (service?: ServiceItem) => {
      if (service) {
          setEditingService(service);
          setServiceForm(service);
      } else {
          setEditingService(null);
          setServiceForm({ 
            name: '', description: '', durationMinutes: 60, price: 0, 
            compatibleVehicles: ['CARRO', 'SUV'], active: true, allowsFixed: true 
          });
      }
      setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
      const finalService: ServiceItem = {
          id: editingService ? editingService.id : `s_${Date.now()}`,
          name: serviceForm.name || 'Novo Serviço',
          description: serviceForm.description || '',
          durationMinutes: Number(serviceForm.durationMinutes),
          price: Number(serviceForm.price),
          compatibleVehicles: serviceForm.compatibleVehicles || ['CARRO'],
          active: serviceForm.active ?? true,
          allowsFixed: true
      };
      
      if (editingService) {
        onUpdateServices(services.map(s => s.id === editingService.id ? finalService : s));
      } else {
        onUpdateServices([...services, finalService]);
      }
      setIsServiceModalOpen(false);
  };

  const getPriceWithDiscount = (plan: PlanType) => {
      const base = PLAN_FEATURES[plan].price;
      return billingCycle === 'ANNUAL' ? (base * 0.85).toFixed(2) : base.toFixed(2);
  };

  return (
    <div className="p-6 md:p-10 pb-32 animate-fade-in max-w-[1400px] mx-auto overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-4 tracking-tighter uppercase leading-none italic">
            <LayoutGrid className="text-red-600" size={28} />
            Central de Comando
          </h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Configurações globais do estúdio</p>
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 transition-all shadow-glow-red active:scale-95 group disabled:opacity-50">
          {loading ? <RefreshCw className="animate-spin" size={16}/> : <Save size={16} />} 
          <span className="italic">Consolidar Ajustes</span>
        </button>
      </div>

      <div className="flex gap-10 border-b border-white/5 mb-12 overflow-x-auto pb-px">
        <TabButton active={activeTab === 'operacional'} onClick={() => setActiveTab('operacional')} label="Regras de Box" icon={Clock} />
        <TabButton active={activeTab === 'servicos'} onClick={() => setActiveTab('servicos')} label="Menu de Serviços" icon={ListPlus} />
        <TabButton active={activeTab === 'geral'} onClick={() => setActiveTab('geral')} label="Protocolos & Assinatura" icon={Zap} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 space-y-8">
          
          {/* ABA OPERACIONAL */}
          {activeTab === 'operacional' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-6">
              <div className="bg-[#09090b] border border-white/10 rounded-[2.5rem] p-10 shadow-hero">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-4 uppercase tracking-tight"><Store size={20} className="text-red-600" /> Capacidade Operacional</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5">
                     <label className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Boxes Ativos</label>
                     <div className="flex items-center gap-6">
                       <button onClick={() => setLocalSettings({...localSettings, boxCapacity: Math.max(1, localSettings.boxCapacity - 1)})} className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">-</button>
                       <div className="flex-1 text-center font-bold text-4xl text-white tabular-nums tracking-tighter">{localSettings.boxCapacity}</div>
                       <button onClick={() => setLocalSettings({...localSettings, boxCapacity: localSettings.boxCapacity + 1})} className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold">+</button>
                     </div>
                   </div>
                   <div className="bg-zinc-950 p-6 rounded-3xl border border-white/5">
                     <label className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Intervalo de Grade</label>
                     <select className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-white font-bold text-sm outline-none" value={localSettings.slotIntervalMinutes} onChange={(e) => setLocalSettings({...localSettings, slotIntervalMinutes: Number(e.target.value)})}>
                         <option value={15}>15 MINUTOS</option>
                         <option value={30}>30 MINUTOS</option>
                         <option value={60}>60 MINUTOS</option>
                     </select>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA SERVIÇOS */}
          {activeTab === 'servicos' && (
              <div className="space-y-8 animate-in fade-in">
                  <div className="flex justify-between items-center px-2">
                      <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Catálogo de Serviços</h3>
                      <button onClick={() => openServiceModal()} className="bg-white text-black px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95">
                        <Plus size={16} /> Adicionar Serviço
                      </button>
                  </div>
                  <div className="grid gap-4">
                      {services.length === 0 ? (
                          <div className="py-20 text-center border border-dashed border-white/5 rounded-[2rem] opacity-30">Nenhum serviço cadastrado.</div>
                      ) : (
                          services.map(service => (
                            <div key={service.id} className="bg-[#09090b] border border-white/10 rounded-[2.5rem] p-8 flex justify-between items-center group transition-all hover:bg-zinc-950 shadow-hero hover:border-red-600/30">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-2xl text-white uppercase tracking-tighter group-hover:text-red-500 transition-colors italic">{service.name}</h4>
                                    <div className="flex items-center gap-6">
                                        <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"><Clock size={12}/> {service.durationMinutes} MIN</span>
                                        <span className="text-white text-sm font-bold tabular-nums">R$ {service.price.toLocaleString('pt-BR')}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => openServiceModal(service)} className="p-4 text-white bg-zinc-900 border border-white/5 hover:bg-white/10 rounded-2xl transition-all shadow-xl"><Edit2 size={16} /></button>
                                    <button onClick={() => onUpdateServices(services.filter(s => s.id !== service.id))} className="p-4 text-zinc-500 hover:text-red-500 bg-zinc-900 border border-white/5 hover:bg-red-900/10 rounded-2xl transition-all shadow-xl"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                      )}
                  </div>
              </div>
          )}

          {/* ABA GERAL (ASSINATURAS E PERFIL) */}
          {activeTab === 'geral' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-6">
              
              {/* Perfil da Estética */}
              <div className="bg-[#09090b] border border-white/10 rounded-[2.5rem] p-10 shadow-hero relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Building2 size={120} />
                </div>
                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4 uppercase tracking-tight italic">
                  <Store size={20} className="text-red-600" /> Identidade Operacional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Nome Comercial</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white outline-none focus:border-red-600 transition-all"
                      value={localSettings.businessName}
                      onChange={e => setLocalSettings({...localSettings, businessName: e.target.value})}
                      placeholder="NOME DA SUA ESTÉTICA"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Registro CNPJ</label>
                    <input 
                      type="text" 
                      className="w-full bg-zinc-950 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white outline-none focus:border-red-600 transition-all"
                      value={localSettings.cnpj || ''}
                      onChange={e => setLocalSettings({...localSettings, cnpj: e.target.value})}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Endereço Operacional (Exibido para Clientes)</label>
                    <div className="relative">
                        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                        <input 
                        type="text" 
                        className="w-full bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-5 py-4 text-[10px] font-bold uppercase text-white outline-none focus:border-red-600 transition-all"
                        value={localSettings.address || ''}
                        onChange={e => setLocalSettings({...localSettings, address: e.target.value})}
                        placeholder="RUA EXXEMPLO, 123 - ALPHAVILLE, SP"
                        />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Logo URL (Icone do App)</label>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-700 overflow-hidden">
                        {localSettings.profileImageUrl ? <img src={localSettings.profileImageUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} />}
                      </div>
                      <input 
                        type="url" 
                        className="flex-1 bg-zinc-950 border border-white/5 rounded-2xl px-5 py-4 text-[10px] font-bold text-white outline-none focus:border-red-600 transition-all"
                        value={localSettings.profileImageUrl || ''}
                        onChange={e => setLocalSettings({...localSettings, profileImageUrl: e.target.value})}
                        placeholder="https://suaimagem.com/logo.png"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de Planos e Assinatura */}
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 px-2">
                   <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">Protocolos de Assinatura</h3>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mt-2">Sua licença atual: {currentPlan}</p>
                   </div>
                   
                   <div className="bg-zinc-900 p-1 rounded-2xl border border-white/5 flex items-center gap-2">
                      <button 
                        onClick={() => setBillingCycle('MONTHLY')}
                        className={cn("px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all", billingCycle === 'MONTHLY' ? "bg-white/10 text-white shadow-xl" : "text-zinc-600 hover:text-white")}
                      >MENSAL</button>
                      <button 
                        onClick={() => setBillingCycle('ANNUAL')}
                        className={cn("px-6 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2", billingCycle === 'ANNUAL' ? "bg-red-600 text-white shadow-glow-red" : "text-zinc-600 hover:text-white")}
                      >ANUAL <span className="text-[7px] bg-black/20 px-1.5 py-0.5 rounded">-15%</span></button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {(Object.keys(PlanType) as PlanType[]).map((plan) => {
                      const active = currentPlan === plan;
                      const features = PLAN_FEATURES[plan].features;
                      const price = getPriceWithDiscount(plan);

                      return (
                        <div key={plan} className={cn(
                          "p-8 rounded-[2.5rem] border flex flex-col transition-all duration-700 relative overflow-hidden group",
                          active ? "bg-zinc-900 border-red-600 shadow-glow-red" : "bg-zinc-950/50 border-white/5 hover:border-white/10"
                        )}>
                          <div className="mb-8">
                             <div className="flex justify-between items-start">
                                <span className={cn("text-[9px] font-black uppercase tracking-[0.4em]", active ? "text-red-500" : "text-zinc-600")}>{plan}</span>
                                {active && <ShieldCheck size={16} className="text-red-500" />}
                             </div>
                             <div className="flex items-baseline gap-1 mt-4">
                                <span className="text-sm font-bold text-zinc-700">R$</span>
                                <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums">{price}</h4>
                                <span className="text-xs text-zinc-600 font-bold">/mês</span>
                             </div>
                          </div>

                          <ul className="space-y-4 mb-10 flex-1">
                            {features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-center gap-3 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                <Check size={12} className={active ? "text-red-600" : "text-zinc-700"} />
                                {f}
                              </li>
                            ))}
                          </ul>

                          <button 
                            onClick={() => onUpgrade(plan)}
                            disabled={active}
                            className={cn(
                              "w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-2",
                              active ? "bg-white/5 text-zinc-500 cursor-default" : "bg-white text-black hover:bg-zinc-200"
                            )}
                          >
                            {active ? 'Protocolo Ativo' : `Mudar para ${plan}`} <ChevronRight size={12} />
                          </button>
                        </div>
                      );
                   })}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Modal de Serviço */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#09090b]">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter italic">
                    {editingService ? 'Editar Protocolo' : 'Novo Protocolo Operacional'}
                </h2>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Definição de Parâmetros de Box</p>
              </div>
              <button onClick={() => setIsServiceModalOpen(false)} className="p-3 text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6">
                <div className="space-y-4">
                    <input type="text" placeholder="NOME DO SERVIÇO (EX: LAVAGEM DETALHADA)" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold uppercase text-white outline-none focus:border-red-600 transition-all" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} />
                    <textarea placeholder="DESCRIÇÃO TÉCNICA" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[11px] font-bold uppercase text-white outline-none h-24 resize-none focus:border-red-600 transition-all" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-600 uppercase ml-2">Duração (Minutos)</label>
                            <input type="number" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-red-600 transition-all" value={serviceForm.durationMinutes} onChange={e => setServiceForm({...serviceForm, durationMinutes: Number(e.target.value)})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-600 uppercase ml-2">Preço Sugerido (R$)</label>
                            <input type="number" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:border-red-600 transition-all" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: Number(e.target.value)})} />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button onClick={() => setIsServiceModalOpen(false)} className="flex-1 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Abortar</button>
                    <button onClick={handleSaveService} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-glow-red transition-all flex items-center justify-center gap-3">
                        <Save size={18} /> Salvar Serviço
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, label, icon: Icon }: { active: boolean, onClick: () => void, label: string, icon: any }) => (
    <button onClick={onClick} className={`flex items-center gap-3 px-6 py-6 border-b-2 text-[10px] font-bold uppercase tracking-[0.4em] transition-all whitespace-nowrap group ${active ? 'border-red-600 text-white' : 'border-transparent text-zinc-600 hover:text-zinc-400 hover:border-white/10'}`}>
        <Icon size={18} className={cn("transition-all", active ? 'text-red-600 drop-shadow-glow-red' : 'text-zinc-700 group-hover:text-zinc-500')} />
        {label}
    </button>
);
