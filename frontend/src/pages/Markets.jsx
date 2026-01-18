import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpRight, Star } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import AssetDrawer from '../components/ui/AssetDrawer';
import FilterPanel from '../components/ui/FilterPanel';
import { useMarket } from '../context/MarketContext';
import EmptyState from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/LoadingState';
import MarketToggle from '../components/ui/MarketToggle';
import API_BASE_URL from '../config/api';

// Format large numbers
const formatMarketCap = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
};

const formatVolume = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
};

export default function Markets() {
    const { marketType, toggleWatchlist, isInWatchlist } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [marketData, setMarketData] = useState([]);

    const [filters, setFilters] = useState({
        minPrice: 0,
        performance: null, // 'gainers' | 'losers'
        marketCap: null, // 'Large' | 'Mid' | 'Small'
        sortBy: 'marketCapDesc'
    });

    // Fetch market data from API
    useEffect(() => {
        const fetchMarketData = async () => {
            setIsLoading(true);
            try {
                if (marketType === 'crypto') {
                    const response = await fetch(`${API_BASE_URL}/crypto/market-cap?limit=100`);
                    const result = await response.json();

                    if (result.success) {
                        const formatted = result.data.map(item => ({
                            id: item.baseAsset.toUpperCase(), // BTC, ETH, SOL
                            name: item.baseAsset,
                            symbol: item.baseAsset,
                            price: item.price,
                            change: item.changePercent,
                            marketCap: formatMarketCap(item.quoteVolume),
                            volume: formatVolume(item.volume),
                            rawVolume: item.volume,
                            rawMarketCap: item.quoteVolume,
                            type: 'Crypto'
                        }));
                        setMarketData(formatted);
                    }
                } else {
                    // Fetch stocks AND ETFs for stock market tab
                    const [stocksResponse, etfsResponse] = await Promise.all([
                        fetch(`${API_BASE_URL}/stocks/top?limit=30`),
                        fetch(`${API_BASE_URL}/etfs/top?limit=25`)
                    ]);

                    const stocksResult = await stocksResponse.json();
                    const etfsResult = await etfsResponse.json();

                    const allAssets = [];

                    // Add stocks
                    if (stocksResult.success) {
                        const formattedStocks = stocksResult.data.map(item => ({
                            id: item.symbol, // Use uppercase symbol
                            name: item.name,
                            symbol: item.symbol,
                            price: item.price,
                            change: item.changePercent,
                            marketCap: formatMarketCap(item.marketCap),
                            volume: formatVolume(item.volume),
                            rawVolume: item.volume,
                            rawMarketCap: item.marketCap,
                            type: 'Stock'
                        }));
                        allAssets.push(...formattedStocks);
                    }

                    // Add ETFs
                    if (etfsResult.success) {
                        const formattedETFs = etfsResult.data.map(item => ({
                            id: item.symbol, // Use uppercase symbol
                            name: item.name,
                            symbol: item.symbol,
                            price: item.price,
                            change: item.changePercent,
                            marketCap: formatMarketCap(item.marketCap || 0),
                            volume: formatVolume(item.volume),
                            rawVolume: item.volume,
                            rawMarketCap: item.marketCap || 0,
                            type: 'ETF'
                        }));
                        allAssets.push(...formattedETFs);
                    }

                    // Sort by market cap (descending)
                    allAssets.sort((a, b) => (b.rawMarketCap || 0) - (a.rawMarketCap || 0));
                    setMarketData(allAssets);
                }
            } catch (error) {
                console.error('Failed to fetch market data:', error);
                // Fallback mock data for display if API fails (e.g. rate limits)
                if (marketType === 'crypto') {
                    setMarketData([
                        { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 45230.50, change: 2.5, marketCap: '$885.2B', volume: '$24.5B', rawMarketCap: 885000000000, rawVolume: 24500000000 },
                        { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3120.20, change: -1.2, marketCap: '$365.4B', volume: '$12.1B', rawMarketCap: 365400000000, rawVolume: 12100000000 },
                        { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 98.40, change: 12.5, marketCap: '$42.1B', volume: '$3.2B', rawMarketCap: 42100000000, rawVolume: 3200000000 },
                        { id: 'BNB', name: 'Binance Coin', symbol: 'BNB', price: 320.50, change: 0.8, marketCap: '$49.2B', volume: '$1.1B', rawMarketCap: 49200000000, rawVolume: 1100000000 },
                        { id: 'ADA', name: 'Cardano', symbol: 'ADA', price: 0.55, change: -0.5, marketCap: '$19.5B', volume: '$0.4B', rawMarketCap: 19500000000, rawVolume: 400000000 }
                    ]);
                } else {
                    setMarketData([
                        { id: 'AAPL', name: 'Apple Inc.', symbol: 'AAPL', price: 178.50, change: 1.5, marketCap: '$2.8T', volume: '55.2M', rawMarketCap: 2800000000000, rawVolume: 55200000 },
                        { id: 'MSFT', name: 'Microsoft', symbol: 'MSFT', price: 380.20, change: 0.8, marketCap: '$2.7T', volume: '22.1M', rawMarketCap: 2700000000000, rawVolume: 22100000 },
                        { id: 'GOOGL', name: 'Alphabet', symbol: 'GOOGL', price: 140.30, change: -0.5, marketCap: '$1.7T', volume: '18.5M', rawMarketCap: 1700000000000, rawVolume: 18500000 },
                        { id: 'AMZN', name: 'Amazon', symbol: 'AMZN', price: 155.40, change: 2.1, marketCap: '$1.6T', volume: '35.4M', rawMarketCap: 1600000000000, rawVolume: 35400000 },
                        { id: 'TSLA', name: 'Tesla', symbol: 'TSLA', price: 245.60, change: 3.5, marketCap: '$780.2B', volume: '105.2M', rawMarketCap: 780200000000, rawVolume: 105200000 },
                        { id: 'NVDA', name: 'NVIDIA', symbol: 'NVDA', price: 485.60, change: 4.2, marketCap: '$1.2T', volume: '45.1M', rawMarketCap: 1200000000000, rawVolume: 45100000 }
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchMarketData();

        // Refresh data every 60 seconds for stocks (less frequent due to rate limits)
        const interval = setInterval(fetchMarketData, marketType === 'crypto' ? 30000 : 60000);
        return () => clearInterval(interval);
    }, [marketType]);

    const filteredData = useMemo(() => {
        let data = [...marketData];

        // 1. Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(asset =>
                asset.name.toLowerCase().includes(term) ||
                asset.symbol.toLowerCase().includes(term)
            );
        }

        // 2. Filters
        if (filters.minPrice > 0) {
            data = data.filter(asset => asset.price >= filters.minPrice);
        }

        if (filters.performance) {
            data = data.filter(asset =>
                filters.performance === 'gainers' ? asset.change >= 0 : asset.change < 0
            );
        }

        // 3. Sorting
        return [...data].sort((a, b) => {
            switch (filters.sortBy) {
                case 'priceDesc': return b.price - a.price;
                case 'priceAsc': return a.price - b.price;
                case 'volumeDesc': return (b.rawVolume || 0) - (a.rawVolume || 0);
                default:
                    return (b.rawVolume || 0) - (a.rawVolume || 0); // Default to volume desc
            }
        });
    }, [marketData, searchTerm, filters]);

    return (
        <MainLayout>
            <div className="space-y-6 sm:space-y-8">
                <div className="flex flex-col gap-4 sm:gap-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">
                            {marketType === 'stock' ? 'Stock Market' : 'Crypto Market'}
                        </h2>
                        <p className="text-text-muted mt-1 text-xs sm:text-sm">
                            Real-time prices and analysis for top {marketType === 'stock' ? 'companies' : 'cryptocurrencies'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                        <MarketToggle />
                        <div className="flex gap-3 flex-1 relative">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-text-main transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder={`Search ${marketType === 'stock' ? 'Stocks' : 'Crypto'}...`}
                                    className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-text-main focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-muted"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`bg-secondary border p-2.5 rounded-xl transition-all ${isFilterOpen ? 'border-accent text-text-main' : 'border-border text-text-muted hover:text-text-main hover:border-text-muted'}`}
                            >
                                <Filter size={20} />
                            </button>

                            {/* Filter Panel Dropdown */}
                            <FilterPanel
                                isOpen={isFilterOpen}
                                onClose={() => setIsFilterOpen(false)}
                                filters={filters}
                                setFilters={setFilters}
                            />
                        </div>
                    </div>
                </div>

                <BentoCard>
                    {isLoading ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        <>
                            <div className="overflow-x-auto -mx-4 sm:mx-0">
                                <div className="inline-block min-w-full align-middle">
                                    <table className="w-full">
                                        <thead className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                                            <tr>
                                                <th className="w-8 sm:w-12 text-center py-3 sm:py-4"></th>
                                                <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-medium">Asset</th>
                                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium">Price</th>
                                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium">Change</th>
                                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium hidden md:table-cell">Market Cap</th>
                                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium hidden lg:table-cell">Volume</th>

                                                <th className="text-right py-3 sm:py-4 px-3 sm:px-6 font-medium">Trade</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredData.map((asset) => (
                                                <tr
                                                    key={asset.id}
                                                    onClick={() => setSelectedAsset(asset)}
                                                    className="hover:bg-tertiary transition-colors group cursor-pointer"
                                                >
                                                    <td className="text-center py-3 sm:py-4 px-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleWatchlist(asset.id);
                                                            }}
                                                            className={`transition-all hover:scale-110 ${isInWatchlist(asset.id) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700 hover:text-yellow-400'}`}
                                                        >
                                                            <Star size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                        </button>
                                                    </td>
                                                    <td className="py-3 sm:py-4 px-3 sm:px-6">
                                                        <div className="flex items-center gap-2 sm:gap-4">
                                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-tertiary flex items-center justify-center font-bold text-xs sm:text-sm text-text-main border border-border group-hover:border-accent/20 transition-all flex-shrink-0">
                                                                {asset.symbol[0]}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="font-bold text-sm sm:text-base text-text-main truncate">{asset.name}</p>
                                                                <span className="text-[10px] sm:text-xs font-bold text-text-muted bg-tertiary px-1.5 py-0.5 rounded">{asset.symbol}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-right py-3 sm:py-4 px-3 sm:px-6">
                                                        <span className="font-bold text-sm sm:text-lg text-text-main">
                                                            {marketType === 'crypto' ? '$' : ''}{(asset.price || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                                        </span>
                                                    </td>
                                                    <td className="text-right py-3 sm:py-4 px-3 sm:px-6">
                                                        <div className={`inline-flex items-center gap-1 font-bold text-xs sm:text-sm ${asset.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                                            {asset.change >= 0 ? <TrendingUp size={12} className="sm:w-[14px] sm:h-[14px]" /> : <TrendingDown size={12} className="sm:w-[14px] sm:h-[14px]" />}
                                                            {Math.abs(asset.change || 0).toFixed(2)}%
                                                        </div>
                                                    </td>
                                                    <td className="text-right py-3 sm:py-4 px-3 sm:px-6 text-text-muted font-medium hidden md:table-cell text-sm">
                                                        {asset.marketCap}
                                                    </td>
                                                    <td className="text-right py-3 sm:py-4 px-3 sm:px-6 text-text-muted font-medium hidden lg:table-cell text-sm">
                                                        {asset.volume}
                                                    </td>
                                                    <td className="text-right py-3 sm:py-4 px-3 sm:px-6">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedAsset(asset);
                                                            }}
                                                            className="group/btn inline-flex items-center justify-center bg-tertiary hover:bg-accent hover:text-white text-accent border border-accent/20 hover:border-accent px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all"
                                                        >
                                                            Trade <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all hidden sm:inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {filteredData.length === 0 && (
                                <EmptyState
                                    title="No assets found"
                                    description="Try adjusting your filters or search query"
                                    action={
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilters({ minPrice: 0, performance: null, marketCap: null, sortBy: 'marketCapDesc' });
                                            }}
                                            className="text-accent text-sm font-bold hover:text-white"
                                        >
                                            Clear all filters
                                        </button>
                                    }
                                />
                            )}
                        </>
                    )}
                </BentoCard>
            </div>

            <AssetDrawer
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
            />
        </MainLayout>
    );
}
