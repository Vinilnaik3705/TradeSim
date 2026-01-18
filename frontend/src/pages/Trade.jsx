import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart2, Activity, Maximize2, Columns, Grid2X2, Trash2, ShoppingCart, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderBook from '../components/ui/OrderBook';
import StrategyBuilder from '../components/ui/StrategyBuilder';
import { useMarket } from '../context/MarketContext';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = API_BASE_URL; // Alias for local usage in this file

// Seeded random for deterministic data generation
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Hash function to convert string to number seed
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Global data cache to ensure consistency
const chartDataCache = {};

// Helper to get display name for assets
const getAssetDisplayName = (assetId) => {
    const assetMap = {
        'bitcoin': 'BTC',
        'ethereum': 'ETH',
        'solana': 'SOL',
        'AAPL': 'AAPL',
        'TSLA': 'TSLA',
        'MSFT': 'MSFT',
        'NVDA': 'NVDA',
        'GOOGL': 'GOOGL',
        'AMZN': 'AMZN'
    };
    return assetMap[assetId] || assetId.toUpperCase();
};

// Asset Search Modal Component
const AssetSearchModal = ({ isOpen, onClose, onSelect, currentAsset }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, stocks, crypto
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        const fetchAssets = async () => {
            setLoading(true);
            try {
                const [stocksRes, cryptoRes] = await Promise.all([
                    axios.get(`${API_URL}/stocks/top?limit=50`),
                    axios.get(`${API_URL}/crypto/market-cap?limit=50`)
                ]);

                const stockAssets = (stocksRes.data.data || []).map(s => ({
                    symbol: s.symbol,
                    name: s.name || s.symbol,
                    type: 'stocks',
                    price: s.price
                }));

                const cryptoAssets = (cryptoRes.data.data || []).map(c => ({
                    symbol: c.baseAsset || c.symbol.replace('USDT', ''),
                    name: c.baseAsset || c.symbol,
                    type: 'crypto',
                    price: c.price
                }));

                setAssets([...cryptoAssets, ...stockAssets]);
            } catch (error) {
                console.error('Failed to fetch assets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [isOpen]);

    const filteredAssets = assets
        .filter(a => filter === 'all' || a.type === filter)
        .filter(a =>
            a.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Search Assets</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Search Input */}
                <div className="p-6 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by symbol or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-accent"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 px-6 py-4 border-b border-white/10">
                    {['all', 'crypto', 'stocks'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === f
                                ? 'bg-accent text-white shadow-lg'
                                : 'bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Asset List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            No assets found
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredAssets.map(asset => (
                                <button
                                    key={asset.symbol}
                                    onClick={() => onSelect(asset)}
                                    className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${asset.symbol === currentAsset
                                        ? 'bg-accent/20 border-2 border-accent'
                                        : 'bg-slate-900/30 border border-white/5 hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${asset.type === 'crypto' ? 'bg-accent/20 text-accent' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {asset.symbol.charAt(0)}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-white">{asset.symbol}</div>
                                            <div className="text-xs text-slate-500">{asset.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">${asset.price?.toLocaleString() || 'N/A'}</div>
                                        <div className="text-xs text-slate-500 capitalize">{asset.type}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ChartInstance = ({ config, onUpdate, isSingle }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);

    // Fetch historical data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Determine if crypto or stock based on ID (simplified logic)
                const isCrypto = ['bitcoin', 'ethereum', 'solana', 'dogecoin'].includes(config.assetId.toLowerCase()) || config.assetId.endsWith('USDT');
                const endpoint = isCrypto ? `${API_URL}/crypto/history` : `${API_URL}/stocks/history`;

                // Map timeframe to API params
                const intervalMap = {
                    '1H': '1h',
                    '1D': '1d',
                    '1W': '1w',
                    '1M': '1M',
                    '1Y': '1M' // For 1Y we get monthly data
                };

                const limitMap = {
                    '1H': 24,
                    '1D': 30,
                    '1W': 52,
                    '1M': 12,
                    '1Y': 12
                };

                const response = await axios.get(endpoint, {
                    params: {
                        symbol: config.assetId,
                        interval: intervalMap[config.timeframe] || '1d',
                        limit: limitMap[config.timeframe] || 30
                    }
                });

                // Transform data for chart (OHLC format for candlestick)
                const chartData = response.data.map((d, index, arr) => {
                    const prevClose = index > 0 ? arr[index - 1].close : d.open;
                    return {
                        time: new Date(d.date).getTime() / 1000, // Unix timestamp for lightweight-charts
                        open: d.open,
                        high: d.high,
                        low: d.low,
                        close: d.close,
                        value: d.close, // For line chart fallback
                        volume: d.volume || 0,
                        change: d.close - prevClose,
                        sma: d.close * 0.95, // Mock indicators for now
                        ema: d.close * 0.98
                    };
                });

                setData(chartData);
            } catch (error) {
                console.error('Chart data fetch error:', error);
                // Fallback deterministic mock data if API fails
                setData(generateMockData(config.timeframe, config.assetId));
            } finally {
                setLoading(false);
            }
        };

        if (config.assetId) {
            fetchData();
        }
    }, [config.assetId, config.timeframe]);

    // Helper for deterministic fallback data
    const generateMockData = (tf, assetId) => {
        // Check cache first
        const cacheKey = `${assetId}-${tf}`;
        if (chartDataCache[cacheKey]) {
            return chartDataCache[cacheKey];
        }

        const now = Math.floor(Date.now() / 1000);
        const interval = tf === '1H' ? 3600 : tf === '1D' ? 86400 : tf === '1W' ? 604800 : 2592000;
        const baseSeed = hashCode(assetId + tf);

        const data = Array.from({ length: 20 }, (_, i) => {
            const seed = baseSeed + i;
            const basePrice = 45000 + seededRandom(seed) * 1000;
            const variation = seededRandom(seed + 1000) * 500;
            const closeVariation = (seededRandom(seed + 2000) - 0.5) * 200;

            return {
                time: now - (20 - i) * interval,
                open: basePrice,
                high: basePrice + variation,
                low: basePrice - variation,
                close: basePrice + closeVariation,
                value: basePrice + closeVariation,
                volume: seededRandom(seed + 3000) * 1000000,
                change: closeVariation,
                sma: basePrice * 0.98,
                ema: basePrice * 0.99
            };
        });

        // Cache the data
        chartDataCache[cacheKey] = data;
        return data;
    };

    const toggleIndicator = (key) => {
        onUpdate({
            ...config,
            indicators: { ...config.indicators, [key]: !config.indicators[key] }
        });
    };

    return (
        <div className={`relative bg-secondary/30 rounded-2xl border border-slate-700/50 flex overflow-hidden ${isSingle ? 'h-[600px]' : 'h-full'}`}>
            <div className="flex-1 flex flex-col p-4">
                {/* Chart Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="font-bold text-xl text-white">
                                {getAssetDisplayName(config.assetId)}
                            </div>
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-1.5 bg-slate-800/50 rounded-lg hover:bg-slate-700 transition-colors border border-white/10"
                                title="Search Assets"
                            >
                                <Search size={16} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg">
                            {['1H', '1D', '1W', '1M', '1Y'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => onUpdate({ ...config, timeframe: t })}
                                    className={`px-2 py-0.5 rounded text-xs font-bold ${config.timeframe === t ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onUpdate({ ...config, chartType: config.chartType === 'line' ? 'candlestick' : 'line' })}
                            className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white border border-white/5"
                            title={config.chartType === 'candlestick' ? 'Switch to Line Chart' : 'Switch to Candlestick'}
                        >
                            <BarChart2 size={14} />
                        </button>
                        <div className="relative group/ind">
                            <button className="p-1.5 bg-slate-800 rounded-lg text-slate-300 hover:text-white border border-white/5">
                                <Activity size={14} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-32 bg-[#0A0A0A] border border-white/10 rounded-xl p-2 z-10 hidden group-hover/ind:block shadow-xl">
                                {['sma', 'ema'].map(ind => (
                                    <button
                                        key={ind}
                                        onClick={() => toggleIndicator(ind)}
                                        className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg hover:bg-white/5 ${config.indicators[ind] ? 'text-accent' : 'text-slate-500'}`}
                                    >
                                        {ind.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chart Body - Using Recharts for reliable display */}
                <div className="flex-1 min-h-0 relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 backdrop-blur-sm rounded-xl">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        </div>
                    )}
                    {!loading && data.length > 0 && (
                        <ResponsiveContainer width="100%" height={isSingle ? 540 : 300}>
                            <ComposedChart data={data}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#64748B"
                                    tick={{ fill: '#64748B', fontSize: 11 }}
                                    tickFormatter={(time) => {
                                        const date = new Date(time * 1000);
                                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                                    }}
                                />
                                <YAxis
                                    stroke="#64748B"
                                    tick={{ fill: '#64748B', fontSize: 11 }}
                                    domain={['auto', 'auto']}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#0A0A0A',
                                        border: '1px solid #262626',
                                        borderRadius: '8px',
                                        padding: '8px'
                                    }}
                                    labelStyle={{ color: '#94A3B8' }}
                                    itemStyle={{ color: '#22C55E' }}
                                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Price']}
                                    labelFormatter={(time) => {
                                        const date = new Date(time * 1000);
                                        return date.toLocaleString();
                                    }}
                                />
                                {config.chartType === 'candlestick' ? (
                                    <>
                                        <Bar dataKey="close" fill="url(#colorPrice)" radius={[4, 4, 0, 0]} />
                                        <Line type="monotone" dataKey="close" stroke="#22C55E" strokeWidth={2} dot={false} />
                                    </>
                                ) : (
                                    <Area
                                        type="monotone"
                                        dataKey="close"
                                        stroke="#22C55E"
                                        strokeWidth={2}
                                        fill="url(#colorPrice)"
                                    />
                                )}
                                {config.indicators.sma && (
                                    <Line type="monotone" dataKey="sma" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
                                )}
                                {config.indicators.ema && (
                                    <Line type="monotone" dataKey="ema" stroke="#3B82F6" strokeWidth={1.5} dot={false} />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                    {!loading && data.length === 0 && (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            No chart data available
                        </div>
                    )}
                </div>
            </div>

            {/* Asset Search Modal */}
            <AssetSearchModal
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                onSelect={(asset) => {
                    onUpdate({ ...config, assetId: asset.symbol });
                    setShowSearch(false);
                }}
                currentAsset={config.assetId}
            />
        </div>
    );
};

export default function Trade() {
    const { assetId } = useParams();
    const navigate = useNavigate();
    const [layout, setLayout] = useState('single'); // single, split-h, split-v, quad
    const [quantity, setQuantity] = useState('');
    const [currentPrice, setCurrentPrice] = useState(0);

    // Default config template
    const createConfig = (id, asset = assetId || 'bitcoin') => ({
        id,
        assetId: asset,
        timeframe: '1D',
        chartType: 'candlestick', // 'candlestick' or 'line'
        indicators: { sma: false, ema: false }
    });

    const [configs, setConfigs] = useState(() => {
        const saved = localStorage.getItem('tradesim_chart_layout');
        if (saved) return JSON.parse(saved);
        return [createConfig(1)];
    });

    // Sync URL param to configs
    useEffect(() => {
        if (assetId && configs[0].assetId !== assetId) {
            updateConfig({ ...configs[0], assetId });
        }
    }, [assetId]);

    // Sync current asset price
    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const asset = configs[0].assetId;
                const isCrypto = ['bitcoin', 'ethereum', 'solana', 'dogecoin'].includes(asset.toLowerCase()) || asset.endsWith('USDT');
                const endpoint = isCrypto ? `${API_URL}/crypto/price/${asset}` : `${API_URL}/stocks/quote/${asset}`;

                const response = await axios.get(endpoint);
                setCurrentPrice(response.data.price);
            } catch (e) {
                console.error("Price fetch failed", e);
                // Fallback price logic if needed
                setCurrentPrice(0);
            }
        };

        fetchPrice();
        const interval = setInterval(fetchPrice, 10000); // Update every 10s
        return () => clearInterval(interval);
    }, [configs[0].assetId]);

    // Sync to localStorage
    useEffect(() => {
        localStorage.setItem('tradesim_chart_layout', JSON.stringify(configs));
    }, [configs]);

    const handleLayoutChange = (newLayout) => {
        setLayout(newLayout);
        const count = newLayout === 'single' ? 1 : newLayout === 'quad' ? 4 : 2;

        setConfigs(prev => {
            if (prev.length === count) return prev;
            if (prev.length > count) return prev.slice(0, count);
            const extra = Array.from({ length: count - prev.length }, (_, i) =>
                createConfig(prev.length + i + 1)
            );
            return [...prev, ...extra];
        });
    };

    const updateConfig = (updated) => {
        setConfigs(prev => prev.map(c => c.id === updated.id ? updated : c));
    };

    const handleBuyNow = () => {
        const qty = parseFloat(quantity);
        if (!qty || qty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        const currentAsset = configs[0].assetId;
        const totalAmount = currentPrice * qty;

        navigate('/payment', {
            state: {
                amount: totalAmount,
                assetName: currentAsset.charAt(0).toUpperCase() + currentAsset.slice(1),
                assetSymbol: currentAsset.toUpperCase(),
                quantity: qty,
                type: ['bitcoin', 'ethereum', 'solana'].includes(currentAsset.toLowerCase()) ? 'crypto' : 'stock'
            }
        });
    };

    return (
        <MainLayout>
            <div className="space-y-6 max-w-[1600px] mx-auto">
                {/* Header Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/markets" className="p-2 bg-white/5 border border-white/5 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft size={18} />
                        </Link>
                        <h1 className="text-2xl font-bold">Trading Terminal</h1>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                        {['single', 'split-v', 'quad'].map(l => (
                            <button
                                key={l}
                                onClick={() => handleLayoutChange(l)}
                                className={`p-2 rounded-lg transition-all ${layout === l ? 'bg-accent text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                {l === 'single' && <Maximize2 size={18} />}
                                {l === 'split-v' && <Columns size={18} />}
                                {l === 'quad' && <Grid2X2 size={18} />}
                            </button>
                        ))}
                        <div className="w-[1px] h-6 bg-white/10 mx-1" />
                        <button
                            onClick={() => {
                                localStorage.removeItem('tradesim_chart_layout');
                                window.location.reload();
                            }}
                            className="p-2 text-slate-500 hover:text-danger rounded-lg transition-all"
                            title="Reset Layout"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className={`grid gap-4 ${layout === 'single' ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
                    <div className={`${layout === 'single' ? 'lg:col-span-3' : ''}`}>
                        <div className={`grid gap-4 ${layout === 'single' ? 'grid-cols-1' :
                            layout === 'split-v' ? 'grid-cols-1 lg:grid-cols-2' :
                                layout === 'quad' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
                            }`}>
                            {configs.map(config => (
                                <ChartInstance
                                    key={config.id}
                                    config={config}
                                    onUpdate={updateConfig}
                                    isSingle={layout === 'single'}
                                />
                            ))}
                        </div>
                    </div>

                    {layout === 'single' && (
                        <div className="lg:col-span-1 h-[600px]">
                            <OrderBook basePrice={Number(currentPrice) || 45000} assetSymbol={getAssetDisplayName(configs[0].assetId)} />
                        </div>
                    )}
                </div>

                {/* Fast Order Panel - Always synced to Chart 1 */}
                <div className="bg-secondary/30 p-6 rounded-2xl border border-slate-700/50">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 flex items-center gap-8">
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Buying Asset</p>
                                <p className="text-xl font-bold flex items-center gap-2">
                                    {configs[0].assetId.toUpperCase()}
                                    <span className="text-sm font-normal text-slate-400">@ ${(currentPrice || 0).toLocaleString()}</span>
                                </p>
                            </div>
                            <div className="flex-1 max-w-[200px]">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Quantity</p>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-base text-white font-bold focus:outline-none focus:border-accent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleBuyNow}
                                className="px-8 py-3 bg-[#2962FF] hover:bg-[#1e4bd1] text-white text-base font-bold rounded-xl shadow-lg shadow-[#2962FF]/20 transition-all active:scale-95 flex items-center gap-2"
                            >
                                <ShoppingCart size={18} />
                                Buy Now
                            </button>
                            {/* Consolidated Market Actions */}
                            <div className="flex rounded-xl bg-slate-900 overflow-hidden border border-white/5">
                                <button className="px-4 py-3 text-success text-base font-bold hover:bg-white/5 transition-colors">Buy</button>
                                <div className="w-[1px] bg-white/10" />
                                <button className="px-4 py-3 text-danger text-base font-bold hover:bg-white/5 transition-colors">Sell</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Strategy Builder */}
                <StrategyBuilder />
            </div>
        </MainLayout>
    );
}
