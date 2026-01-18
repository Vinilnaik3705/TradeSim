import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, Star } from 'lucide-react';
import BentoCard from '../components/ui/BentoCard';
import AssetDrawer from '../components/ui/AssetDrawer';
import { useMarket } from '../context/MarketContext';
import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';
import MarketToggle from '../components/ui/MarketToggle';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}`;

export default function Watchlist() {
    const { toggleWatchlist, isInWatchlist, marketType, watchlist } = useMarket();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch assets from API
    useEffect(() => {
        const fetchAssets = async () => {
            setLoading(true);
            try {
                if (marketType === 'crypto') {
                    // Fetch crypto
                    const endpoint = `${API_URL}/crypto/market-cap?limit=100`;
                    const response = await axios.get(endpoint);

                    if (response.data.success || response.data.data) {
                        const data = response.data.data || response.data;
                        const formatted = data.map(item => {
                            const assetId = (item.baseAsset || item.symbol || '').toUpperCase();
                            return {
                                id: assetId,
                                name: item.name || item.baseAsset || assetId,
                                symbol: assetId,
                                price: parseFloat(item.price) || 0,
                                change: parseFloat(item.changePercent || item.priceChangePercent) || 0,
                                marketCap: item.marketCap || item.quoteVolume || 'N/A',
                                volume: item.volume || item.quoteVolume || 'N/A'
                            };
                        });
                        setAssets(formatted);
                    }
                } else {
                    // Fetch stocks AND ETFs (same as Markets page)
                    const [stocksResponse, etfsResponse] = await Promise.all([
                        axios.get(`${API_URL}/stocks/top?limit=100`),
                        axios.get(`${API_URL}/etfs/top?limit=100`)
                    ]);

                    const allAssets = [];

                    // Add stocks
                    if (stocksResponse.data.success) {
                        const formattedStocks = stocksResponse.data.data.map(item => ({
                            id: item.symbol, // Uppercase
                            name: item.name,
                            symbol: item.symbol,
                            price: parseFloat(item.price) || 0,
                            change: parseFloat(item.changePercent) || 0,
                            marketCap: item.marketCap || 'N/A',
                            volume: item.volume || 'N/A'
                        }));
                        allAssets.push(...formattedStocks);
                    }

                    // Add ETFs
                    if (etfsResponse.data.success) {
                        const formattedETFs = etfsResponse.data.data.map(item => ({
                            id: item.symbol, // Uppercase
                            name: item.name,
                            symbol: item.symbol,
                            price: parseFloat(item.price) || 0,
                            change: parseFloat(item.changePercent) || 0,
                            marketCap: item.marketCap || 'N/A',
                            volume: item.volume || 'N/A'
                        }));
                        allAssets.push(...formattedETFs);
                    }

                    setAssets(allAssets);
                }
            } catch (error) {
                console.error('Failed to fetch watchlist assets:', error);
                setAssets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAssets();
    }, [marketType]);

    const filteredData = useMemo(() => {
        // Filter by watchlist
        let data = assets.filter(asset => isInWatchlist(asset.id));

        // Then filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(asset =>
                asset.name.toLowerCase().includes(term) ||
                asset.symbol.toLowerCase().includes(term)
            );
        }

        return data;
    }, [searchTerm, isInWatchlist, assets]);

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-text-main to-text-muted bg-clip-text text-transparent">
                            My Watchlist
                        </h2>
                        <p className="text-text-muted mt-1 text-sm">
                            Track your favorite assets
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <MarketToggle />
                        <div className="relative flex-1 md:w-64 group max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-text-main transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search watchlist..."
                                className="w-full bg-secondary border border-border rounded-xl pl-10 pr-4 py-2.5 text-text-main focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-text-muted"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <BentoCard>
                    <div className="overflow-x-auto min-h-[400px]">
                        <table className="w-full">
                            <thead className="text-text-muted text-xs uppercase tracking-wider border-b border-border">
                                <tr>
                                    <th className="w-8 sm:w-12 text-center py-4"></th>
                                    <th className="text-left py-4 px-3 sm:px-6 font-medium">Asset</th>
                                    <th className="text-right py-4 px-3 sm:px-6 font-medium">Price</th>
                                    <th className="text-right py-4 px-3 sm:px-6 font-medium">Change</th>
                                    <th className="text-right py-4 px-6 font-medium hidden lg:table-cell">Market Cap</th>
                                    <th className="text-right py-4 px-6 font-medium hidden xl:table-cell">Volume</th>
                                    <th className="text-right py-4 px-3 sm:px-6 font-medium hidden sm:table-cell">Trade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredData.map((asset) => (
                                    <tr
                                        key={asset.id}
                                        onClick={() => setSelectedAsset(asset)}
                                        className="hover:bg-tertiary transition-colors group cursor-pointer"
                                    >
                                        <td className="text-center py-4 px-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWatchlist(asset.id);
                                                }}
                                                className="text-yellow-400 fill-yellow-400 transition-all hover:scale-110"
                                            >
                                                <Star size={18} />
                                            </button>
                                        </td>
                                        <td className="py-4 px-3 sm:px-6">
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-tertiary flex items-center justify-center font-bold text-xs sm:text-sm text-text-main border border-border group-hover:border-accent/20 transition-all">
                                                    {asset.symbol[0]}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-base text-text-main truncate max-w-[80px] sm:max-w-none">{asset.name}</p>
                                                    <span className="text-[10px] sm:text-xs font-bold text-text-muted bg-tertiary px-1.5 py-0.5 rounded">{asset.symbol}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-right py-4 px-3 sm:px-6">
                                            <span className="font-bold text-lg text-text-main">
                                                ${asset.price.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="text-right py-4 px-3 sm:px-6">
                                            <div className={`inline-flex items-center gap-1 font-bold text-sm ${asset.change >= 0 ? 'text-success' : 'text-danger'}`}>
                                                {asset.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                {Math.abs(asset.change)}%
                                            </div>
                                        </td>
                                        <td className="text-right py-4 px-6 text-text-muted font-medium hidden lg:table-cell">
                                            {asset.marketCap}
                                        </td>
                                        <td className="text-right py-4 px-6 text-text-muted font-medium hidden xl:table-cell">
                                            {asset.volume}
                                        </td>
                                        <td className="text-right py-4 px-3 sm:px-6 hidden sm:table-cell">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedAsset(asset);
                                                }}
                                                className="group/btn inline-flex items-center justify-center bg-tertiary hover:bg-accent hover:text-white text-accent border border-accent/20 hover:border-accent px-4 py-2 rounded-lg text-sm font-bold transition-all"
                                            >
                                                Trade <ArrowUpRight size={16} className="ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredData.length === 0 && (
                        <EmptyState
                            icon={Star}
                            title="Your watchlist is empty"
                            description="Star assets in the Markets page to see them here"
                            action={
                                <Link to="/markets" className="text-accent underline hover:text-white">
                                    Go to Markets
                                </Link>
                            }
                        />
                    )}
                </BentoCard>
            </div>

            {/* Reuse Asset Drawer */}
            <AssetDrawer
                isOpen={!!selectedAsset}
                onClose={() => setSelectedAsset(null)}
                asset={selectedAsset}
            />
        </MainLayout>
    );
}
