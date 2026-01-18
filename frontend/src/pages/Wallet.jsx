import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { CreditCard, History, Plus, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';

export default function Wallet() {
    const navigate = useNavigate();
    const [balance] = useState(24500.00);

    const handleAddFunds = () => {
        navigate('/payment', {
            state: {
                amount: 1000, // Default deposit
                assetName: 'Wallet Deposit',
                assetSymbol: 'USD',
                quantity: 1,
                type: 'deposit'
            }
        });
    };

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto space-y-8">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Wallet</h2>
                    <p className="text-slate-500 mt-1">Manage funds and transactions</p>
                </div>

                {/* Balance Card - Premium Debit Card Look */}
                <div className="relative group perspective-1000">
                    <div className="bg-gradient-to-br from-[#0F172A] to-[#000] p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl h-[300px] flex flex-col justify-between transition-transform duration-500 hover:scale-[1.01]">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none" />
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-slate-400 font-medium mb-1 tracking-wide">Total Balance</p>
                                <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">${balance.toLocaleString()}</h1>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <WalletIcon size={32} className="text-white" />
                            </div>
                        </div>

                        <div className="relative z-10 flex gap-4 mt-8">
                            <button
                                onClick={() => window.location.href = '/payment'} // Simple redirect using window since useNavigate is inside component
                                className="bg-white text-black px-8 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-lg shadow-white/10 flex items-center gap-2 transform active:scale-95"
                            >
                                <Plus size={20} /> Add Funds
                            </button>
                            <button className="bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm border border-white/10 flex items-center gap-2">
                                <ArrowUpRight size={20} /> Withdraw
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Payment Methods */}
                    <BentoCard title="Payment Methods" icon={CreditCard}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-md border border-white/10 shadow-sm" />
                                    <div>
                                        <p className="font-bold text-white">Visa ending in 4242</p>
                                        <p className="text-xs text-slate-400">Expires 12/26</p>
                                    </div>
                                </div>
                                <span className="text-[10px] uppercase font-bold bg-accent/20 text-accent px-2.5 py-1 rounded-full border border-accent/20">Primary</span>
                            </div>
                            <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-medium">
                                <Plus size={18} /> Add New Method
                            </button>
                        </div>
                    </BentoCard>

                    {/* Transaction History */}
                    <BentoCard title="Recent Transactions" icon={History}>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {[
                                { type: 'Deposit', amount: 5000, date: 'Mar 15, 2024', status: 'Completed', icon: ArrowDownRight },
                                { type: 'Withdrawal', amount: -1200, date: 'Mar 12, 2024', status: 'Completed', icon: ArrowUpRight },
                                { type: 'Deposit', amount: 2000, date: 'Mar 01, 2024', status: 'Completed', icon: ArrowDownRight },
                            ].map((tx, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-success/10 text-success' : 'bg-white/5 text-slate-300'}`}>
                                            <tx.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white">{tx.type}</p>
                                            <p className="text-xs text-slate-500">{tx.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${tx.amount > 0 ? 'text-success' : 'text-white'}`}>
                                            {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-500">{tx.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>
            </div>
        </MainLayout>
    );
}
