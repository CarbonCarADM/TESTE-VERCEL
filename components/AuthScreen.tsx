
import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, ArrowRight, ArrowLeft, ShieldCheck, RefreshCw, Store, Sparkles, Check, X, AlertTriangle, Phone, Hash } from 'lucide-react';
import { BusinessModel } from '../types';
import { cn } from '../lib/utils';

interface AuthScreenProps {
  model: BusinessModel;
  role: 'CLIENT' | 'ADMIN';
  studioSlug?: string; 
  onLogin: (user: any) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ role, studioSlug, onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isClient = role === 'CLIENT';

  const passwordRequirements = useMemo(() => ({
    length: password.length >= 8,
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    uppercase: /[A-Z]/.test(password),
  }), [password]);

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const generateSlug = (text: string) => 
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w ]+/g, '').replace(/ +/g, '-');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Simulação de latência de rede para estética B2B
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isRegister) {
        if (!isPasswordValid) throw new Error("Senha fraca demais para os protocolos Carbon.");

        const finalSlug = isClient ? (studioSlug || '') : generateSlug(businessName);
        
        const newUser = {
            id: `user_${Date.now()}`,
            email: email.toLowerCase(),
            name: fullName,
            role: role,
            studio_slug: finalSlug,
            phone: phone
        };

        // Salvar localmente
        const savedUsers = JSON.parse(localStorage.getItem('carbon_local_users') || '[]');
        if (savedUsers.find((u: any) => u.email === newUser.email)) {
            throw new Error("Este e-mail já está registrado na rede Carbon.");
        }
        
        localStorage.setItem('carbon_local_users', JSON.stringify([...savedUsers, newUser]));
        
        setSuccessMsg("Expansão confirmada! Ative seu acesso fazendo login agora.");
        setEmail(''); setPassword('');
        setTimeout(() => setIsRegister(false), 2000);
      } else {
        // Mock Login
        const savedUsers = JSON.parse(localStorage.getItem('carbon_local_users') || '[]');
        
        // Login Admin Padrão para Demo
        if (email.toLowerCase() === 'admin@carbon.com' && password === 'Carbon2025!') {
            onLogin({ id: 'admin_1', name: 'Master Admin', role: 'ADMIN', studio_slug: 'carbon' });
            return;
        }

        const user = savedUsers.find((u: any) => u.email === email.toLowerCase());
        if (!user) throw new Error("Credenciais não localizadas no banco tático.");
        
        onLogin(user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
        "min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-all duration-700",
        isClient ? "bg-[#050505]" : "bg-[#020202]"
    )}>
      <div className="absolute inset-0 scanner-grid opacity-[0.05] pointer-events-none" />
      <div className={cn("absolute top-0 left-0 w-full h-1.5", isClient ? "bg-blue-600 shadow-glow" : "bg-red-600 shadow-glow-red")} />

      <div className="w-full max-w-xl relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
            <div className={cn("inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-3xl mb-8", isClient ? "border-blue-500/20" : "border-red-500/20")}>
                <ShieldCheck size={14} className={isClient ? "text-blue-500" : "text-red-600"} />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-500">
                    {isRegister ? 'New Hangar Protocol' : 'Identity Verification'}
                </span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2 italic">
                {isClient ? 'Hangar Concierge' : 'Centro de Comando'}
            </h1>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.4em]">
                {studioSlug ? `Hangar Local: ${studioSlug.toUpperCase()}` : 'Carbon OS Intelligence'}
            </p>
        </div>

        <div className="bg-zinc-900/90 border border-white/10 rounded-[3rem] shadow-hero backdrop-blur-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <AlertTriangle size={14} className="text-red-500 mt-1 flex-shrink-0" />
                    <p className="text-red-500 text-[9px] font-black uppercase tracking-widest leading-relaxed whitespace-pre-wrap">{error}</p>
                </div>
            )}

            {successMsg && (
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2">
                    <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-green-500 text-[9px] font-black uppercase tracking-widest leading-relaxed">{successMsg}</p>
                </div>
            )}

            {isRegister && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Responsável</label>
                        <input required type="text" placeholder="NOME" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-bold uppercase outline-none focus:border-white transition-all" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">WhatsApp</label>
                        <input required type="tel" placeholder="(00) 00000-0000" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-bold uppercase outline-none focus:border-white transition-all" value={phone} onChange={e => setPhone(e.target.value)} />
                    </div>
                    {!isClient && (
                        <div className="col-span-2 space-y-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Nome da Estética</label>
                                <input required type="text" placeholder="CARBON DETAIL" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl px-6 py-4 text-white text-[10px] font-bold uppercase outline-none focus:border-red-600 transition-all" value={businessName} onChange={e => setBusinessName(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Identificador E-mail</label>
                <div className="relative">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                    <input required type="email" placeholder="ACESSO@CARBON.COM" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white text-[10px] font-bold uppercase outline-none focus:border-white transition-all" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-600 uppercase ml-2 tracking-widest">Senha de Acesso</label>
                <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                    <input required type="password" placeholder="••••••••" className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-white transition-all" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
            </div>

            <button type="submit" disabled={loading} className={cn(
                "w-full py-5 rounded-full font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 active:scale-95 mt-4 text-[10px]",
                isClient ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-red-600 text-white hover:bg-red-700 shadow-glow-red"
            )}>
                {loading ? <RefreshCw className="animate-spin" size={18} /> : (isRegister ? 'Consolidar Registro' : 'Acessar Hangar')}
            </button>
          </form>

          <div className="bg-black/20 p-8 text-center border-t border-white/5">
            <button onClick={() => { setIsRegister(!isRegister); setError(null); setSuccessMsg(null); }} className="text-[9px] font-black text-zinc-500 uppercase tracking-widest underline hover:text-white transition-colors">
              {isRegister ? 'Já possuo credenciais' : isClient ? 'Não possuo cadastro' : 'Criar Novo Hangar (SaaS)'}
            </button>
          </div>
        </div>
        
        <button onClick={onBack} className="mx-auto mt-10 text-zinc-700 hover:text-white flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] transition-all">
          <ArrowLeft size={14} /> Voltar
        </button>
      </div>
    </div>
  );
};
