import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp, TrendingDown, Activity, Shield, Zap, ArrowRight, RefreshCw } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import MarketToggle from '../components/ui/MarketToggle';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const portfolioData = [
    { name: 'BTC', value: 45, color: '#F59E0B' }, // Orange
    { name: 'ETH', value: 30, color: '#3B82F6' }, // Blue
    { name: 'TSLA', value: 15, color: '#EF4444' }, // Red
    { name: 'AAPL', value: 10, color: '#10B981' }, // Green
];

// Helper function to convert timestamp to "X hours ago" format
function getTimeAgo(timestamp) {
    const now = new Date();
    const published = new Date(timestamp);
    const diffMs = now - published;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
        return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
}

// News Item Component
const NewsItem = ({ id, title, source, time, category, url }) => {
    const categoryColors = {
        'Economy': 'bg-blue-500/20 text-blue-400',
        'Markets': 'bg-green-500/20 text-green-400',
        'Commodities': 'bg-yellow-500/20 text-yellow-400',
        'Crypto': 'bg-purple-500/20 text-purple-400',
        'Global': 'bg-cyan-500/20 text-cyan-400',
        'Stocks': 'bg-pink-500/20 text-pink-400'
    };

    const handleClick = () => {
        if (url && url !== '#') {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            onClick={handleClick}
            className="p-4 bg-tertiary/30 border border-border rounded-lg hover:bg-tertiary/50 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <h3 className="font-bold text-text-main text-base group-hover:text-accent transition-colors line-clamp-2">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${categoryColors[category] || 'bg-slate-700 text-slate-300'}`}>
                            {category}
                        </span>
                        <span className="text-xs text-text-muted">{source}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{time}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Dashboard() {
    const { user } = useAuth();
    const { marketType } = useMarket();
    const [marketData, setMarketData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [news, setNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Generate mock chart data


    // Fetch market data based on toggle
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                if (marketType === 'crypto') {
                    // Fetch crypto assets
                    const response = await axios.get(`${API_BASE_URL}/crypto/market-cap?limit=5`);
                    if (response.data.success) {
                        const formatted = response.data.data.map(item => ({
                            id: item.symbol,
                            name: item.baseAsset,
                            symbol: item.baseAsset,
                            price: item.price,
                            change: item.changePercent
                        }));
                        setMarketData(formatted);
                    }
                } else {
                    // Fetch stock assets
                    const response = await axios.get(`${API_BASE_URL}/stocks/top?limit=5`);
                    if (response.data.success) {
                        const formatted = response.data.data.map(item => ({
                            id: item.symbol,
                            name: item.name,
                            symbol: item.symbol,
                            price: item.price,
                            change: item.changePercent
                        }));
                        setMarketData(formatted);
                    }
                }
            } catch (error) {
                console.error("Dashboard data fetch failed", error);
                // Fallback mock data
                if (marketType === 'crypto') {
                    setMarketData([
                        { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 45230.50, change: 2.5 },
                        { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3120.20, change: -1.2 },
                        { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 98.40, change: 12.5 },
                        { id: 'ADA', name: 'Cardano', symbol: 'ADA', price: 0.55, change: -0.5 },
                        { id: 'DOT', name: 'Polkadot', symbol: 'DOT', price: 7.20, change: 3.2 }
                    ]);
                } else {
                    setMarketData([
                        { id: 'AAPL', name: 'Apple Inc.', symbol: 'AAPL', price: 178.50, change: 1.5 },
                        { id: 'MSFT', name: 'Microsoft', symbol: 'MSFT', price: 380.20, change: 0.8 },
                        { id: 'GOOGL', name: 'Alphabet', symbol: 'GOOGL', price: 140.30, change: -0.5 },
                        { id: 'AMZN', name: 'Amazon', symbol: 'AMZN', price: 155.40, change: 2.1 },
                        { id: 'TSLA', name: 'Tesla', symbol: 'TSLA', price: 245.60, change: 3.5 }
                    ]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [marketType]); // Re-fetch when market type changes

    // Fetch real-time news
    const fetchNews = async () => {
        try {
            setRefreshing(true);
            const response = await axios.get(`${API_BASE_URL}/news?category=all&limit=10`);
            if (response.data.success) {
                setNews(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setNewsLoading(false);
            setRefreshing(false);
        }
    };

    // Initial news fetch
    useEffect(() => {
        fetchNews();
    }, []);

    // Auto-refresh news every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNews();
        }, 5 * 60 * 1000); // 5 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <MainLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">Dashboard</h2>
                        <p className="text-text-muted mt-1 text-sm">Market Overview & Analysis</p>
                    </div>
                    {user?.role === 'admin' && (
                        <Link to="/payment" className="bg-accent hover:bg-sky-500 text-white text-base px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-accent/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto">
                            <Wallet size={18} /> Add Funds (Admin)
                        </Link>
                    )}
                </div>

                {/* Bento Grid Layout - Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Balance Card */}
                    <BentoCard icon={DollarSign} title="Total Balance" delay={0.1}>
                        <div className="mt-2">
                            <h3 className="text-4xl font-bold text-text-main mb-2">$24,500.00</h3>
                            <div className="flex items-center text-success bg-success/10 w-fit px-3 py-1 rounded-lg">
                                <ArrowUpRight size={16} className="mr-1" />
                                <span className="font-bold text-sm">+12.5%</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Portfolio Value */}
                    <BentoCard icon={Activity} title="Portfolio Value" delay={0.2}>
                        <div className="mt-2">
                            <h3 className="text-4xl font-bold text-text-main mb-2">$18,240.50</h3>
                            <div className="flex items-center text-success bg-success/10 w-fit px-3 py-1 rounded-lg">
                                <ArrowUpRight size={16} className="mr-1" />
                                <span className="font-bold text-sm">+8.2%</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* P/L - Red Accent */}
                    <BentoCard icon={TrendingUp} title="Total P/L" delay={0.3}>
                        <div className="mt-2">
                            <h3 className="text-4xl font-bold text-text-main mb-2">-$450.20</h3>
                            <div className="flex items-center text-danger bg-danger/10 w-fit px-3 py-1 rounded-lg">
                                <ArrowDownRight size={16} className="mr-1" />
                                <span className="font-bold text-sm">-2.1%</span>
                            </div>
                        </div>
                    </BentoCard>
                </div>

                {/* Row 2 - Feature Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Market News - Spans 2 cols on desktop */}
                    <BentoCard className="lg:col-span-2 min-h-[350px] sm:min-h-[400px]" icon={Zap} title="Market News" delay={0.4}>
                        {/* Refresh Button */}
                        <button
                            onClick={fetchNews}
                            disabled={refreshing}
                            className="absolute top-6 right-6 p-2 bg-tertiary hover:bg-tertiary/80 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh News"
                        >
                            <RefreshCw size={16} className={`text-text-muted ${refreshing ? 'animate-spin' : ''}`} />
                        </button>

                        <div className="w-full mt-4 space-y-3 max-h-[320px] overflow-y-auto pr-2">
                            {newsLoading ? (
                                <div className="flex items-center justify-center h-[320px]">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                                </div>
                            ) : news.length === 0 ? (
                                <div className="flex items-center justify-center h-[320px] text-text-muted">
                                    No news available
                                </div>
                            ) : (
                                <>
                                    {news.slice(0, 6).map((article) => {
                                        const timeAgo = getTimeAgo(article.publishedAt);
                                        return (
                                            <NewsItem
                                                key={article.id}
                                                id={article.id}
                                                title={article.title}
                                                source={article.source}
                                                time={timeAgo}
                                                category={article.category}
                                                url={article.url}
                                            />
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </BentoCard>

                    {/* Asset Allocation */}
                    <BentoCard icon={Shield} title="Asset Allocation" delay={0.5}>
                        <div className="h-[250px] relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={portfolioData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {portfolioData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #262626', borderRadius: '8px' }} itemStyle={{ color: 'white' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                <span className="text-text-muted text-sm font-medium">Total</span>
                                <span className="text-2xl font-bold text-text-main">$18k</span>
                            </div>
                        </div>
                        <div className="mt-4 space-y-3">
                            {portfolioData.map((item) => (
                                <div key={item.name} className="flex justify-between items-center text-sm p-2 hover:bg-tertiary rounded-lg transition-colors cursor-default">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                                        <span className="font-medium text-base text-text-muted">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-text-main">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </BentoCard>
                </div>

                {/* Market List */}
                <BentoCard className="min-h-[300px]" delay={0.6}>
                    <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                        <h3 className="text-xl font-bold text-text-main">Live Markets</h3>
                        <div className="flex items-center gap-3">
                            <MarketToggle />
                            <Link to="/markets" className="text-sm text-accent hover:text-white transition-colors font-medium flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-text-muted text-xs uppercase tracking-wider border-b border-white/5 bg-tertiary/20">
                                <tr>
                                    <th className="text-left py-4 px-4 font-medium">Asset</th>
                                    <th className="text-right py-4 px-4 font-medium">Price</th>
                                    <th className="text-right py-4 px-4 font-medium hidden sm:table-cell">24h Change</th>
                                    <th className="text-right py-4 px-4 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="4" className="py-8 text-center text-text-muted">Loading market data...</td></tr>
                                ) : marketData.map((asset) => (
                                    <tr key={asset.id} className="hover:bg-tertiary transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-tertiary flex items-center justify-center font-bold text-sm text-text-main group-hover:scale-110 transition-transform">
                                                    {asset.symbol[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-base text-text-main">{asset.name}</p>
                                                    <p className="text-xs text-text-muted">{asset.symbol}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-right py-4 px-4 font-medium text-lg text-text-main">
                                            ${asset.price.toLocaleString()}
                                        </td>
                                        <td className={`text-right py-4 px-4 font-medium text-sm hidden sm:table-cell ${asset.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                                        </td>
                                        <td className="text-right py-4 px-4">
                                            <Link to={`/trade/${asset.symbol}`} className="bg-tertiary hover:bg-accent hover:text-white text-accent px-4 py-2 rounded-lg text-sm font-bold transition-all inline-block">
                                                Trade
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </BentoCard>
            </div>
        </MainLayout>
    );
}
