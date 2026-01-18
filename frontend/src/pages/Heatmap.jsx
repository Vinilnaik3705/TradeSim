import React, { useMemo, useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import BentoCard from '../components/ui/BentoCard';
import { TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}`;

const HeatmapContent = ({ root, depth, x, y, width, height, index, name, change }) => {
    const isPositive = change >= 0;
    const opacity = Math.min(Math.abs(change) / 10 + 0.4, 1); // Dynamic opacity based on magnitude
    const color = isPositive ? `rgba(34, 197, 94, ${opacity})` : `rgba(239, 68, 68, ${opacity})`;

    // Show text on medium and large boxes
    const showText = width > 30 && height > 30;
    const fontSize = width > 60 && height > 60 ? Math.min(width / 5, 16) : Math.min(width / 6, 11);
    const changeSize = width > 60 && height > 60 ? Math.min(width / 6, 12) : Math.min(width / 7, 10);

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: color,
                    stroke: '#000',
                    strokeWidth: 2,
                    strokeOpacity: 0.5,
                }}
            />
            {showText && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 - 8}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={fontSize}
                    fontWeight="bold"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                    {name}
                </text>
            )}
            {showText && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 12}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.9)"
                    fontSize={changeSize}
                    fontWeight="medium"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                >
                    {change > 0 ? '+' : ''}{change?.toFixed(2)}%
                </text>
            )}
        </g>
    );
};

export default function Heatmap() {
    const [activeTab, setActiveTab] = useState('crypto'); // 'stocks' or 'crypto'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch top 50 assets for better visualization (not too crowded)
                const limit = 50;
                const endpoint = activeTab === 'crypto'
                    ? `${API_URL}/crypto/market-cap?limit=${limit}`
                    : `${API_URL}/stocks/top?limit=${limit}`;

                const response = await axios.get(endpoint);

                // Transform for Treemap
                let mappedData;
                if (activeTab === 'crypto') {
                    mappedData = (response.data.data || response.data).map(item => ({
                        name: item.symbol?.replace('USDT', '') || item.baseAsset,
                        size: parseFloat(item.quoteVolume) || parseFloat(item.volume) || 1000,
                        change: parseFloat(item.changePercent) || parseFloat(item.priceChangePercent) || 0
                    }));
                } else {
                    mappedData = (response.data.data || response.data).map(item => ({
                        name: item.symbol,
                        size: parseFloat(item.marketCap) || parseFloat(item.volume) || 1000,
                        change: parseFloat(item.changePercent) || parseFloat(item.change) || 0
                    }));
                }

                // Filter out invalid data and sort by size (largest first)
                const validData = mappedData
                    .filter(item =>
                        item.name &&
                        !isNaN(item.size) &&
                        !isNaN(item.change) &&
                        item.size > 0
                    )
                    .sort((a, b) => b.size - a.size); // Sort by size descending

                setData(validData);
            } catch (error) {
                console.error('Heatmap data fetch error:', error);

                // Fallback mock data if API fails (to show UI)
                const mock = activeTab === 'crypto'
                    ? [
                        { name: 'BTC', size: 50000, change: 2.5 },
                        { name: 'ETH', size: 30000, change: -1.2 },
                        { name: 'SOL', size: 10000, change: 5.4 }
                    ]
                    : [
                        { name: 'AAPL', size: 50000, change: 1.2 },
                        { name: 'MSFT', size: 48000, change: 0.5 },
                        { name: 'NVDA', size: 40000, change: 3.2 }
                    ];
                setData(mock);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Market Heatmap
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            Visualize market performance by market capitalization and 24h change
                        </p>
                    </div>

                    {/* Toggle Switch */}
                    <div className="bg-slate-900 border border-white/10 p-1 rounded-xl flex">
                        <button
                            onClick={() => setActiveTab('stocks')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'stocks' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            Stocks
                        </button>
                        <button
                            onClick={() => setActiveTab('crypto')}
                            className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'crypto' ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                        >
                            Crypto
                        </button>
                    </div>
                </div>

                <div className="bg-secondary/30 rounded-2xl border border-slate-700/50 p-6 h-[70vh] relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm rounded-2xl">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <Treemap
                            data={data}
                            dataKey="size"
                            stroke="#fff"
                            fill="#8884d8"
                            content={<HeatmapContent />}
                            aspectRatio={4 / 3}
                        >
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value, name, props) => [`${props.payload.change}%`, 'Change']}
                            />
                        </Treemap>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-8 py-4 px-6 bg-slate-900/50 rounded-xl border border-white/5 w-fit mx-auto">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-success/80" />
                        <span className="text-xs text-slate-400">Positive Change</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-danger/80" />
                        <span className="text-xs text-slate-400">Negative Change</span>
                    </div>
                    <div className="text-xs text-slate-500 italic">Tile size = Market Cap / Volume</div>
                </div>
            </div>
        </MainLayout>
    );
}
