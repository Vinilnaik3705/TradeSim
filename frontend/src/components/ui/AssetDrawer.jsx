import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock chart data for sparkline
const mockChartData = [
    { time: '10:00', value: 45000 },
    { time: '11:00', value: 45200 },
    { time: '12:00', value: 44800 },
    { time: '13:00', value: 45500 },
    { time: '14:00', value: 46000 },
    { time: '15:00', value: 45800 },
    { time: '16:00', value: 45230 },
];

const AssetDrawer = ({ isOpen, onClose, asset }) => {
    const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
    const [amount, setAmount] = useState('');

    if (!asset) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[480px] bg-[#0A0A0A] border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-bold text-lg text-white border border-white/5">
                                    {asset.symbol[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{asset.name}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">{asset.symbol}</span>
                                        <Link
                                            to={`/trade/${asset.id}`}
                                            className="text-xs font-bold text-accent hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            Full Chart <ArrowUpRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Price & Change */}
                            <div>
                                <h1 className="text-4xl font-bold text-white tracking-tight">${asset.price.toLocaleString()}</h1>
                                <div className={`flex items-center gap-2 mt-2 font-bold ${asset.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {asset.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                    <span className="text-lg">{Math.abs(asset.change)}%</span>
                                    <span className="text-slate-500 text-sm font-normal ml-1">Past 24h</span>
                                </div>
                            </div>

                            {/* Mini Chart */}
                            <div className="h-[200px] w-full bg-white/5 rounded-2xl border border-white/5 p-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={mockChartData}>
                                        <defs>
                                            <linearGradient id="colorValueDrawer" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={asset.change >= 0 ? '#4ADE80' : '#F87171'} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={asset.change >= 0 ? '#4ADE80' : '#F87171'} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={asset.change >= 0 ? '#4ADE80' : '#F87171'}
                                            strokeWidth={2}
                                            fill="url(#colorValueDrawer)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Key Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Activity size={16} /> <span className="text-xs uppercase font-bold">Volume</span>
                                    </div>
                                    <p className="text-white font-bold">{asset.volume}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <BarChart2 size={16} /> <span className="text-xs uppercase font-bold">Market Cap</span>
                                    </div>
                                    <p className="text-white font-bold">{asset.marketCap}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <Activity size={16} /> <span className="text-xs uppercase font-bold">Open</span>
                                    </div>
                                    <p className="text-white font-bold">${(asset.price * 0.98).toFixed(2)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <TrendingUp size={16} /> <span className="text-xs uppercase font-bold">High</span>
                                    </div>
                                    <p className="text-white font-bold">${(asset.price * 1.05).toFixed(2)}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                                        <TrendingDown size={16} /> <span className="text-xs uppercase font-bold">Low</span>
                                    </div>
                                    <p className="text-white font-bold">${(asset.price * 0.95).toFixed(2)}</p>
                                </div>
                            </div>

                            {/* Trade Panel */}
                            <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                                <div className="flex border-b border-white/5">
                                    <button
                                        onClick={() => setActiveTab('buy')}
                                        className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'buy' ? 'bg-success/10 text-success border-b-2 border-success' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Buy {asset.symbol}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('sell')}
                                        className={`flex-1 py-4 font-bold text-sm transition-colors ${activeTab === 'sell' ? 'bg-danger/10 text-danger border-b-2 border-danger' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        Sell {asset.symbol}
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Order Type Selector */}
                                    <div className="flex bg-black rounded-lg p-1 border border-white/10">
                                        <button className="flex-1 py-1.5 text-xs font-bold rounded bg-white/10 text-white shadow-sm">
                                            Market
                                        </button>
                                        <button disabled className="flex-1 py-1.5 text-xs font-bold rounded text-slate-600 cursor-not-allowed">
                                            Limit (Soon)
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs uppercase font-bold text-slate-500">Amount (USD)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-4 text-white text-lg font-bold focus:outline-none focus:border-accent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between text-sm text-slate-400">
                                        <span>Available Balance</span>
                                        <span className="text-white font-bold">$24,500.00</span>
                                    </div>

                                    <button className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${activeTab === 'buy' ? 'bg-success hover:bg-green-400 text-black' : 'bg-danger hover:bg-red-400 text-white'}`}>
                                        {activeTab === 'buy' ? 'Buy Now' : 'Sell Now'}
                                    </button>

                                    <p className="text-center text-xs text-slate-500">
                                        Market orders are executed instantly at the best available price.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AssetDrawer;
