import React, { createContext, useContext, useState, useEffect } from 'react';

const MarketContext = createContext();

export const useMarket = () => useContext(MarketContext);

export const MarketProvider = ({ children }) => {
    // Market Type: 'crypto' or 'stock'
    const [marketType, setMarketType] = useState('crypto');

    // Watchlist: Set of Asset IDs - Load from localStorage
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem('watchlist');
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    // Alerts: Array of alert objects
    const [alerts, setAlerts] = useState([]);

    // Sync watchlist to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('watchlist', JSON.stringify(Array.from(watchlist)));
        } catch (error) {
            console.error('Failed to save watchlist:', error);
        }
    }, [watchlist]);

    const toggleMarketType = (type) => {
        if (type) {
            setMarketType(type);
        } else {
            setMarketType(prev => prev === 'crypto' ? 'stock' : 'crypto');
        }
    };

    const addToWatchlist = (assetId) => {
        setWatchlist(prev => {
            const newSet = new Set(prev);
            newSet.add(assetId);
            return newSet;
        });
    };

    const removeFromWatchlist = (assetId) => {
        setWatchlist(prev => {
            const newSet = new Set(prev);
            newSet.delete(assetId);
            return newSet;
        });
    };

    const isInWatchlist = (assetId) => {
        return watchlist.has(assetId);
    };

    const toggleWatchlist = (assetId) => {
        if (isInWatchlist(assetId)) {
            removeFromWatchlist(assetId);
        } else {
            addToWatchlist(assetId);
        }
    };

    const addAlert = (alert) => {
        setAlerts(prev => [...prev, { ...alert, id: Date.now() }]);
    };

    const removeAlert = (alertId) => {
        setAlerts(prev => prev.filter(a => a.id !== alertId));
    };

    return (
        <MarketContext.Provider value={{
            marketType,
            toggleMarketType,
            watchlist: Array.from(watchlist),
            addToWatchlist,
            removeFromWatchlist,
            toggleWatchlist,
            isInWatchlist,
            alerts,
            addAlert,
            removeAlert
        }}>
            {children}
        </MarketContext.Provider>
    );
};
