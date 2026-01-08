
import React, { useState, useMemo } from 'react';
import { AppointmentStatus, Appointment, Customer, BusinessModel, PlanType, BusinessSettings } from '../types';
import { MapPin, CheckCircle2, XCircle, User, Play, Check, Store, Clock, Calendar, ChevronLeft, ChevronRight, History, CalendarDays, Navigation, Truck, Plus, Search } from 'lucide-react';
import { NewAppointmentModal } from './NewAppointmentModal';
import { cn } from '../lib/utils';

interface ScheduleProps {
  appointments: Appointment[];
  customers: Customer[];
  onAddAppointment: (appointment: Appointment) => void;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  businessModel: BusinessModel;
  currentPlan?: PlanType; 
  onUpgrade: () => void;
  settings: BusinessSettings;
}

export const Schedule: React.FC<ScheduleProps> = ({ 
  appointments, 
  customers, 
  onAddAppointment, 
  onUpdateStatus, 
  businessModel, 
  currentPlan = PlanType.PRO, 
  onUpgrade, 
  settings 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'AGENDA' | 'HISTORY'>('AGENDA');

  // Filtro estrito baseado no BusinessModel
  const filteredByModel = useMemo(() => {
    return appointments.filter(a => {
        const isAptDelivery = !!a.isDelivery;
        return businessModel === 'FIXED' ? !isAptDelivery : isAptDelivery;
    });
  }, [appointments, businessModel]);

  const agendaAppointments = filteredByModel.filter(a => 
    a.date === selectedDate && 
    a.status !== AppointmentStatus.CANCELADO && 
    a.status !== AppointmentStatus.FINALIZADO
  ).sort((a, b) => a.time.localeCompare(b.time));
  
  const historyAppointments = filteredByModel
    .filter(a => a.status === AppointmentStatus.FINALIZADO || a.status === AppointmentStatus.CANCELADO)
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

  const activeList = viewMode === 'AGENDA' ? agendaAppointments : historyAppointments;

  const changeDate = (days: number) => {
      const d = new Date(selectedDate + 'T12:00:00');
      d.setDate(d.getDate() + days);
      setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="p-6 md:p-10 pb-32 animate-fade-in space-y-8 max-w-[1600px] mx-auto">
      {/* Header Tático */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tighter flex items-center gap-4 leading-none italic">
            {businessModel === 'FIXED' ? <Store className="text-red-600" /> : <Truck className="text-red-600" />}
            {businessModel === 'FIXED' ? 'Agenda de Estúdio' : 'Logística Delivery'}
          </h2>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
            {businessModel === 'FIXED' ? 'Controle de Fluxo de Boxes e Pátio' : 'Gestão de Rotas e Atendimento Externo'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex p-1 bg-zinc-950 border border-white/5 rounded-2xl shadow-2xl">
                <button 
                    onClick={() => setViewMode('AGENDA')}
                    className={cn(
                        "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        viewMode === 'AGENDA' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-white"
                    )}
                >
                    Fila Ativa
                </button>
                <button 
                    onClick={() => setViewMode('HISTORY')}
                    className={cn(
                        "px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                        viewMode === 'HISTORY' ? "bg-white/10 text-white" : "text-zinc-600 hover:text-white"
                    )}
                >
                    Histórico
                </button>
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all shadow-glow-red active:scale-95"
            >
                <Plus size={16} strokeWidth={3} /> {businessModel === 'FIXED' ? 'Novo Box' : 'Nova Rota'}
            </button>
        </div>
      </div>

      {/* Seletor de Data Hud */}
      {viewMode === 'AGENDA' && (
        <div className="flex items-center justify-center gap-6 bg-zinc-950 p-4 rounded-[2rem] border border-white/5 shadow-2xl">
            <button onClick={() => changeDate(-1)} className="p-3 bg-zinc-900 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><ChevronLeft size={20}/></button>
            <div className="flex flex-col items-center min-w-[200px]">
                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-1">Status Operacional</span>
                <span className="text-xl font-black text-white uppercase tracking-tighter tabular-nums">{selectedDate.split('-').reverse().join('/')}</span>
            </div>
            <button onClick={() => changeDate(1)} className="p-3 bg-zinc-900 hover:bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><ChevronRight size={20}/></button>
        </div>
      )}

      {/* Lista de Ativos */}
      <div className="grid grid-cols-1 gap-4">
        {activeList.length === 0 ? (
            <div className="py-40 bg-zinc-950/20 rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center opacity-40">
                <Calendar className="w-16 h-16 text-zinc-800 mb-6" />
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">Nenhuma operação registrada para este período</p>
            </div>
        ) : (
            activeList.map(apt => (
                <div 
                    key={apt.id} 
                    className={cn(
                        "bg-[#09090b] rounded-[2.5rem] border transition-all duration-700 group overflow-hidden shadow-hero flex flex-col md:flex-row items-stretch",
                        apt.status === AppointmentStatus.EM_EXECUCAO ? "border-red-600/50 bg-[#0c0c0c]" : "border-white/5 hover:border-white/10"
                    )}
                >
                    <div className="flex flex-col items-center justify-center p-8 min-w-[140px] bg-zinc-950 border-r border-white/5">
                        <span className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-2">Início</span>
                        <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{apt.time}</span>
                        <div className="mt-3 flex items-center gap-1.5 opacity-40">
                            <Clock size={10} />
                            <span className="text-[9px] font-bold">{apt.durationMinutes}m</span>
                        </div>
                    </div>

                    <div className="flex-1 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "text-[8px] font-black px-3 py-1 rounded-full border uppercase tracking-widest",
                                    apt.status === AppointmentStatus.EM_EXECUCAO ? "bg-red-600 text-white border-red-600 shadow-glow-red" : "bg-zinc-900 text-zinc-500 border-white/5"
                                )}>
                                    {apt.status}
                                </span>
                                {apt.boxId && (
                                    <span className="text-[8px] font-black bg-white/5 text-white/40 px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">Box {apt.boxId}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-2 group-hover:text-red-500 transition-colors truncate">
                                    {apt.serviceType}
                                </h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <span className="flex items-center gap-2 text-white/80"><User size={12} className="text-red-600"/> {customers.find(c => c.id === apt.customerId)?.name || 'Cliente'}</span>
                                    {apt.isDelivery && apt.address && (
                                        <span className="flex items-center gap-2 text-orange-500/80"><MapPin size={12}/> {apt.address}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 min-w-[200px]">
                            {viewMode === 'AGENDA' && (
                                <>
                                    {apt.status === AppointmentStatus.NOVO && (
                                        <button 
                                            onClick={() => onUpdateStatus(apt.id, AppointmentStatus.CONFIRMADO)}
                                            className="w-full py-4 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-xl"
                                        >
                                            Confirmar Presença
                                        </button>
                                    )}
                                    {apt.status === AppointmentStatus.CONFIRMADO && (
                                        <button 
                                            onClick={() => onUpdateStatus(apt.id, AppointmentStatus.EM_EXECUCAO)}
                                            className="w-full py-4 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-glow flex items-center justify-center gap-2"
                                        >
                                            {businessModel === 'FIXED' ? <Play size={14} fill="currentColor" /> : <Navigation size={14} fill="currentColor" />}
                                            {businessModel === 'FIXED' ? 'Entrar no Box' : 'Iniciar Rota'}
                                        </button>
                                    )}
                                    {apt.status === AppointmentStatus.EM_EXECUCAO && (
                                        <button 
                                            onClick={() => onUpdateStatus(apt.id, AppointmentStatus.FINALIZADO)}
                                            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all shadow-glow-green flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Finalizar Missão
                                        </button>
                                    )}
                                </>
                            )}
                            {viewMode === 'HISTORY' && (
                                <div className="flex items-center gap-2 opacity-30 text-[9px] font-black uppercase tracking-widest">
                                    {apt.status === AppointmentStatus.FINALIZADO ? <Check size={14}/> : <XCircle size={14}/>}
                                    {apt.status}
                                </div>
                            )}
                            <div className="text-right">
                                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest block mb-1">Valor Unitário</span>
                                <span className="text-lg font-black text-white tabular-nums tracking-tighter italic">R$ {apt.price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={(apt) => onAddAppointment({ ...apt, isDelivery: businessModel === 'DELIVERY' })}
        customers={customers}
        businessModel={businessModel}
        existingAppointments={appointments}
        settings={settings}
      />
    </div>
  );
};
