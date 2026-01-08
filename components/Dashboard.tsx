
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  DollarSign, Activity, CalendarCheck, Sparkles, Lock, CheckCircle2, Timer, Car, Clock, Boxes, Play, Check, User as UserIcon, Monitor, ChevronRight, BarChart, Info, ArrowUpRight, RefreshCw, Zap, Gift, X, ShieldCheck, MessageSquare
} from 'lucide-react';
import { PlanType, CarbonInsight, Appointment, AppointmentStatus, BusinessModel, BusinessSettings, Customer, BillingCycle } from '../types';
import { generateCarbonInsights } from '../services/geminiService';
import { openWhatsAppChat } from '../services/whatsappService';
import { cn } from '../lib/utils';

interface DashboardProps {
  currentPlan: PlanType;
  appointments: Appointment[];
  customers: Customer[];
  onUpgrade: () => void;
  onSelectPlan?: (plan: PlanType, cycle: BillingCycle) => void;
  setActiveTab: (tab: string) => void;
  businessModel: BusinessModel;
  businessSettings: BusinessSettings;
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
    currentPlan, appointments, customers, onUpgrade, onSelectPlan, setActiveTab, 
    businessModel, businessSettings, onUpdateStatus 
}) => {
  const [insights, setInsights] = useState<CarbonInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [currentTime, setCurrentTime] = useState(new Date());

  const today = new Date().toISOString().split('T')[0];
  
  const todayAppointments = useMemo(() => 
    appointments.filter(a => a.date === today && a.status !== AppointmentStatus.CANCELADO)
      .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, today]
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchInsights = useCallback(async () => {
    if (currentPlan === PlanType.START || loadingInsights) return;
    
    setLoadingInsights(true);
    try {
      const summary = todayAppointments.map(a => `${a.time}: ${a.serviceType}`).join(', ');
      const revenueToday = todayAppointments
        .filter(a => a.status === AppointmentStatus.FINALIZADO)
        .reduce((acc, curr) => acc + curr.price, 0);
        
      const data = await generateCarbonInsights(
        summary || "Operação iniciada", 
        `R$ ${revenueToday.toLocaleString('pt-BR')}`
      );
      setInsights(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.error("Erro ao carregar insights");
    } finally {
      setLoadingInsights(false);
    }
  }, [currentPlan, todayAppointments, loadingInsights]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const trialDaysLeft = useMemo(() => {
    if (!businessSettings?.trialStartDate || businessSettings.subscriptionStatus === 'ACTIVE') return null;
    const start = new Date(businessSettings.trialStartDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, 15 - diff);
  }, [businessSettings]);

  const boxes = Array.from({ length: businessSettings?.boxCapacity || 1 }, (_, i) => {
      const activeApt = todayAppointments.find(a => a.status === AppointmentStatus.EM_EXECUCAO && a.boxId === i + 1) 
                        || todayAppointments.filter(a => a.status === AppointmentStatus.EM_EXECUCAO)[i];
      return { id: i + 1, appointment: activeApt };
  });

  const boxesInUse = boxes.filter(b => b.appointment).length;
  const utilizationRate = businessSettings?.boxCapacity ? (boxesInUse / businessSettings.boxCapacity) * 100 : 0;
  const revenueToday = todayAppointments
      .filter(a => a.status === AppointmentStatus.FINALIZADO)
      .reduce((acc, curr) => acc + curr.price, 0);

  return (
      <div className="p-6 md:p-10 space-y-10 animate-fade-in pb-32 max-w-[1700px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-10 gap-8 relative">
              <div className="absolute -left-10 top-0 w-32 h-px bg-gradient-to-r from-red-600 to-transparent" />
              <div className="space-y-2">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center shadow-glow-red relative overflow-hidden group">
                          <div className="absolute inset-0 bg-red-600/5 group-hover:bg-red-600/10 transition-colors" />
                          <Monitor className="text-red-500 w-6 h-6 relative z-10" />
                      </div>
                      <div>
                          <h2 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none">Carbon OS</h2>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.5em] mt-1">Unidade de Comando Operacional</p>
                      </div>
                  </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                  {trialDaysLeft !== null && (
                      <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 rounded-2xl p-3 pr-4 animate-in fade-in slide-in-from-right-4">
                          <div className="flex flex-col items-start">
                              <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest flex items-center gap-1">
                                  <Gift size={10} /> Teste Ativo
                              </span>
                              <span className="text-sm font-black text-white tabular-nums tracking-tighter">
                                  {trialDaysLeft} dias restantes
                              </span>
                          </div>
                          <button 
                              onClick={onUpgrade}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shadow-glow-red animate-pulse-fast active:scale-95 flex items-center gap-2 group"
                          >
                              <Zap size={10} className="group-hover:animate-pulse" /> Assinar
                          </button>
                      </div>
                  )}

                  <div className="flex flex-col items-end">
                      <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Hora do Servidor</span>
                      <span className="text-xl font-bold text-white tabular-nums tracking-tighter">{currentTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="h-10 w-px bg-white/5 mx-2 hidden md:block" />
                  <div className="bg-[#09090b] border border-white/5 rounded-2xl p-2 px-6 flex gap-8 shadow-2xl items-center">
                      {boxes.map(box => (
                          <div key={box.id} className="flex flex-col items-center gap-1.5 py-1">
                              <div className={cn(
                                  "w-1.5 h-6 rounded-full transition-all duration-700 relative",
                                  box.appointment ? "bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-zinc-800"
                              )}>
                                  {box.appointment && <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-20" />}
                              </div>
                              <span className={cn("text-[9px] font-bold tracking-tighter transition-colors", box.appointment ? "text-red-500" : "text-zinc-600")}>B{box.id}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard label="Agendamentos" value={todayAppointments.length} icon={CalendarCheck} subtext="Fila Global de Hoje" />
              <KPICard label="Ocupação de Boxes" value={`${utilizationRate.toFixed(0)}%`} icon={Boxes} color={utilizationRate >= 100 ? 'text-red-500' : 'text-white'} subtext="Carga Operacional ao Vivo" progress={utilizationRate} />
              <KPICard label="Receita do Dia" value={`R$ ${revenueToday.toLocaleString('pt-BR')}`} icon={DollarSign} color="text-white" subtext="Liquidação Bruta Hoje" isBlur={currentPlan === PlanType.START} onUpgrade={onUpgrade} />
              <KPICard label="Eficiência Op." value="94.2%" icon={Activity} color="text-white" subtext="Benchmark de Performance" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between px-2">
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] flex items-center gap-3">
                          <BarChart size={14} className="text-red-600" /> Centro de Fila Tática
                      </h3>
                      <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1 rounded-full border border-white/5">
                              <div className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
                              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Fluxo Ativo</span>
                          </div>
                          <button onClick={() => setActiveTab('schedule')} className="text-[10px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] flex items-center gap-2 group">
                              Agenda Mestre <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                      </div>
                  </div>
                  
                  <div className="space-y-4">
                      {todayAppointments.length === 0 ? (
                          <div className="p-32 border border-white/5 border-dashed rounded-[3rem] text-center bg-zinc-950/20 flex flex-col items-center justify-center backdrop-blur-sm">
                              <Car size={48} className="text-zinc-800 mb-6 animate-pulse" />
                              <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em]">Nenhum sinal ativo no pátio</p>
                          </div>
                      ) : (
                          todayAppointments.map((apt) => (
                              <OperationalCard 
                                  key={apt.id} 
                                  appointment={apt} 
                                  customer={customers.find(c => c.id === apt.customerId)}
                                  onUpdateStatus={onUpdateStatus}
                                  currentTime={currentTime}
                              />
                          ))
                      )}
                  </div>

                  <div className="mt-16 pt-16 border-t border-white/5 relative">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
                      <div className="flex items-center justify-between mb-10 px-2 relative z-10">
                          <div>
                              <div className="flex items-center gap-3">
                                  <Sparkles className="w-5 h-5 text-red-500 animate-pulse" />
                                  <h3 className="text-xs font-bold text-white/80 uppercase tracking-[0.5em]">Diagnóstico Carbon Intelligence</h3>
                              </div>
                              <div className="flex items-center gap-2 mt-3">
                                  <span className="text-[9px] font-bold bg-zinc-900 border border-white/5 text-zinc-500 px-2 py-1 rounded tracking-widest uppercase">Scanner: Ativo</span>
                                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Sincronia às {lastUpdate}</span>
                              </div>
                          </div>
                          <div className="flex items-center gap-4">
                              <button 
                                onClick={fetchInsights}
                                disabled={loadingInsights || currentPlan === PlanType.START}
                                className="p-3 rounded-xl bg-[#09090b] border border-white/10 text-white/40 hover:text-red-500 hover:border-red-600/30 transition-all active:scale-95 disabled:opacity-30 shadow-2xl"
                                title="Atualizar Diagnóstico"
                              >
                                <RefreshCw size={14} className={cn(loadingInsights && "animate-spin")} />
                              </button>
                              {currentPlan === PlanType.START && (
                                  <button onClick={onUpgrade} className="text-[9px] font-bold bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl border border-red-600/20 flex items-center gap-2 transition-all shadow-glow-red uppercase tracking-widest">
                                      <Lock size={10} /> Desbloquear IA
                                  </button>
                              )}
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative p-1">
                          {loadingInsights ? (
                              <div className="col-span-3 h-64 flex items-center justify-center bg-[#09090b]/40 backdrop-blur-xl rounded-[3rem] border border-white/5 border-dashed">
                                  <div className="flex flex-col items-center gap-6">
                                      <div className="w-12 h-12 border-2 border-red-600/10 border-t-red-600 rounded-full animate-spin" />
                                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.4em]">Rodando Heurística de Sistema...</p>
                                  </div>
                              </div>
                          ) : insights.length > 0 ? insights.map((insight) => (
                              <DiagnosticCard key={insight.id} insight={insight} />
                          )) : (
                              <div className="col-span-3 h-48 flex items-center justify-center text-zinc-800 font-bold uppercase text-[10px] tracking-[0.5em] border border-white/5 border-dashed rounded-[3rem] bg-zinc-950/20">
                                  Aguardando Dados Operacionais
                              </div>
                          )}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-4 space-y-8">
                  <div className="bg-[#09090b] rounded-[3rem] border border-white/10 p-10 shadow-hero relative overflow-hidden group backdrop-blur-2xl">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] mb-8 flex items-center gap-3">
                          <Monitor size={14} className="text-red-600" /> Integridade Operacional
                      </h3>
                      <div className="space-y-4">
                          <HUDStatusItem label="Link de Inteligência" status="Online" active />
                          <HUDStatusItem label="Portal WhatsApp" status="Sincronizado" active />
                          <HUDStatusItem label="Ponte Financeira" status="Segura" active />
                      </div>
                      
                      <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between">
                          <div className="flex flex-col">
                              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Estúdio Ativo</span>
                              <span className="text-sm font-bold text-white">{businessSettings?.businessName || 'Minha Estética'}</span>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
                              <Info size={16} className="text-zinc-500" />
                          </div>
                      </div>
                  </div>

                  <div className="bg-[#09090b] rounded-[3rem] border border-white/10 p-10 shadow-hero backdrop-blur-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full" />
                      <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                          <Timer size={14} className="text-red-500" /> Fila de Próximos Turnos
                      </h3>
                      <div className="space-y-8">
                          {todayAppointments
                              .filter(a => a.status === AppointmentStatus.NOVO || a.status === AppointmentStatus.CONFIRMADO)
                              .slice(0, 4)
                              .map(apt => (
                                  <div key={apt.id} className="flex items-center gap-6 group cursor-pointer relative">
                                      <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center group-hover:bg-red-600/10 group-hover:border-red-600/30 transition-all duration-500">
                                          <span className="text-xs font-bold text-white/40 group-hover:text-red-500 tabular-nums">{apt.time}</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="text-white font-bold text-sm tracking-tight uppercase truncate group-hover:text-red-500 transition-colors">{apt.serviceType}</p>
                                          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] mt-1">{apt.durationMinutes} MIN EST.</p>
                                      </div>
                                      <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-red-600 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                  </div>
                              ))
                          }
                          {todayAppointments.filter(a => a.status === AppointmentStatus.NOVO || a.status === AppointmentStatus.CONFIRMADO).length === 0 && (
                              <div className="text-center py-10 opacity-20">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Fila Limpa</p>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
};

const KPICard = ({ label, value, icon: Icon, color = 'text-white', subtext, progress, isBlur, onUpgrade }: any) => (
    <div className={cn(
        "bg-[#09090b] p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group hover:border-red-600/30 transition-all duration-700 shadow-hero backdrop-blur-xl",
        isBlur && "select-none"
    )}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-4">{label}</p>
                <h3 className={cn("text-5xl font-extrabold tracking-tighter leading-none", color, isBlur && 'blur-xl opacity-20')}>{value}</h3>
            </div>
            <div className="p-4 bg-zinc-950 border border-white/10 rounded-[1.5rem] group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-700 group-hover:scale-110 shadow-2xl">
                <Icon size={22} className="text-zinc-500 group-hover:text-white transition-colors" />
            </div>
        </div>
        
        {progress !== undefined && (
            <div className="mt-8 space-y-3">
                <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", color.includes('red') ? 'bg-red-600' : 'bg-white')} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest text-zinc-700">
                    <span>Performance</span>
                    <span>{progress}% de Capacidade</span>
                </div>
            </div>
        )}

        {subtext && <p className="text-[9px] text-zinc-700 mt-6 font-bold uppercase tracking-[0.4em] relative z-10">{subtext}</p>}
        
        {isBlur && (
             <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-col items-center justify-center p-8 text-center z-20">
                 <Lock size={24} className="text-zinc-800 mb-6" />
                 <button onClick={onUpgrade} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all shadow-glow-red">
                     Elevar Acesso
                 </button>
             </div>
        )}
    </div>
);

const HUDStatusItem = ({ label, status, active }: { label: string, status: string, active?: boolean }) => (
    <div className="flex justify-between items-center bg-zinc-950/50 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{status}</span>
            <div className={cn(
                "w-1.5 h-1.5 rounded-full shadow-glow-green",
                active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-zinc-800"
            )} />
        </div>
    </div>
);

const DiagnosticCard: React.FC<{ insight: CarbonInsight }> = ({ insight }) => (
    <div className="bg-[#09090b]/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 hover:border-red-600/40 transition-all duration-700 group relative overflow-hidden shadow-hero">
        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12">
            <Activity size={120} className="text-red-500" />
        </div>
        
        <div className="flex flex-col gap-6 mb-8 relative z-10">
            <div className="flex justify-between items-center">
                <span className={cn(
                    "text-[9px] font-bold px-3 py-1.5 rounded-xl border uppercase tracking-[0.2em] transition-all",
                    insight.type === 'CRITICAL' ? 'bg-red-600 text-white border-red-600 shadow-glow-red' : 'bg-white/5 text-zinc-400 border-white/10'
                )}>
                    {insight.type === 'CRITICAL' ? 'Risco Crítico' : 'Protocolo Operacional'}
                </span>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                </div>
            </div>
            
            <div className="bg-red-600/5 p-4 rounded-2xl border border-red-600/10 min-h-[60px] flex items-center">
                <span className="text-[10px] text-red-500 font-bold tracking-[0.2em] uppercase leading-relaxed block">
                    Impacto: {insight.impact}
                </span>
            </div>
        </div>

        <h4 className="text-lg font-bold text-white mb-6 tracking-tight leading-tight group-hover:text-red-500 transition-colors relative z-10">
          {insight.problem}
        </h4>
        
        <div className="pt-6 border-t border-white/5 relative z-10">
            <p className="text-[11px] text-zinc-500 leading-relaxed font-medium italic opacity-80 group-hover:opacity-100">
                "{insight.action}"
            </p>
        </div>
    </div>
);

const OperationalCard: React.FC<{ appointment: Appointment, customer?: Customer, onUpdateStatus: any, currentTime: Date }> = ({ appointment, customer, onUpdateStatus, currentTime }) => {
    const isRunning = appointment.status === AppointmentStatus.EM_EXECUCAO;
    const isFinished = appointment.status === AppointmentStatus.FINALIZADO;
    
    const progress = useMemo(() => {
        if (!isRunning) return 0;
        const [h, m] = appointment.time.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(h, m, 0);
        const elapsed = (currentTime.getTime() - startTime.getTime()) / 60000;
        return Math.min(100, Math.max(0, (elapsed / appointment.durationMinutes) * 100));
    }, [isRunning, appointment.time, appointment.durationMinutes, currentTime]);

    const handleNotifyCustomer = () => {
        if (!customer) return;
        const vehicle = customer.vehicles.find(v => v.id === appointment.vehicleId);
        const vehicleName = vehicle ? `${vehicle.brand} ${vehicle.model}` : "seu veículo";
        const message = `Olá ${customer.name}! 🚗✨\n\nBoas notícias: o serviço de *${appointment.serviceType}* no seu *${vehicleName}* foi finalizado com sucesso aqui na *CarbonCar*.\n\nSeu ativo já está pronto para retirada no Hangar. Esperamos por você!`;
        openWhatsAppChat(customer.phone, message);
    };

    const statusConfig = useMemo(() => {
        switch(appointment.status) {
            case AppointmentStatus.NOVO: return { bg: 'bg-zinc-900', text: 'text-zinc-500', border: 'border-white/5', label: 'PENDENTE' };
            case AppointmentStatus.CONFIRMADO: return { bg: 'bg-white/5', text: 'text-white', border: 'border-white/20', label: 'PRONTO' };
            case AppointmentStatus.EM_EXECUCAO: return { bg: 'bg-red-600 shadow-glow-red', text: 'text-white', border: 'border-red-600', label: `BOX ${appointment.boxId || '1'}` };
            case AppointmentStatus.FINALIZADO: return { bg: 'bg-zinc-900/50', text: 'text-zinc-700', border: 'border-white/5', label: 'ARQUIVADO' };
            default: return { bg: 'bg-zinc-800', text: 'text-zinc-400', border: 'border-zinc-700', label: appointment.status };
        }
    }, [appointment.status, appointment.boxId]);

    const vehicle = customer?.vehicles.find(v => v.id === appointment.vehicleId);
    const vehicleDisplay = vehicle ? `${vehicle.brand} ${vehicle.model}` : appointment.vehicleId;
    const plateDisplay = vehicle ? vehicle.plate : 'S/P';

    return (
        <div className={cn(
            "relative rounded-[3rem] border transition-all duration-700 group overflow-hidden backdrop-blur-2xl shadow-hero",
            isRunning ? "bg-[#0c0c0c] border-red-600/50 scale-[1.01] z-10" : "bg-zinc-950/50 border-white/5 hover:border-white/10",
            isFinished && "opacity-60 saturate-[0.5]"
        )}>
            {isRunning && (
                <div className="absolute top-0 left-0 h-full bg-green-600 opacity-5 transition-all duration-1000" style={{ width: `${progress}%` }} />
            )}

            <div className="flex flex-col md:flex-row items-stretch relative z-10">
                <div className="flex flex-col items-center justify-center p-10 min-w-[150px] bg-[#09090b] border-r border-white/5">
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-[0.4em] mb-3">Marcador-T</span>
                    <span className="text-4xl font-bold text-white tracking-tighter tabular-nums leading-none">{appointment.time}</span>
                    <div className="mt-4 flex items-center gap-2">
                        <Clock size={10} className="text-zinc-600" />
                        <span className="text-[10px] text-zinc-500 font-bold tabular-nums">{appointment.durationMinutes}m</span>
                    </div>
                </div>

                <div className="flex-1 p-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-6 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={cn(
                                "text-[9px] font-bold px-4 py-1.5 rounded-full border uppercase tracking-[0.4em] transition-all",
                                statusConfig.bg, statusConfig.text, statusConfig.border
                            )}>
                                {statusConfig.label}
                            </span>
                            <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 px-4 py-1.5 rounded-2xl shadow-xl">
                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">{plateDisplay}</span>
                                <div className="w-px h-3 bg-white/10" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest truncate">{vehicleDisplay}</span>
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="font-bold text-3xl text-white tracking-tighter leading-none mb-3 group-hover:text-red-500 transition-colors truncate">{appointment.serviceType}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                                    <UserIcon size={12} className="text-zinc-600" />
                                </div>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{customer?.name || "Ativo Anônimo"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-6 min-w-[220px]">
                        {appointment.status === AppointmentStatus.NOVO && (
                            <button onClick={() => onUpdateStatus(appointment.id, AppointmentStatus.CONFIRMADO)} className="w-full px-10 py-5 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.5em] transition-all shadow-2xl">
                                Confirmar Sinal
                            </button>
                        )}
                        {appointment.status === AppointmentStatus.CONFIRMADO && (
                            <button onClick={() => onUpdateStatus(appointment.id, AppointmentStatus.EM_EXECUCAO)} className="w-full px-10 py-5 bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-bold uppercase tracking-[0.5em] transition-all shadow-glow flex items-center justify-center gap-3">
                                <Play size={16} fill="currentColor" /> Iniciar Box
                            </button>
                        )}
                        {isRunning && (
                            <div className="flex flex-col items-end gap-4 w-full">
                                <button 
                                  onClick={() => onUpdateStatus(appointment.id, AppointmentStatus.FINALIZADO)} 
                                  className="w-full px-10 py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.5em] transition-all shadow-glow-green flex items-center justify-center gap-3 group/btn"
                                >
                                    <CheckCircle2 size={18} className="group-hover/btn:scale-110 transition-transform" /> Concluir Ciclo
                                </button>
                                <div className="w-full flex flex-col gap-2 pr-2">
                                    <div className="flex justify-between items-center text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                                        <span>Progresso de Scan</span>
                                        <span className="text-white tabular-nums">{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)] transition-all duration-1000" style={{ width: `${progress}%` }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {isFinished && (
                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex items-center justify-center gap-3 text-white/20 text-[9px] font-bold uppercase tracking-[0.5em] bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                                    <Check size={16} /> Missão Registrada
                                </div>
                                <button 
                                    onClick={handleNotifyCustomer}
                                    className="w-full py-4 bg-green-900/10 hover:bg-green-600 border border-green-600/30 text-green-500 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 animate-pulse hover:animate-none group/notify shadow-2xl"
                                >
                                    <MessageSquare size={16} className="group-hover/notify:scale-110 transition-transform" /> Notificar Ativo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
