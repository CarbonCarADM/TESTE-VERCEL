
import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Star, Trash2, Plus, MessageSquare, Upload, ExternalLink, ThumbsUp, Store, Camera, X, Lock } from 'lucide-react';
import { PlanType, PortfolioItem, Review } from '../types';

interface MarketingModuleProps {
    portfolio: PortfolioItem[];
    onUpdatePortfolio: (items: PortfolioItem[]) => void;
    reviews: Review[];
    onReplyReview: (reviewId: string, reply: string) => void;
    currentPlan?: PlanType;
    onUpgrade?: () => void;
}

export const MarketingModule: React.FC<MarketingModuleProps> = ({ 
    portfolio, onUpdatePortfolio, reviews, onReplyReview, currentPlan, onUpgrade 
}) => {
    const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews'>('portfolio');
    const [newImage, setNewImage] = useState({ url: '', desc: '' });
    const [replyText, setReplyText] = useState<string>('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- PLAN LOCK ---
    if (currentPlan === PlanType.START) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-fade-in max-w-4xl mx-auto">
                <div className="bg-zinc-900 border border-zinc-800 p-10 rounded-2xl w-full shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    <div className="w-20 h-20 bg-zinc-950 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 group-hover:scale-110 transition-transform duration-500">
                        <ImageIcon className="text-purple-500 w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Módulo de Marketing & Reputação</h2>
                    <p className="text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed">
                        No plano START, você tem apenas a agenda. Faça upgrade para o <strong>PRO</strong> para desbloquear a Galeria de Fotos no app do cliente e gestão de Avaliações.
                    </p>
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8 text-left">
                        <div className="flex items-center gap-3 text-zinc-500 opacity-50">
                            <X size={16} /> Galeria de Fotos
                        </div>
                        <div className="flex items-center gap-3 text-zinc-500 opacity-50">
                            <X size={16} /> Gestão de Reviews
                        </div>
                        <div className="flex items-center gap-3 text-white font-bold">
                            <Lock size={16} className="text-purple-500" /> Galeria de Fotos
                        </div>
                        <div className="flex items-center gap-3 text-white font-bold">
                            <Lock size={16} className="text-purple-500" /> Gestão de Reviews
                        </div>
                    </div>
                    <button 
                        onClick={onUpgrade}
                        className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 hover:scale-105"
                    >
                        Desbloquear com Plano PRO
                    </button>
                </div>
            </div>
        );
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(prev => ({ ...prev, url: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImage = () => {
        if (!newImage.url || !newImage.desc) return;
        const newItem: PortfolioItem = {
            id: `p_${Date.now()}`,
            imageUrl: newImage.url,
            description: newImage.desc,
            date: new Date().toISOString()
        };
        onUpdatePortfolio([newItem, ...portfolio]);
        setNewImage({ url: '', desc: '' });
        if(fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDeleteImage = (id: string) => {
        if(confirm('Remover imagem do portfólio público?')) {
            onUpdatePortfolio(portfolio.filter(p => p.id !== id));
        }
    };

    const submitReply = (id: string) => {
        onReplyReview(id, replyText);
        setReplyingTo(null);
        setReplyText('');
    };

    return (
        <div className="p-6 md:p-10 pb-24 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ImageIcon className="text-purple-500" />
                        Marketing & Reputação
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        Gerencie o que seus clientes veem no agendamento público.
                    </p>
                </div>
                <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button 
                        onClick={() => setActiveTab('portfolio')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'portfolio' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Galeria (Portfólio)
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'reviews' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Avaliações ({reviews.length})
                    </button>
                </div>
            </div>

            {activeTab === 'portfolio' && (
                <div className="space-y-6">
                    {/* Upload Section */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Camera size={18} /> Adicionar Nova Foto
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Upload Area */}
                            <div className="md:col-span-1">
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`
                                        h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all group relative overflow-hidden
                                        ${newImage.url ? 'border-purple-500/50 bg-zinc-950' : 'border-zinc-700 bg-zinc-950/50 hover:bg-zinc-900 hover:border-purple-500/50'}
                                    `}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    
                                    {newImage.url ? (
                                        <>
                                            <img src={newImage.url} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white text-xs font-bold flex items-center gap-2"><Upload size={14}/> Alterar Foto</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload size={20} className="text-zinc-400 group-hover:text-purple-400" />
                                            </div>
                                            <p className="text-sm font-bold text-zinc-400 group-hover:text-white">Clique para carregar</p>
                                            <p className="text-xs text-zinc-600 mt-1">JPG, PNG (Max 5MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Inputs Area */}
                            <div className="md:col-span-2 flex flex-col justify-end space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Legenda da Foto</label>
                                    <input 
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 outline-none transition-colors"
                                        placeholder="Ex: Polimento Técnico Porsche 911"
                                        value={newImage.desc}
                                        onChange={e => setNewImage({...newImage, desc: e.target.value})}
                                    />
                                    <p className="text-[10px] text-zinc-600 mt-1">Essa descrição aparecerá para o cliente na galeria.</p>
                                </div>
                                
                                <div className="flex justify-end gap-3">
                                    {newImage.url && (
                                        <button 
                                            onClick={() => {
                                                setNewImage({ url: '', desc: '' });
                                                if(fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="px-4 py-2 text-zinc-500 hover:text-white text-sm font-medium transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleAddImage}
                                        disabled={!newImage.url || !newImage.desc}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-900/20"
                                    >
                                        <Plus size={16} /> Publicar na Galeria
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolio.map(item => (
                            <div key={item.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all">
                                <div className="aspect-video w-full overflow-hidden bg-zinc-950 relative">
                                    <img src={item.imageUrl} alt={item.description} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                         <button onClick={() => handleDeleteImage(item.id)} className="p-2 bg-red-600 rounded-full text-white hover:scale-110 transition-transform"><Trash2 size={18}/></button>
                                         <button className="p-2 bg-zinc-800 rounded-full text-white hover:scale-110 transition-transform"><ExternalLink size={18}/></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-white text-sm">{item.description}</h4>
                                    <p className="text-xs text-zinc-500 mt-1">Postado em {new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div className="grid gap-4">
                    {reviews.map(review => (
                        <div key={review.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">
                                        {review.customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{review.customerName}</h4>
                                        <div className="flex text-yellow-500 gap-0.5">
                                            {Array.from({length: 5}).map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-500">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            
                            <div className="pl-13 ml-12">
                                <p className="text-zinc-300 text-sm bg-zinc-950 p-3 rounded-lg border border-zinc-800/50 italic">
                                    "{review.comment}"
                                </p>

                                {review.reply ? (
                                    <div className="mt-3 flex items-start gap-2 ml-4">
                                        <div className="w-0.5 h-full bg-zinc-800 self-stretch min-h-[20px]"></div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-1">
                                                <Store size={10} /> Resposta da Estética
                                            </p>
                                            <p className="text-xs text-zinc-400">{review.reply}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        {replyingTo === review.id ? (
                                            <div className="animate-in fade-in slide-in-from-top-2">
                                                <textarea 
                                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-purple-500 outline-none resize-none"
                                                    rows={3}
                                                    placeholder="Escreva sua resposta..."
                                                    value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="flex gap-2 mt-2 justify-end">
                                                    <button onClick={() => setReplyingTo(null)} className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white">Cancelar</button>
                                                    <button onClick={() => submitReply(review.id)} className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors">Enviar Resposta</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setReplyingTo(review.id)}
                                                className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <MessageSquare size={12} /> Responder Avaliação
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
