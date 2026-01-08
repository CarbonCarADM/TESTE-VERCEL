import React, { useState } from 'react';
import { MapPin, Navigation, Settings, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Appointment, AppointmentStatus } from '../types';

interface DeliveryManagerProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

export const DeliveryManager: React.FC<DeliveryManagerProps> = ({ appointments, onUpdateStatus }) => {
  const [settings, setSettings] = useState({
    maxRadiusKm: 15,
    baseFee: 25.00,
    activeDrivers: 2
  });

  // Filter only active delivery appointments
  const deliveryAppointments = appointments.filter(a => 
    a.isDelivery && 
    a.status !== AppointmentStatus.CANCELADO && 
    a.status !== AppointmentStatus.FINALIZADO
  );
  
  // Sort by time
  const sortedDeliveries = [...deliveryAppointments].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="p-6 md:p-10 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="text-orange-500" />
            Gestão de Delivery
          </h2>
          <p className="text-zinc-500 text-sm">Controle de rotas e logística externa.</p>
        </div>
        <div className="flex gap-3">
             <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex items-center gap-3">
                <Settings size={16} className="text-zinc-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Raio Máx.</span>
                    <span className="text-sm font-bold text-white">{settings.maxRadiusKm} km</span>
                </div>
             </div>
             <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 flex items-center gap-3">
                <Navigation size={16} className="text-zinc-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold">Motoristas</span>
                    <span className="text-sm font-bold text-white">{settings.activeDrivers} Online</span>
                </div>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List of Deliveries */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Fila de Atendimento</h3>
            {sortedDeliveries.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center border-dashed">
                    <Truck className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500">Nenhum delivery ativo agendado para hoje.</p>
                </div>
            ) : (
                sortedDeliveries.map((apt, index) => (
                    <div key={apt.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center relative overflow-hidden group hover:border-zinc-700 transition-all">
                        
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 
                            ${apt.status === AppointmentStatus.EM_ROTA ? 'bg-orange-500' : 'bg-zinc-700'}`} 
                        />

                        {/* Timeline Connector (Mobile) */}
                        {index !== sortedDeliveries.length - 1 && (
                            <div className="absolute left-[2.5rem] top-16 bottom-0 w-px bg-zinc-800 md:hidden" />
                        )}

                        <div className="flex-shrink-0 w-12 h-12 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col items-center justify-center z-10 ml-2">
                            <span className="text-xs font-bold text-zinc-400">{apt.time}</span>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium line-clamp-1">{apt.address || "Endereço não informado"}</span>
                                <span className="text-[10px] bg-orange-950 text-orange-400 px-2 py-0.5 rounded border border-orange-900/50 whitespace-nowrap">
                                    {apt.durationMinutes} min
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500">
                                {apt.serviceType} • R$ {apt.price}
                            </p>
                            {apt.status === AppointmentStatus.EM_ROTA && (
                                <p className="text-xs text-orange-500 mt-1 font-medium animate-pulse flex items-center gap-1">
                                    <Navigation size={10} /> Motorista em deslocamento
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                            {apt.status === AppointmentStatus.EM_ROTA ? (
                                <button 
                                    onClick={() => onUpdateStatus(apt.id, AppointmentStatus.EM_EXECUCAO)}
                                    className="flex-1 md:flex-none bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-orange-900/20"
                                >
                                    Confirmar Chegada
                                </button>
                            ) : apt.status === AppointmentStatus.EM_EXECUCAO ? (
                                <button 
                                    disabled
                                    className="flex-1 md:flex-none bg-zinc-800 text-zinc-500 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed border border-zinc-700"
                                >
                                    Em Serviço
                                </button>
                            ) : (
                                <button 
                                    onClick={() => onUpdateStatus(apt.id, AppointmentStatus.EM_ROTA)}
                                    className="flex-1 md:flex-none bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 group-hover:border-zinc-600"
                                >
                                    <Navigation size={14} className="text-orange-500" /> Iniciar Rota
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* Map Placeholder */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-fit sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Mapa Tático</h3>
            <div className="aspect-square bg-zinc-950 rounded-lg border border-zinc-800 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ 
                    backgroundImage: 'radial-gradient(circle at 2px 2px, #3f3f46 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                }}></div>
                
                {/* Simulated Radar Effect */}
                <div className="absolute w-32 h-32 bg-orange-500/5 rounded-full animate-ping [animation-duration:3s]"></div>
                <div className="absolute w-4 h-4 bg-orange-500 rounded-full border-2 border-zinc-950 shadow-[0_0_20px_rgba(249,115,22,0.8)] z-10"></div>
                
                {/* Random dots simulating vehicles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-zinc-600 rounded-full"></div>
                <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-zinc-600 rounded-full"></div>

                <p className="absolute bottom-2 left-2 right-2 text-[10px] text-zinc-500 font-mono bg-zinc-900/90 px-2 py-1 rounded backdrop-blur-sm border border-zinc-800 text-center">
                    SISTEMA DE RASTREAMENTO ATIVO
                </p>
            </div>
            
            <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Entregas Pendentes</span>
                    <span className="text-white font-bold">{sortedDeliveries.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Tempo Médio Deslocamento</span>
                    <span className="text-white font-bold">18 min</span>
                </div>
                <div className="pt-4 border-t border-zinc-800">
                    <button className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <Settings size={14} />
                        Configurar Zonas
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};