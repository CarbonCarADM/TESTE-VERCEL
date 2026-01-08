
import React, { useState } from 'react';
import { Search, Plus, User, Car, Phone, Mail, ChevronRight, X, Save, Trash2, History, Gift, Zap, ShieldCheck } from 'lucide-react';
import { Customer, BusinessSettings } from '../types';
import { cn } from '../lib/utils';

interface CRMProps {
  customers: Customer[];
  onAddCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  businessSettings: BusinessSettings;
  onUpdateSettings: (s: BusinessSettings) => void;
}

export const CRM: React.FC<CRMProps> = ({ customers, onAddCustomer, onDeleteCustomer, businessSettings, onUpdateSettings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehiclePlate: ''
  });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.vehicles.some(v => v.plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCustomerStatus = (customer: Customer) => {
      if ((customer.washes || 0) >= 10) return { label: 'VIP ELITE', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
      if (customer.lastVisit === 'Nunca') return { label: 'NOVO', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
      return { label: 'ATIVO', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: `c_${Date.now()}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      totalSpent: 0,
      lastVisit: 'Nunca',
      vehicles: [
        {
          id: `v_${Date.now()}`,
          brand: newCustomer.vehicleBrand,
          model: newCustomer.vehicleModel,
          plate: newCustomer.vehiclePlate.toUpperCase(),
          color: 'A definir',
          type: 'CARRO'
        }
      ],
      washes: 0
    };

    onAddCustomer(customer);
    setIsModalOpen(false);
    setNewCustomer({ name: '', phone: '', email: '', vehicleBrand: '', vehicleModel: '', vehiclePlate: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      onDeleteCustomer(id);
    }
  };

  const toggleLoyalty = () => {
    onUpdateSettings({
      ...businessSettings,
      loyaltyProgramEnabled: !businessSettings.loyaltyProgramEnabled
    });
  };

  return (
    <div className="p-6 md:p-10 pb-24 animate-fade-in space-y-8">
      {/* Header Operational */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-3 leading-none">
            <User className="text-red-600" /> Base de Clientes
          </h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">Inteligência de Ativos e Fidelização</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Card de Controle de Fidelidade */}
          <div className={cn(
            "p-1.5 rounded-2xl border transition-all duration-500 flex items-center gap-4 bg-zinc-950",
            businessSettings.loyaltyProgramEnabled ? "border-yellow-500/30 shadow-glow" : "border-white/5"
          )}>
            <div className="flex items-center gap-3 px-3">
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                businessSettings.loyaltyProgramEnabled ? "bg-yellow-500 text-black" : "bg-zinc-900 text-zinc-600"
              )}>
                <Gift size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Programa Fidelidade</span>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-tighter",
                  businessSettings.loyaltyProgramEnabled ? "text-yellow-500" : "text-zinc-600"
                )}>
                  {businessSettings.loyaltyProgramEnabled ? "Ativado" : "Desativado"}
                </span>
              </div>
            </div>
            <button 
              onClick={toggleLoyalty}
              className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-500 relative",
                businessSettings.loyaltyProgramEnabled ? "bg-yellow-600" : "bg-zinc-800"
              )}
            >
              <div className={cn(
                "w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-xl",
                businessSettings.loyaltyProgramEnabled ? "translate-x-6" : "translate-x-0"
              )} />
            </button>
          </div>

          <div className="h-10 w-px bg-white/5 mx-2 hidden lg:block" />

          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Localizar Ativo (Nome ou Placa)..." 
              className="w-full bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-[10px] font-bold uppercase tracking-widest text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-700 shadow-2xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-black px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Registrar Cliente
          </button>
        </div>
      </div>

      {/* Grid de Ativos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCustomers.length === 0 ? (
           <div className="col-span-full py-40 bg-zinc-950/20 rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center opacity-40">
             <User className="w-16 h-16 text-zinc-800 mb-6" />
             <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Nenhum ativo localizado na base</p>
           </div>
        ) : (
          filteredCustomers.map(c => {
            const status = getCustomerStatus(c);
            const washes = c.washes || 0;
            const progress = Math.min(100, (washes / 10) * 100);

            return (
                <div key={c.id} className="bg-[#09090b] rounded-[2.5rem] border border-white/10 p-8 hover:border-red-600/30 transition-all group relative overflow-hidden shadow-hero">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    {/* Perfil */}
                    <div className="flex flex-col items-center text-center space-y-4 min-w-[140px]">
                      <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-white/10 flex items-center justify-center text-2xl font-black text-white group-hover:text-red-500 transition-colors shadow-2xl">
                          {c.name.charAt(0)}
                      </div>
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1.5 rounded-xl border tracking-widest uppercase",
                        status.color
                      )}>
                        {status.label}
                      </span>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white tracking-tight leading-none mb-2 uppercase">{c.name}</h3>
                          <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                             <span className="flex items-center gap-2"><Phone size={12} className="text-red-600" /> {c.phone}</span>
                             <span className="flex items-center gap-2"><Mail size={12} className="text-red-600" /> {c.email}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">LTV Nominal</p>
                          <p className="text-xl font-black text-white tabular-nums tracking-tighter">R$ {c.totalSpent.toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Timeline de Fidelidade */}
                      {businessSettings.loyaltyProgramEnabled && (
                        <div className="bg-zinc-950/50 p-4 rounded-2xl border border-white/5 space-y-3">
                           <div className="flex justify-between items-end">
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={10} className="text-yellow-500" /> Ciclo de Fidelização
                              </span>
                              <span className="text-[10px] font-bold text-white tabular-nums">{washes}/10 Lavagens</span>
                           </div>
                           <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                              <div className={cn(
                                "h-full transition-all duration-1000",
                                washes >= 10 ? "bg-yellow-500 shadow-glow" : "bg-red-600 shadow-glow-red"
                              )} style={{ width: `${progress}%` }} />
                           </div>
                           {washes >= 10 && (
                             <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest text-center animate-pulse">Lavagem VIP Pronta para Resgate</p>
                           )}
                        </div>
                      )}

                      <div className="space-y-3">
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em]">Hangar do Ativo</p>
                        <div className="flex flex-wrap gap-3">
                            {c.vehicles.map(v => (
                            <div key={v.id} className="flex items-center gap-3 bg-zinc-950 border border-white/5 rounded-2xl px-4 py-2 hover:border-white/20 transition-colors shadow-2xl">
                                <Car size={16} className="text-red-600" />
                                <div>
                                  <p className="text-white text-[10px] font-bold uppercase tracking-tight">{v.brand} {v.model}</p>
                                  <p className="text-red-500 text-[9px] font-black uppercase tracking-widest">{v.plate}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                          <button onClick={() => handleDelete(c.id)} className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-900/10 rounded-xl transition-all"><Trash2 size={18} /></button>
                          <button onClick={() => setSelectedCustomer(c)} className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white transition-all">Atividades <History size={14}/></button>
                      </div>
                    </div>
                  </div>
                </div>
            )
          })
        )}
      </div>

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
            <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#09090b]">
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Novo Registro de Ativo</h2>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Cadastro de Propriedade e Contato</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Identificação Pessoal</label>
                <input required type="text" placeholder="NOME COMPLETO" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="WHATSAPP / CEL" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} />
                  <input type="email" placeholder="EMAIL DE CONTATO" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.email} onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <label className="block text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Ativo Principal</label>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="MARCA" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.vehicleBrand} onChange={e => setNewCustomer({...newCustomer, vehicleBrand: e.target.value})} />
                  <input required type="text" placeholder="MODELO" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.vehicleModel} onChange={e => setNewCustomer({...newCustomer, vehicleModel: e.target.value})} />
                </div>
                <input required type="text" placeholder="PLACA (BRA-2E19)" className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-5 py-4 text-[10px] font-bold uppercase text-white focus:border-red-600 outline-none transition-all" value={newCustomer.vehiclePlate} onChange={e => setNewCustomer({...newCustomer, vehiclePlate: e.target.value})} />
              </div>

              <div className="pt-8 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">Abortar</button>
                <button type="submit" className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-glow-red transition-all flex items-center justify-center gap-3">
                  <Save size={18} /> Consolidar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Histórico */}
      {selectedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] w-full max-w-2xl shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
                  <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#09090b]">
                      <div>
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{selectedCustomer.name}</h2>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Dossiê de Interações</p>
                      </div>
                      <button onClick={() => setSelectedCustomer(null)} className="p-3 bg-zinc-900 rounded-full text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                      </button>
                  </div>
                  <div className="p-8">
                      <div className="grid grid-cols-2 gap-6 mb-10">
                          <div className="bg-zinc-950 p-6 rounded-[2rem] border border-white/5">
                              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-2">Valor Acumulado</p>
                              <p className="text-3xl font-black text-white tabular-nums tracking-tighter">R$ {selectedCustomer.totalSpent.toFixed(2)}</p>
                          </div>
                          <div className="bg-zinc-900 p-6 rounded-[2rem] border border-white/5">
                              <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mb-2">Último Protocolo</p>
                              <p className="text-white font-bold text-lg uppercase">{selectedCustomer.lastVisit}</p>
                          </div>
                      </div>
                      <h3 className="font-bold text-white mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] opacity-40"><History size={16}/> Linha do Tempo</h3>
                      <div className="space-y-6 border-l border-white/5 pl-8 ml-3">
                          {selectedCustomer.lastVisit !== 'Nunca' ? (
                               <div className="relative">
                                  <div className="absolute -left-[37px] top-1 w-2.5 h-2.5 bg-green-500 rounded-full shadow-glow-green animate-pulse"></div>
                                  <p className="text-white font-bold text-sm uppercase tracking-tight">Serviço Consolidado em {selectedCustomer.lastVisit}</p>
                                  <p className="text-[11px] text-zinc-500 mt-1">Operação concluída com sucesso no sistema CarbonCar.</p>
                               </div>
                          ) : (
                              <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] py-10 text-center border border-dashed border-white/5 rounded-3xl">Nenhum registro tático</p>
                          )}
                      </div>
                  </div>
                  <div className="p-8 border-t border-white/5 text-right bg-[#09090b]">
                      <button onClick={() => setSelectedCustomer(null)} className="px-8 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all">Fechar Dossiê</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
