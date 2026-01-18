import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';

export const useKeyboardShortcuts = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { toggleWatchlist, marketType, setMarketType } = useMarket();

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if input is focused
            if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

            const key = e.key.toLowerCase();

            // Navigation
            if (e.shiftKey) {
                switch (key) {
                    case 'd':
                        navigate('/dashboard');
                        break;
                    case 'm':
                        navigate('/markets');
                        break;
                    case 'p':
                        navigate('/portfolio');
                        break;
                    case 'w':
                        navigate('/watchlist');
                        break;
                }
            }

            // Global Actions (Logic depends on context)
            if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
                switch (key) {
                    case 'm': // Toggle Market
                        // setMarketType(prev => prev === 'stock' ? 'crypto' : 'stock');
                        // Disabled simple toggle to prevent accidents, maybe Shift+M?
                        break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, marketType]);
};
