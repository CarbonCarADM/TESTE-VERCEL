
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Schedule } from './components/Schedule';
import { CRM } from './components/CRM';
import { FinancialModule } from './components/FinancialModule';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Settings } from './components/Settings';
import { PublicBooking } from './components/PublicBooking';
import { AuthScreen } from './components/AuthScreen';
import { MarketingModule } from './components/MarketingModule';
import { PlanType, Customer, Appointment, AppointmentStatus, BusinessModel, Expense, ServiceItem, BusinessSettings, PortfolioItem, Review, BillingCycle } from './types';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { getTenantData, PLAN_FEATURES } from './constants';
import { cn } from './lib/utils';

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlSlug = urlParams.get('studio');
  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [viewState, setViewState] = useState<'WELCOME' | 'AUTH' | 'DASHBOARD' | 'PUBLIC_BOOKING'>(
      urlSlug ? 'PUBLIC_BOOKING' : 'WELCOME'
  );
  
  const [selectedModel, setSelectedModel] = useState<BusinessModel>('FIXED');
  const [authRole, setAuthRole] = useState<'CLIENT' | 'ADMIN' | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dbStatus, setDbStatus] = useState<'IDLE' | 'SYNCING' | 'CONNECTED' | 'ERROR'>('IDLE');
  const [toast, setToast] = useState<{show: boolean, msg: string} | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [currentPlan, setCurrentPlan] = useState<PlanType>(PlanType.START);
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    businessName: 'Carregando...', slug: '', address: '', boxCapacity: 1, patioCapacity: 2, slotIntervalMinutes: 30, operatingDays: [], onlineBookingEnabled: true, loyaltyProgramEnabled: false, planType: PlanType.START
  });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast(null), 4000);
  };

  // Persistência Local
  const saveToLocal = (key: string, data: any) => {
    const slug = businessSettings.slug || 'default';
    localStorage.setItem(`carbon_${slug}_${key}`, JSON.stringify(data));
  };

  const loadFromLocal = (key: string, defaultValue: any) => {
    const slug = businessSettings.slug || 'default';
    const saved = localStorage.getItem(`carbon_${slug}_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  };

  // Inicialização de Dados
  useEffect(() => {
    const initialData = getTenantData(urlSlug);
    
    // Se for o primeiro acesso, carregar mock data, senão carregar do localStorage
    const savedSettings = loadFromLocal('settings', initialData.settings);
    setBusinessSettings(savedSettings);
    setCurrentPlan(savedSettings.planType || PlanType.START);
    
    setCustomers(loadFromLocal('customers', initialData.customers));
    setAppointments(loadFromLocal('appointments', initialData.appointments));
    setServices(loadFromLocal('services', initialData.services));
    setExpenses(loadFromLocal('expenses', initialData.expenses));
    setPortfolio(loadFromLocal('portfolio', initialData.portfolio));
    setReviews(loadFromLocal('reviews', initialData.reviews));
    
    setDbStatus('CONNECTED');

    // Verificar sessão mock
    const savedUser = localStorage.getItem('carbon_current_user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthRole(user.role);
        if (user.role === 'ADMIN') setViewState('DASHBOARD');
        else if (urlSlug) setViewState('PUBLIC_BOOKING');
    }
  }, [urlSlug]);

  const handleLogout = () => {
    localStorage.removeItem('carbon_current_user');
    setCurrentUser(null);
    setViewState(urlSlug ? 'PUBLIC_BOOKING' : 'WELCOME');
    setAuthRole(null);
  };

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem('carbon_current_user', JSON.stringify(user));
    setCurrentUser(user);
    setAuthRole(user.role);
    if (user.role === 'ADMIN') setViewState('DASHBOARD');
    else setViewState('PUBLIC_BOOKING');
    showToast(`Bem-vindo, ${user.name}`);
  };

  const updateAppointments = (newApts: Appointment[]) => {
    setAppointments(newApts);
    saveToLocal('appointments', newApts);
  };

  const updateSettings = (newSettings: BusinessSettings) => {
    setBusinessSettings(newSettings);
    saveToLocal('settings', newSettings);
  };

  if (viewState === 'WELCOME') return <WelcomeScreen onSelectFlow={(role, model) => { setAuthRole(role); setSelectedModel(model); setViewState('AUTH'); }} />;
  
  if (viewState === 'AUTH') return (
    <AuthScreen 
        model={selectedModel} 
        role={authRole || 'CLIENT'} 
        studioSlug={urlSlug || businessSettings.slug} 
        onLogin={handleLoginSuccess} 
        onBack={() => setViewState(urlSlug ? 'PUBLIC_BOOKING' : 'WELCOME')} 
    />
  );
  
  if (viewState === 'PUBLIC_BOOKING') return (
    <PublicBooking 
        businessSettings={businessSettings} 
        services={services} 
        existingAppointments={appointments} 
        portfolio={portfolio} 
        reviews={reviews}
        onBookingComplete={(apt) => {
            const newApts = [...appointments, apt];
            updateAppointments(newApts);
            showToast("Protocolo Agendado com Sucesso!");
        }}
        onExit={handleLogout}
    />
  );

  return (
    <div className="min-h-screen bg-[#020202] flex font-sans overflow-hidden text-zinc-100 relative">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentPlan={currentPlan} 
        businessModel={selectedModel} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onUpgrade={() => setActiveTab('settings')} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 w-full relative overflow-y-auto h-screen">
        <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-10">
          <h2 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] italic">{businessSettings.businessName}</h2>
          <div className={cn("px-4 py-1.5 rounded-full border text-[8px] font-black uppercase tracking-widest", dbStatus === 'CONNECTED' ? "border-green-500/20 text-green-500" : "border-yellow-500/20 text-yellow-500")}>
              {dbStatus === 'CONNECTED' ? 'Hangar Offline Mode' : 'Sincronizando...'}
          </div>
        </div>
        
        <div style={{ zoom: '0.9' }}>
            {activeTab === 'dashboard' && (
                <Dashboard 
                    currentPlan={currentPlan} 
                    appointments={appointments} 
                    customers={customers} 
                    onUpgrade={() => setActiveTab('settings')} 
                    setActiveTab={setActiveTab} 
                    businessSettings={businessSettings} 
                    businessModel={selectedModel} 
                    onUpdateStatus={(id, status) => {
                        const newApts = appointments.map(a => a.id === id ? { ...a, status } : a);
                        updateAppointments(newApts);
                    }} 
                />
            )}
            {activeTab === 'schedule' && (
                <Schedule 
                    appointments={appointments} 
                    customers={customers} 
                    onAddAppointment={(apt) => updateAppointments([...appointments, apt])} 
                    onUpdateStatus={(id, status) => {
                        const newApts = appointments.map(a => a.id === id ? { ...a, status } : a);
                        updateAppointments(newApts);
                    }} 
                    businessModel={selectedModel} 
                    settings={businessSettings} 
                    onUpgrade={() => setActiveTab('settings')} 
                />
            )}
            {activeTab === 'crm' && (
                <CRM 
                    customers={customers} 
                    onAddCustomer={(c) => { setCustomers([...customers, c]); saveToLocal('customers', [...customers, c]); }} 
                    onDeleteCustomer={(id) => { setCustomers(customers.filter(c => c.id !== id)); saveToLocal('customers', customers.filter(c => c.id !== id)); }} 
                    businessSettings={businessSettings} 
                    onUpdateSettings={updateSettings} 
                />
            )}
            {activeTab === 'finance' && (
                <FinancialModule 
                    appointments={appointments} 
                    expenses={expenses} 
                    onAddExpense={(e) => { setExpenses([...expenses, e]); saveToLocal('expenses', [...expenses, e]); }} 
                    currentPlan={currentPlan} 
                    onUpgrade={() => setActiveTab('settings')} 
                />
            )}
            {activeTab === 'marketing' && (
                <MarketingModule 
                    portfolio={portfolio} 
                    reviews={reviews} 
                    currentPlan={currentPlan} 
                    onUpdatePortfolio={(p) => { setPortfolio(p); saveToLocal('portfolio', p); }} 
                    onReplyReview={(id, r) => { setReviews(reviews.map(rev => rev.id === id ? { ...rev, reply: r } : rev)); saveToLocal('reviews', reviews.map(rev => rev.id === id ? { ...rev, reply: r } : rev)); }} 
                    onUpgrade={() => setActiveTab('settings')} 
                />
            )}
            {activeTab === 'settings' && (
                <Settings 
                    businessModel={selectedModel} 
                    currentPlan={currentPlan} 
                    settings={businessSettings} 
                    services={services} 
                    onUpdateSettings={updateSettings} 
                    onUpdateServices={(s) => { setServices(s); saveToLocal('services', s); }} 
                    onUpgrade={(p) => { setCurrentPlan(p); updateSettings({...businessSettings, planType: p}); }} 
                />
            )}
        </div>
        
        {toast?.show && (
            <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right">
                <div className="bg-zinc-900 border border-white/10 rounded-2xl p-5 flex items-center gap-4 shadow-2xl backdrop-blur-3xl">
                    <ShieldCheck className="text-green-500" /> 
                    <p className="text-xs font-bold text-white uppercase">{toast.msg}</p>
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;
