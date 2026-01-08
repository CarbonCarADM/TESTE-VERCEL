
import React, { useState, useEffect, useMemo } from 'react';
import { X, Save, Calendar as CalendarIcon, Clock, User, Store, AlertOctagon, Search, Boxes, MessageSquare, LayoutPanelLeft, UserPlus } from 'lucide-react';
import { Appointment, AppointmentStatus, ServiceType, Customer, Vehicle, BusinessModel, BusinessSettings } from '../types';
import { cn } from '../lib/utils';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment, newCustomer?: Customer) => void;
  customers: Customer[];
  businessModel: BusinessModel;
  existingAppointments?: Appointment[];
  settings: BusinessSettings;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ 
    isOpen, onClose, onSave, customers, existingAppointments = [], settings 
}) => {
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [conflictError, setConflictError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    serviceType: ServiceType.LAVAGEM_SIMPLES,
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    durationMinutes: 60,
    boxId: 1,
    price: 60,
    observation: ''
  });

  const [newCustomerData, setNewCustomerData] = useState({
      name: '', phone: '', vehicleBrand: '', vehicleModel: '', vehiclePlate: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setSelectedCustomer(null);
      setIsNewCustomer(false);
      setConflictError(null);
      setNewCustomerData({ name: '', phone: '', vehicleBrand: '', vehicleModel: '', vehiclePlate: '' });
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalCustomerId = selectedCustomer?.id || '';
    let finalVehicleId = selectedVehicle?.id || '';
    let newlyCreatedCustomer: Customer | undefined;

    if (isNewCustomer) {
        if (!newCustomerData.name || !newCustomerData.phone) return alert("Preencha os dados do novo cliente.");
        const customerId = `c_new_${Date.now()}`;
        const vehicleId = `v_new_${Date.now()}`;
        
        newlyCreatedCustomer = {
            id: customerId,
            name: newCustomerData.name,
            phone: newCustomerData.phone,
            email: '',
            totalSpent: 0,
            lastVisit: formData.date,
            vehicles: [{
                id: vehicleId,
                brand: newCustomerData.vehicleBrand,
                model: newCustomerData.vehicleModel,
                plate: newCustomerData.vehiclePlate.toUpperCase(),
                color: 'A definir',
                type: 'CARRO'
            }]
        };
        finalCustomerId = customerId;
        finalVehicleId = vehicleId;
    }

    if (!finalCustomerId) return alert("Selecione ou cadastre um cliente.");

    const newAppointment: Appointment = {
      id: `new_${Date.now()}`,
      customerId: finalCustomerId,
      vehicleId: finalVehicleId,
      boxId: formData.boxId,
      serviceType: formData.serviceType,
      date: formData.date,
      time: formData.time,
      durationMinutes: formData.durationMinutes,
      price: Number(formData.price),
      status: AppointmentStatus.NOVO,
      observation: formData.observation
    };

    onSave(newAppointment, newlyCreatedCustomer);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="bg-[#0c0c0c] border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[95vh] overflow-hidden">
        <div className="flex justify-between items-center p-8 border-b border-white/5 bg-[#09090b]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 tracking-tighter uppercase italic">
               <Store className="text-red-600" /> Agendamento Nominal
            </h2>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-1">Alocação Tática de Box</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Identificação */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <User size={14} className="text-red-600" />
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Identidade do Ativo</span>
                        </div>
                        <button type="button" onClick={() => setIsNewCustomer(!isNewCustomer)} className={cn(
                            "px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all",
                            isNewCustomer ? "bg-red-600 text-white border-red-600" : "bg-white/5 text-zinc-500 border-white/5 hover:text-white"
                        )}>
                           {isNewCustomer ? "Voltar à Seleção" : "+ Novo Cliente"}
                        </button>
                    </div>

                    {!isNewCustomer ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-left-4">
                            <select required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-sm text-white outline-none" value={selectedCustomer?.id || ''} onChange={e => {
                                const c = customers.find(cust => cust.id === e.target.value);
                                setSelectedCustomer(c || null);
                                if (c && c.vehicles.length > 0) setSelectedVehicle(c.vehicles[0]);
                            }}>
                                <option value="">Vincular Cliente da Base</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {selectedCustomer && (
                                <select required className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-sm text-white outline-none" value={selectedVehicle?.id || ''} onChange={e => setSelectedVehicle(selectedCustomer.vehicles.find(v => v.id === e.target.value) || null)}>
                                    {selectedCustomer.vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.plate})</option>)}
                                </select>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-right-4">
                            <input type="text" placeholder="NOME DO CLIENTE" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase outline-none focus:border-red-600" value={newCustomerData.name} onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})} />
                            <input type="text" placeholder="WHATSAPP / CEL" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase outline-none focus:border-red-600" value={newCustomerData.phone} onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})} />
                            <input type="text" placeholder="PLACA DO VEÍCULO" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase outline-none focus:border-red-600" value={newCustomerData.vehiclePlate} onChange={e => setNewCustomerData({...newCustomerData, vehiclePlate: e.target.value})} />
                            <div className="grid grid-cols-2 gap-2">
                                <input type="text" placeholder="MARCA" className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase outline-none" value={newCustomerData.vehicleBrand} onChange={e => setNewCustomerData({...newCustomerData, vehicleBrand: e.target.value})} />
                                <input type="text" placeholder="MODELO" className="bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase outline-none" value={newCustomerData.vehicleModel} onChange={e => setNewCustomerData({...newCustomerData, vehicleModel: e.target.value})} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Parâmetros de Box */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Boxes size={14} className="text-red-600" />
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Alocação de Recurso</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: settings.boxCapacity }, (_, i) => i + 1).map(num => (
                            <button key={num} type="button" onClick={() => setFormData({...formData, boxId: num})} className={cn(
                                "py-4 rounded-2xl border text-[10px] font-bold uppercase transition-all",
                                formData.boxId === num ? "bg-red-600 border-red-600 text-white shadow-glow-red" : "bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/10"
                            )}>BOX {num}</button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input type="date" className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-sm text-white outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                        <input type="time" className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-4 text-sm text-white outline-none" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Protocolo de Serviço</label>
                    <select className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase" value={formData.serviceType} onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}>
                        {Object.values(ServiceType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Precificação (R$)</label>
                    <input type="number" className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-sm font-bold text-white tabular-nums" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-4">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-2">Briefing de Pátio</label>
                    <textarea className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-4 text-[10px] font-bold text-white uppercase h-14 resize-none" placeholder="AVARIAS, RODAS, DETALHES..." value={formData.observation} onChange={e => setFormData({...formData, observation: e.target.value})} />
                </div>
            </div>

            <div className="pt-8 flex justify-end gap-6 border-t border-white/5">
                <button type="button" onClick={onClose} className="px-8 py-2 text-[10px] font-bold text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">Abortar Operação</button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-glow-red flex items-center gap-4 transition-all active:scale-95">
                    <Save size={18} /> Consolidar Agendamento
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
