import React, { useState, useEffect } from 'react';

const generateLadder = (basePrice, count, step, type) => {
    return Array.from({ length: count }, (_, i) => {
        const price = type === 'ask' ? basePrice + (i + 1) * step : basePrice - (i + 1) * step;
        const size = Math.random() * 2 + 0.1;
        return { price, size, total: 0 };
    });
};

export default function OrderBook({ basePrice = 45230.50, assetSymbol = 'BTC' }) {
    const [asks, setAsks] = useState([]);
    const [bids, setBids] = useState([]);

    useEffect(() => {
        const initialAsks = generateLadder(basePrice, 12, 5, 'ask').reverse();
        const initialBids = generateLadder(basePrice, 12, 5, 'bid');

        setAsks(initialAsks);
        setBids(initialBids);

        const interval = setInterval(() => {
            setAsks(prev => prev.map(a => ({ ...a, size: Math.max(0.1, a.size + (Math.random() - 0.5) * 0.2) })));
            setBids(prev => prev.map(b => ({ ...b, size: Math.max(0.1, b.size + (Math.random() - 0.5) * 0.2) })));
        }, 1000);

        return () => clearInterval(interval);
    }, [basePrice]);

    const maxTotal = 20; // Simulated max depth

    return (
        <div className="flex flex-col h-full bg-black/20 rounded-xl border border-white/5 overflow-hidden text-[10px]">
            <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/5">
                <span className="font-bold text-slate-400 uppercase tracking-widest">{assetSymbol} Order Book</span>
                <span className="text-[9px] text-slate-600">Spread: $1.20</span>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Headers */}
                <div className="grid grid-cols-3 px-3 py-1.5 text-slate-500 font-bold border-b border-white/5 bg-black/40">
                    <span>Price</span>
                    <span className="text-right">Size</span>
                    <span className="text-right">Total</span>
                </div>

                {/* Asks (Sells) */}
                <div className="flex-1 overflow-hidden flex flex-col-reverse">
                    {asks.map((ask, i) => (
                        <div key={i} className="grid grid-cols-3 px-3 py-1 relative group hover:bg-white/5 cursor-pointer">
                            <div className="absolute inset-0 bg-danger/10 origin-right transition-all" style={{ width: `${(ask.size / 3) * 100}%` }} />
                            <span className="text-danger font-bold z-10">{ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-right text-slate-300 z-10">{ask.size.toFixed(4)}</span>
                            <span className="text-right text-slate-500 z-10">{(ask.size * 1.5).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* Current Price Divider */}
                <div className="py-2 px-3 bg-white/5 border-y border-white/5 flex flex-col items-center">
                    <span className="text-lg font-bold text-white">${basePrice.toLocaleString()}</span>
                    <span className="text-[9px] text-success">↑ $45,235.00</span>
                </div>

                {/* Bids (Buys) */}
                <div className="flex-1 overflow-hidden">
                    {bids.map((bid, i) => (
                        <div key={i} className="grid grid-cols-3 px-3 py-1 relative group hover:bg-white/5 cursor-pointer">
                            <div className="absolute inset-0 bg-success/10 origin-right transition-all" style={{ width: `${(bid.size / 3) * 100}%` }} />
                            <span className="text-success font-bold z-10">{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <span className="text-right text-slate-300 z-10">{bid.size.toFixed(4)}</span>
                            <span className="text-right text-slate-500 z-10">{(bid.size * 1.5).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Trades Small Panel */}
            <div className="p-2 border-t border-white/5 bg-black/20">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 mb-2 uppercase">
                    <span>Recent Trades</span>
                    <span>Time</span>
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center mb-1">
                        <span className={i % 2 === 0 ? 'text-success' : 'text-danger'}>0.0452 BTC</span>
                        <span className="text-slate-500">12:04:3{i}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
