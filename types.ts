
export enum PlanType {
  START = 'START',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export type BillingCycle = 'MONTHLY' | 'ANNUAL';

export type BusinessModel = 'FIXED' | 'DELIVERY';

export enum AppointmentStatus {
  NOVO = 'NOVO',
  CONFIRMADO = 'CONFIRMADO',
  EM_ROTA = 'EM_ROTA',
  EM_EXECUCAO = 'EM_EXECUCAO',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO'
}

export enum ServiceType {
  LAVAGEM_SIMPLES = 'Lavagem Simples',
  LAVAGEM_DETALHADA = 'Lavagem Detalhada',
  POLIMENTO = 'Polimento',
  HIGIENIZACAO = 'Higienização Interna',
  VITRIFICACAO = 'Vitrificação'
}

export type VehicleType = 'CARRO' | 'SUV' | 'MOTO' | 'UTILITARIO';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  compatibleVehicles: VehicleType[];
  active: boolean;
  allowsFixed: boolean;
}

export interface OperatingRule {
  dayOfWeek: number;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  reason?: string;
}

export interface SpecialClosure {
  date: string;
  reason: string;
}

export interface BusinessSettings {
  businessName: string;
  slug: string;
  address?: string;
  boxCapacity: number;
  patioCapacity: number;
  slotIntervalMinutes: number;
  operatingDays: OperatingRule[];
  onlineBookingEnabled: boolean;
  cnpj?: string;
  profileImageUrl?: string;
  loyaltyProgramEnabled: boolean;
  specialClosures?: SpecialClosure[];
  trialStartDate?: string;
  subscriptionStatus?: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  planType?: PlanType;
  billingCycle?: BillingCycle;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpent: number;
  lastVisit: string;
  vehicles: Vehicle[];
  status?: 'ATIVO' | 'INATIVO' | 'NOVO';
  xpPoints?: number;
  washes?: number;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  plate: string;
  color: string;
  type: VehicleType;
}

export interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  boxId?: number; 
  serviceId?: string;
  serviceType: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  staffName?: string;
  cancellationReason?: string;
  observation?: string;
  isDelivery?: boolean;
  address?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: 'FIXO' | 'VARIAVEL' | 'MARKETING' | 'IMPOSTO';
}

export interface CarbonInsight {
  id: string;
  problem: string;
  impact: string;
  action: string;
  type: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';
}

export interface FinancialMetric {
  label: string;
  value: number;
  trend: number;
}

export interface Review {
  id: string;
  appointmentId?: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  description: string;
  date: string;
  category?: string;
}
