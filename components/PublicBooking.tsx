
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Check, ChevronLeft, Calendar, Store, Star, Car, MapPin, Phone, Instagram, Clock,
    Image as ImageIcon, ChevronRight, CalendarDays, History, ThumbsUp, MessageSquare, Zap, Gift, ShieldCheck,
    X, Globe, User, LayoutGrid, FileText, Target, Plus, Save
} from 'lucide-react';
import { BusinessSettings, ServiceItem, Appointment, VehicleType, AppointmentStatus, Customer, Vehicle, PortfolioItem, Review } from '../types';
import { cn } from '../lib/utils';

interface PublicBookingProps {
    businessSettings: BusinessSettings;
    services: ServiceItem[];
    existingAppointments: Appointment[];
    portfolio: PortfolioItem[];
    reviews?: Review[];
    onBookingComplete: (apt: Appointment) => void;
    onExit: () => void;
}

interface CalendarDay {
    dateStr: string;
    dayName: string;
    dayNumber: string;
    isOpen: boolean;
    isToday: boolean;
    closureReason?: string;
}

export const PublicBooking: React.FC<PublicBookingProps> = ({ 
    businessSettings, services, existingAppointments, portfolio, reviews = [], 
    onBookingComplete, onExit 
}) => {
    
    const [bookingMode, setBookingMode] = useState(false);
    const [viewOverlay, setViewOverlay] = useState<'NONE' | 'REVIEWS' | 'PORTFOLIO' | 'ADD_VEHICLE'>('NONE');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    const [myVehicles, setMyVehicles] = useState<Vehicle[]>([]);
    const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>(''); 
    const [observation, setObservation] = useState('');
    const [selectedSavedVehicleId, setSelectedSavedVehicleId] = useState<string | null>(null);
    
    const [availableSlots, setAvailableSlots] = useState<{time: string}[]>([]);
    const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
    const [newVehicleForm, setNewVehicleForm] = useState({ brand: '', model: '', plate: '', type: 'CARRO' as VehicleType });

    // Carregar veículos localmente
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('carbon_current_user') || '{}');
        const slug = businessSettings.slug || 'default';
        const savedVehicles = JSON.parse(localStorage.getItem(`carbon_${slug}_my_vehicles`) || '[]');
        setMyVehicles(savedVehicles);
    }, [businessSettings.slug]);

    const reputation = useMemo(() => {
        if (!reviews || reviews.length === 0) return { avg: 0, count: 0, label: 'Novo Hangar' };
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return { 
            avg: (sum / reviews.length).toFixed(1), 
            count: reviews.length,
            label: `${reviews.length} Feedbacks`
        };
    }, [reviews]);

    useEffect(() => {
        const days: CalendarDay[] = [];
        const today = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const rule = businessSettings?.operatingDays?.find(d => d.dayOfWeek === date.getDay());
            let isOpen = rule?.isOpen ?? true;
            days.push({
                dateStr,
                dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase(),
                dayNumber: date.getDate().toString().padStart(2, '0'),
                isOpen, isToday: i === 0
            });
        }
        setCalendarDays(days);
    }, [businessSettings]);

    useEffect(() => {
        if (selectedDate && selectedService) {
            const slots: {time: string}[] = [];
            let cur = 8 * 60; // 08:00
            const end = 18 * 60; // 18:00
            while (cur + selectedService.durationMinutes <= end) {
                const h = Math.floor(cur / 60);
                const m = cur % 60;
                slots.push({ time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}` });
                cur += 30;
            }
            setAvailableSlots(slots);
        }
    }, [selectedDate, selectedService]);

    const handleStartBooking = (service: ServiceItem) => {
        setSelectedService(service);
        setBookingMode(true);
        setStep(1);
    };

    const handleConfirm = async () => {
        if (!selectedSavedVehicleId || loading) return;
        setLoading(true);
        try {
            const vehicle = myVehicles.find(v => v.id === selectedSavedVehicleId);
            const user = JSON.parse(localStorage.getItem('carbon_current_user') || '{}');
            
            onBookingComplete({
                id: `apt_${Date.now()}`,
                customerId: user.id || 'guest', 
                vehicleId: vehicle?.id || '',
                serviceType: selectedService?.name || '',
                date: selectedDate,
                time: selectedTime,
                durationMinutes: selectedService?.durationMinutes || 60,
                price: selectedService?.price || 0,
                status: AppointmentStatus.NOVO,
                observation
            });
            setStep(4);
        } catch (e) {
            alert("Erro ao consolidar reserva.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('carbon_current_user') || '{}');
        const slug = businessSettings.slug || 'default';
        
        const newV = {
            id: `v_${Date.now()}`,
            customer_id: user.id,
            brand: newVehicleForm.brand,
            model: newVehicleForm.model,
            plate: newVehicleForm.plate.toUpperCase(),
            type: newVehicleForm.type,
        };

        const updated = [...myVehicles, newV];
        setMyVehicles(updated);
        localStorage.setItem(`carbon_${slug}_my_vehicles`, JSON.stringify(updated));
        setSelectedSavedVehicleId(newV.id);
        setViewOverlay('NONE');
        setNewVehicleForm({ brand: '', model: '', plate: '', type: 'CARRO' });
    };

    if (bookingMode) {
        return (
            <div className="min-h-screen bg-[#050505] flex flex-col font-sans animate-in fade-in duration-300 z-[100]">
                <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                    <button onClick={() => { setBookingMode(false); setStep(1); }} className="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"><ChevronLeft size={20} /></button>
                    <div>
                        <h2 className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.4em]">Protocolo de Reserva</h2>
                        <p className="text-base font-black text-white uppercase tracking-tighter italic">{selectedService?.name}</p>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 pb-32">
                    {step === 1 && (
                        <div className="space-y-10 animate-in slide-in-from-bottom-4">
                            <div>
                                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">1. Selecionar Janela</h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                    {calendarDays.map(day => (
                                        <button key={day.dateStr} disabled={!day.isOpen} onClick={() => setSelectedDate(day.dateStr)} className={cn(
                                            "flex-shrink-0 w-16 h-24 rounded-2xl flex flex-col items-center justify-center border transition-all duration-500",
                                            selectedDate === day.dateStr ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)]' : 'bg-zinc-900 border-white/5 text-zinc-500'
                                        )}>
                                            <span className="text-[8px] font-black uppercase mb-2">{day.dayName}</span>
                                            <span className="text-2xl font-black">{day.dayNumber}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {selectedDate && (
                                <div className="grid grid-cols-4 gap-3 animate-in fade-in">
                                    {availableSlots.map(slot => (
                                        <button key={slot.time} onClick={() => { setSelectedTime(slot.time); setStep(2); }} className="py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black text-white hover:border-blue-500 transition-all">{slot.time}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in">
                            <div className="bg-zinc-900/50 rounded-[2.5rem] p-8 border border-white/10">
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-8 flex items-center gap-2">2. Identificar Frota</h3>
                                <div className="space-y-3">
                                    {myVehicles.map(v => (
                                        <button key={v.id} onClick={() => setSelectedSavedVehicleId(v.id)} className={cn(
                                            "w-full p-5 rounded-[1.8rem] border text-left flex items-center gap-4 transition-all",
                                            selectedSavedVehicleId === v.id ? "bg-white text-black border-white" : "bg-zinc-950 border-white/5 text-white"
                                        )}>
                                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", selectedSavedVehicleId === v.id ? "bg-black text-white" : "bg-white/5 text-blue-500")}><Car size={20}/></div>
                                            <div className="flex-1">
                                                <p className="font-black text-xs uppercase tracking-tighter">{v.brand} {v.model}</p>
                                                <p className="text-[9px] font-bold opacity-60 uppercase">{v.plate}</p>
                                            </div>
                                            {selectedSavedVehicleId === v.id && <Check size={20} strokeWidth={4} />}
                                        </button>
                                    ))}
                                    <button onClick={() => setViewOverlay('ADD_VEHICLE')} className="w-full py-5 border border-dashed border-white/10 rounded-[1.8rem] text-[9px] font-black uppercase text-zinc-600 hover:text-white transition-all">+ Novo Ativo à Frota</button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black text-zinc-600 uppercase ml-2">Breve Dossiê</label>
                                <textarea placeholder="AVARIAS, DETALHES, RODAS..." className="w-full bg-zinc-900 border border-white/5 rounded-[2rem] p-6 text-[10px] font-bold text-white uppercase focus:border-blue-500 outline-none h-32 resize-none" value={observation} onChange={e => setObservation(e.target.value)} />
                            </div>

                            <button onClick={handleConfirm} disabled={!selectedSavedVehicleId || loading} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-[0.4em] rounded-full shadow-lg shadow-blue-900/40 active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center gap-4">
                                {loading ? <RefreshCw className="animate-spin" /> : <><Zap size={20} /> Finalizar Reserva</>}
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] mb-8">
                                <Check size={48} className="text-white" strokeWidth={4}/>
                            </div>
                            <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">Confirmado</h2>
                            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Protocolo Integrado ao Hangar</p>
                            <button onClick={() => { setBookingMode(false); setStep(1); }} className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full active:scale-95 transition-all">Sair do Protocolo</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans overflow-hidden">
            <div className="w-full max-md:max-w-md h-screen md:h-[800px] md:rounded-[3rem] bg-[#050505] md:border md:border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
                <div className="flex-1 overflow-y-auto pb-32">
                    <div className="relative h-56 bg-zinc-900 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                        {businessSettings.profileImageUrl ? (
                            <img src={businessSettings.profileImageUrl} className="w-full h-full object-cover opacity-60 scale-110 blur-sm" />
                        ) : (
                            <div className="absolute inset-0 scanner-grid opacity-10" />
                        )}
                        <div className="absolute bottom-8 left-8 z-20">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center mb-4 overflow-hidden shadow-2xl">
                                {businessSettings.profileImageUrl ? <img src={businessSettings.profileImageUrl} className="w-full h-full object-cover" /> : <Store className="text-blue-500" size={24} />}
                            </div>
                            <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">{businessSettings.businessName}</h1>
                            <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                                <MapPin size={10} className="text-blue-500"/> {businessSettings.address || 'Hangar Carbon'}
                            </p>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        <div className="flex items-center justify-between bg-zinc-900/40 p-5 rounded-[2rem] border border-white/5 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{reputation.avg}</span>
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">({reputation.label})</span>
                            </div>
                            <button onClick={() => setViewOverlay('REVIEWS')} className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Feedback</button>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em] px-2">Protocolos do Hangar</h3>
                            <div className="grid gap-4">
                                {services.map(s => (
                                    <button key={s.id} onClick={() => handleStartBooking(s)} className="bg-zinc-900/60 border border-white/5 p-6 rounded-[2rem] text-left flex justify-between items-center group hover:border-blue-500/30 transition-all hover:bg-zinc-900 shadow-hero">
                                        <div className="space-y-2">
                                            <h4 className="text-base font-black text-white uppercase group-hover:text-blue-500 transition-colors leading-none tracking-tight">{s.name}</h4>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[9px] font-bold text-zinc-600 uppercase flex items-center gap-1.5"><Clock size={10} className="text-blue-500"/> {s.durationMinutes} MIN</p>
                                                <p className="text-[9px] font-black text-white tabular-nums">R$ {s.price}</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-700 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 w-full h-22 bg-black/80 backdrop-blur-3xl border-t border-white/5 px-10 flex items-center justify-between z-40 pb-2">
                    <button className="text-blue-500 flex flex-col items-center gap-1.5"><Zap size={22} /><span className="text-[7px] font-black uppercase tracking-widest">Dash</span></button>
                    <button onClick={() => setViewOverlay('PORTFOLIO')} className="text-zinc-600 flex flex-col items-center gap-1.5 hover:text-white transition-all"><ImageIcon size={22} /><span className="text-[7px] font-black uppercase tracking-widest">Galeria</span></button>
                    <button onClick={onExit} className="text-zinc-600 flex flex-col items-center gap-1.5 hover:text-red-500 transition-all"><ShieldCheck size={22} /><span className="text-[7px] font-black uppercase tracking-widest">Logout</span></button>
                </div>

                {viewOverlay !== 'NONE' && (
                    <div className="fixed inset-0 z-[110] bg-black/98 animate-in fade-in p-8 flex flex-col">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                {viewOverlay === 'PORTFOLIO' ? 'Hangar Visual' : viewOverlay === 'REVIEWS' ? 'Reputação' : 'Novo Ativo'}
                            </h3>
                            <button onClick={() => setViewOverlay('NONE')} className="p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={24}/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {viewOverlay === 'ADD_VEHICLE' && (
                                <form onSubmit={handleAddVehicle} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <input required placeholder="MARCA" className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-blue-500" value={newVehicleForm.brand} onChange={e => setNewVehicleForm({...newVehicleForm, brand: e.target.value})} />
                                        <input required placeholder="MODELO" className="bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-blue-500" value={newVehicleForm.model} onChange={e => setNewVehicleForm({...newVehicleForm, model: e.target.value})} />
                                    </div>
                                    <input required placeholder="PLACA (BRA-2E19)" className="w-full bg-zinc-900 border border-white/5 p-5 rounded-2xl text-white font-bold uppercase outline-none focus:border-blue-500" value={newVehicleForm.plate} onChange={e => setNewVehicleForm({...newVehicleForm, plate: e.target.value})} />
                                    <button disabled={loading} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-900/30 active:scale-95 transition-all">
                                        {loading ? <RefreshCw className="animate-spin" /> : 'Vincular à Frota'}
                                    </button>
                                </form>
                            )}
                            {viewOverlay === 'REVIEWS' && (
                                <div className="space-y-4">
                                    {reviews.length === 0 ? <p className="text-center opacity-20 py-20 font-black uppercase tracking-widest text-[10px]">Sem registros de reputação</p> : reviews.map(r => (
                                        <div key={r.id} className="bg-zinc-900/50 border border-white/5 p-6 rounded-[2.5rem]">
                                            <div className="flex justify-between mb-4">
                                                <span className="text-xs font-black text-white uppercase tracking-tighter">{r.customerName}</span>
                                                <div className="flex text-yellow-500 gap-0.5">{Array.from({length: 5}).map((_, i) => <Star key={i} size={10} fill={i < r.rating ? "currentColor" : "none"} />)}</div>
                                            </div>
                                            <p className="text-[11px] text-zinc-400 italic font-medium leading-relaxed">"{r.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {viewOverlay === 'PORTFOLIO' && (
                                <div className="grid gap-6">
                                    {portfolio.length === 0 ? <p className="text-center opacity-20 py-20 font-black uppercase tracking-widest text-[10px]">Hangar visual vazio</p> : portfolio.map(item => (
                                        <div key={item.id} className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-900">
                                            <img src={item.imageUrl} className="w-full aspect-video object-cover" />
                                            <div className="p-6"><p className="text-white font-black text-sm uppercase tracking-tight italic">{item.description}</p></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const RefreshCw = ({ className }: { className?: string }) => (
    <svg className={cn("animate-spin h-5 w-5", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
