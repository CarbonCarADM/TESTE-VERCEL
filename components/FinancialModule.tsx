
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
    DollarSign, TrendingUp, TrendingDown, Wallet, Download, CreditCard, 
    ArrowUpRight, ArrowDownRight, Plus, X, Save, FileText, Settings, 
    AlertCircle, CheckCircle2, RefreshCw, FileCheck
} from 'lucide-react';
import { Appointment, AppointmentStatus, Expense, PlanType } from '../types';

interface FinancialModuleProps {
  appointments: Appointment[];
  expenses: Expense[];
  onAddExpense: (expense: Expense) => void;
  currentPlan: PlanType;
  onUpgrade: () => void;
}

export const FinancialModule: React.FC<FinancialModuleProps> = ({ appointments, expenses, onAddExpense, currentPlan, onUpgrade }) => {
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    
    // --- REAL CALCULATIONS ---
    const completedAppointments = appointments.filter(a => 
        a.status !== AppointmentStatus.CANCELADO
    );
    
    // Revenue
    const totalRevenue = completedAppointments.reduce((acc, curr) => acc + curr.price, 0);
    
    // Costs
    const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    
    const netProfit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // --- CHART PREPARATION ---
    const expensesByCategory = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);

    const expenseData = Object.keys(expensesByCategory).map(key => ({
        name: key,
        value: expensesByCategory[key]
    }));

    const displayExpenseData = expenseData.length > 0 ? expenseData : [{ name: 'Sem Dados', value: 1 }];
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#71717a'];

    const cashFlowData = [
        { name: 'Sem 1', receita: totalRevenue * 0.2, despesa: totalExpenses * 0.25 },
        { name: 'Sem 2', receita: totalRevenue * 0.15, despesa: totalExpenses * 0.2 },
        { name: 'Sem 3', receita: totalRevenue * 0.35, despesa: totalExpenses * 0.3 },
        { name: 'Sem 4', receita: totalRevenue * 0.3, despesa: totalExpenses * 0.25 },
    ];

    // Expense Form State
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        description: '', amount: 0, category: 'FIXO', date: new Date().toISOString().split('T')[0]
    });

    const handleSaveExpense = () => {
        if (!newExpense.description || !newExpense.amount) return;
        const expense: Expense = {
            id: `e_${Date.now()}`,
            description: newExpense.description,
            amount: Number(newExpense.amount),
            date: newExpense.date || new Date().toISOString().split('T')[0],
            category: newExpense.category as any
        };
        onAddExpense(expense);
        setIsExpenseModalOpen(false);
        setNewExpense({ description: '', amount: 0, category: 'FIXO', date: new Date().toISOString().split('T')[0] });
    };

    if (currentPlan !== PlanType.ELITE) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-fade-in">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md shadow-2xl">
                    <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800">
                        <Wallet className="text-purple-500 w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Módulo Financeiro Elite</h2>
                    <p className="text-zinc-500 mb-6">
                        O controle total de DRE, fluxo de caixa e gestão de despesas está disponível exclusivamente no plano <strong>ELITE</strong>.
                    </p>
                    <button 
                        onClick={onUpgrade}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-purple-900/20"
                    >
                        Fazer Upgrade Agora
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 pb-24 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-green-500" />
                        Gestão Financeira
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        Controle de fluxo de caixa e DRE em tempo real.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsExpenseModalOpen(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-red-900/20"
                    >
                        <Plus size={16} /> Lançar Despesa
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Receita Total</p>
                    <h3 className="text-2xl font-bold text-white">R$ {totalRevenue.toFixed(2)}</h3>
                    <div className="flex items-center gap-1 text-green-500 text-xs mt-2 font-bold">
                        <ArrowUpRight size={14} /> +12% vs mês anterior
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Despesas</p>
                    <h3 className="text-2xl font-bold text-white">R$ {totalExpenses.toFixed(2)}</h3>
                    <div className="flex items-center gap-1 text-red-500 text-xs mt-2 font-bold">
                        <ArrowUpRight size={14} /> +5% vs mês anterior
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 relative overflow-hidden">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Lucro Líquido</p>
                    <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        R$ {netProfit.toFixed(2)}
                    </h3>
                    <div className="absolute right-0 bottom-0 p-4 opacity-10">
                        <DollarSign size={48} className="text-white" />
                    </div>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                    <p className="text-zinc-500 text-xs font-bold uppercase mb-2">Margem</p>
                    <h3 className="text-2xl font-bold text-white">{margin.toFixed(1)}%</h3>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${Math.min(margin, 100)}%` }} />
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-zinc-400" /> Fluxo de Caixa (30 dias)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashFlowData}>
                                <defs>
                                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="receita" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" name="Receitas" />
                                <Area type="monotone" dataKey="despesa" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorDespesa)" name="Despesas" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Expenses Pie Chart */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <AlertCircle size={18} className="text-zinc-400" /> Distribuição de Gastos
                    </h3>
                    <div className="h-48 relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={displayExpenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {displayExpenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xs text-zinc-500 font-bold uppercase">Categorias</span>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {displayExpenseData.map((entry, index) => (
                            <div key={index} className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-zinc-300">{entry.name}</span>
                                </div>
                                <span className="text-white font-bold">
                                    {((entry.value / totalExpenses) * 100).toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Recent Revenues */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="text-white font-bold text-sm uppercase tracking-widest">Últimas Receitas</h3>
                         <button className="text-xs text-zinc-500 hover:text-white transition-colors">Ver todas</button>
                     </div>
                     <div className="space-y-4">
                         {completedAppointments.slice(0, 5).map(apt => (
                             <div key={apt.id} className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-green-900/20 text-green-500 flex items-center justify-center">
                                         <ArrowDownRight size={16} />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-white">{apt.serviceType}</p>
                                         <p className="text-xs text-zinc-500">{apt.date}</p>
                                     </div>
                                 </div>
                                 <span className="text-green-500 font-bold text-sm">+ R$ {apt.price.toFixed(2)}</span>
                             </div>
                         ))}
                         {completedAppointments.length === 0 && <p className="text-zinc-500 text-xs italic text-center">Nenhuma receita registrada.</p>}
                     </div>
                 </div>

                 {/* Recent Expenses */}
                 <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="text-white font-bold text-sm uppercase tracking-widest">Últimas Despesas</h3>
                         <button className="text-xs text-zinc-500 hover:text-white transition-colors">Ver todas</button>
                     </div>
                     <div className="space-y-4">
                         {expenses.slice(0, 5).map(exp => (
                             <div key={exp.id} className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                 <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center">
                                         <ArrowUpRight size={16} />
                                     </div>
                                     <div>
                                         <p className="text-sm font-bold text-white">{exp.description}</p>
                                         <p className="text-xs text-zinc-500">{exp.category}</p>
                                     </div>
                                 </div>
                                 <span className="text-red-500 font-bold text-sm">- R$ {exp.amount.toFixed(2)}</span>
                             </div>
                         ))}
                         {expenses.length === 0 && <p className="text-zinc-500 text-xs italic text-center">Nenhuma despesa registrada.</p>}
                     </div>
                 </div>
            </div>

            {/* Expense Modal */}
            {isExpenseModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Lançar Despesa</h3>
                        <div className="space-y-3">
                            <input 
                                placeholder="Descrição (ex: Conta de Luz)"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white"
                                value={newExpense.description}
                                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input 
                                    type="number"
                                    placeholder="Valor (R$)"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white"
                                    value={newExpense.amount || ''}
                                    onChange={(e) => setNewExpense({...newExpense, amount: Number(e.target.value)})}
                                />
                                <input 
                                    type="date"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white"
                                    value={newExpense.date}
                                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                                />
                            </div>
                            <select 
                                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white"
                                value={newExpense.category}
                                onChange={(e) => setNewExpense({...newExpense, category: e.target.value as any})}
                            >
                                <option value="FIXO">Custo Fixo</option>
                                <option value="VARIAVEL">Custo Variável</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="IMPOSTO">Impostos</option>
                            </select>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setIsExpenseModalOpen(false)} className="flex-1 py-2 text-zinc-400">Cancelar</button>
                            <button onClick={handleSaveExpense} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
