
import { Appointment, AppointmentStatus, Customer, PlanType, ServiceType, Review, PortfolioItem, BusinessSettings, ServiceItem, Expense } from './types';

const DEFAULT_SERVICES: ServiceItem[] = [
    { id: 's1', name: 'Lavagem Simples', description: 'Lavagem externa e aspiração', durationMinutes: 45, price: 60, compatibleVehicles: ['CARRO', 'SUV'], active: true, allowsFixed: true },
    { id: 's2', name: 'Lavagem Detalhada', description: 'Limpeza de motor, chassi e cera', durationMinutes: 90, price: 150, compatibleVehicles: ['CARRO', 'SUV', 'UTILITARIO'], active: true, allowsFixed: true },
    { id: 's3', name: 'Polimento Técnico', description: 'Correção de verniz (1 etapa)', durationMinutes: 240, price: 450, compatibleVehicles: ['CARRO', 'SUV'], active: true, allowsFixed: true },
    { id: 's4', name: 'Higienização Interna', description: 'Limpeza profunda de estofados', durationMinutes: 120, price: 200, compatibleVehicles: ['CARRO', 'SUV', 'UTILITARIO'], active: true, allowsFixed: true },
];

const DEFAULT_SETTINGS: BusinessSettings = {
    businessName: 'Carbon Detail',
    slug: 'carbon',
    boxCapacity: 3, patioCapacity: 5, slotIntervalMinutes: 30, onlineBookingEnabled: true, loyaltyProgramEnabled: true,
    operatingDays: [
      { dayOfWeek: 0, isOpen: false, openTime: '00:00', closeTime: '00:00' },
      { dayOfWeek: 1, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 2, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 3, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 4, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 5, isOpen: true, openTime: '08:00', closeTime: '18:00' },
      { dayOfWeek: 6, isOpen: true, openTime: '09:00', closeTime: '14:00' },
    ],
    trialStartDate: new Date().toISOString(),
    subscriptionStatus: 'TRIAL',
    planType: PlanType.ELITE
};

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Roberto Silva',
    phone: '(11) 99999-1234',
    email: 'roberto@email.com',
    totalSpent: 1250.00,
    lastVisit: '2023-10-15',
    vehicles: [
      { id: 'v1', brand: 'BMW', model: 'X5', plate: 'ABC-1234', color: 'Preto', type: 'SUV' },
      { id: 'v2', brand: 'Porsche', model: '911', plate: 'XYZ-9999', color: 'Prata', type: 'CARRO' }
    ],
    xpPoints: 1250,
    washes: 7
  },
  {
    id: 'c2',
    name: 'Ana Souza',
    phone: '(11) 98888-5678',
    email: 'ana@email.com',
    totalSpent: 450.00,
    lastVisit: '2023-10-20',
    vehicles: [
      { id: 'v3', brand: 'Jeep', model: 'Compass', plate: 'BRA-2E19', color: 'Branco', type: 'SUV' }
    ],
    xpPoints: 450,
    washes: 3
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    customerId: 'c1',
    vehicleId: 'v1',
    serviceType: 'Vitrificação',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    durationMinutes: 240,
    price: 890.00,
    status: AppointmentStatus.EM_EXECUCAO,
    staffName: 'Carlos Detalhe',
    observation: 'Cliente extremamente exigente com as rodas.'
  },
  {
    id: 'a2',
    customerId: 'c2',
    vehicleId: 'v3',
    serviceType: 'Lavagem Detalhada',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    durationMinutes: 90,
    price: 150.00,
    status: AppointmentStatus.CONFIRMADO,
    staffName: 'João Mobile',
    observation: 'Cuidado com o sensor de ré que está solto.'
  }
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: 'p1', imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=300&h=200', description: 'Polimento Técnico Porsche', date: new Date().toISOString() }, 
  { id: 'p2', imageUrl: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80&w=300&h=200', description: 'Vitrificação BMW', date: new Date(Date.now() - 3 * 86400000).toISOString() },
];

const DEFAULT_REVIEWS: Review[] = [
  { id: 'r1', customerName: 'Roberto S.', rating: 5, comment: 'Melhor estética da região! O polimento ficou incrível.', date: '2023-10-10' },
];

const DEFAULT_EXPENSES: Expense[] = [
    { id: 'e1', description: 'Aluguel Base', amount: 1200, date: new Date().toISOString().split('T')[0], category: 'FIXO' },
];

export const MOCK_DB: Record<string, any> = {
    'carbon': {
        settings: DEFAULT_SETTINGS,
        customers: DEFAULT_CUSTOMERS,
        appointments: DEFAULT_APPOINTMENTS,
        services: DEFAULT_SERVICES,
        portfolio: DEFAULT_PORTFOLIO,
        reviews: DEFAULT_REVIEWS,
        expenses: DEFAULT_EXPENSES
    }
};

export const getTenantData = (slug: string | null) => {
    const tenantId = (slug && MOCK_DB[slug]) ? slug : 'carbon';
    return MOCK_DB[tenantId];
};

export const MOCK_CUSTOMERS = DEFAULT_CUSTOMERS;
export const MOCK_APPOINTMENTS = DEFAULT_APPOINTMENTS;
export const MOCK_PORTFOLIO = DEFAULT_PORTFOLIO;
export const MOCK_REVIEWS = DEFAULT_REVIEWS;

export const PLAN_FEATURES = {
  [PlanType.START]: {
    price: 47,
    features: ['Até 5 Agendamentos/Dia', 'Agenda Digital', 'Cadastro de Clientes', 'Link Público', 'Suporte Padrão'],
    maxClients: 100,
    hasIntelligence: false,
  },
  [PlanType.PRO]: {
    price: 97,
    features: ['Agendamentos Ilimitados', 'CRM Completo', 'Módulo de Marketing', 'Carbon Intelligence Basic', 'Portfólio Digital'],
    maxClients: 1000,
    hasIntelligence: true,
  },
  [PlanType.ELITE]: {
    price: 147,
    features: ['Tudo do PRO', 'Fluxo de Caixa & DRE', 'Carbon Intelligence Advanced', 'Suporte VIP via WhatsApp', 'Controle de Estoque'],
    maxClients: 999999,
    hasIntelligence: true,
  }
};
