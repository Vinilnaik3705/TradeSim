import React from 'react';
import { useMarket } from '../../context/MarketContext';

const MarketToggle = ({ className = '' }) => {
    const { marketType, toggleMarketType } = useMarket();

    return (
        <div className={`bg-slate-900/50 p-1 rounded-lg flex border border-slate-800 ${className}`}>
            <button
                onClick={() => toggleMarketType('stock')}
                className={`flex-1 text-xs font-bold py-2 px-3 rounded-md transition-all ${marketType === 'stock'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
            >
                Stocks
            </button>
            <button
                onClick={() => toggleMarketType('crypto')}
                className={`flex-1 text-xs font-bold py-2 px-3 rounded-md transition-all ${marketType === 'crypto'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
            >
                Crypto
            </button>
        </div>
    );
};

export default MarketToggle;
