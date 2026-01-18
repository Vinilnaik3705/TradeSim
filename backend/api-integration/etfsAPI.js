const yahooFinance = require('yahoo-finance2').default;
const cacheService = require('../services/cacheService');

// Configure yahoo-finance2 to skip validation errors
yahooFinance.setGlobalConfig({
    validation: {
        logErrors: false,
        logOptionsErrors: false
    }
});

// Fallback mock data for when Yahoo Finance is rate-limited
const FALLBACK_ETFS = [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 475.00, changePercent: 0.5, volume: 75000000 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 395.00, changePercent: 0.8, volume: 42000000 },
    { symbol: 'IWM', name: 'iShares Russell 2000 ETF', price: 195.00, changePercent: 0.3, volume: 28000000 },
    { symbol: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', price: 375.00, changePercent: 0.2, volume: 3500000 },
    { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 235.00, changePercent: 0.4, volume: 4000000 },
    { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 435.00, changePercent: 0.5, volume: 5500000 },
    { symbol: 'IVV', name: 'iShares Core S&P 500 ETF', price: 475.00, changePercent: 0.5, volume: 4200000 },
    { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', price: 48.00, changePercent: 0.2, volume: 8500000 },
    { symbol: 'VWO', name: 'Vanguard FTSE Emerging Markets ETF', price: 42.00, changePercent: -0.3, volume: 12000000 },
    { symbol: 'EFA', name: 'iShares MSCI EAFE ETF', price: 75.00, changePercent: 0.1, volume: 18000000 },
    { symbol: 'XLF', name: 'Financial Select Sector SPDR Fund', price: 38.50, changePercent: 0.7, volume: 55000000 },
    { symbol: 'XLK', name: 'Technology Select Sector SPDR Fund', price: 185.00, changePercent: 1.2, volume: 8500000 },
    { symbol: 'XLE', name: 'Energy Select Sector SPDR Fund', price: 85.00, changePercent: -0.5, volume: 22000000 },
    { symbol: 'XLV', name: 'Health Care Select Sector SPDR Fund', price: 135.00, changePercent: 0.3, volume: 8000000 },
    { symbol: 'XLI', name: 'Industrial Select Sector SPDR Fund', price: 115.00, changePercent: 0.6, volume: 9500000 },
    { symbol: 'XLP', name: 'Consumer Staples Select Sector SPDR', price: 75.00, changePercent: 0.1, volume: 8500000 },
    { symbol: 'XLY', name: 'Consumer Discretionary Select Sector SPDR', price: 175.00, changePercent: 0.9, volume: 4500000 },
    { symbol: 'XLU', name: 'Utilities Select Sector SPDR Fund', price: 68.00, changePercent: -0.2, volume: 12000000 },
    { symbol: 'XLB', name: 'Materials Select Sector SPDR Fund', price: 85.00, changePercent: 0.4, volume: 4200000 },
    { symbol: 'XLRE', name: 'Real Estate Select Sector SPDR Fund', price: 42.00, changePercent: 0.2, volume: 5500000 },
    { symbol: 'VGT', name: 'Vanguard Information Technology ETF', price: 485.00, changePercent: 1.1, volume: 650000 },
    { symbol: 'VHT', name: 'Vanguard Health Care ETF', price: 255.00, changePercent: 0.4, volume: 420000 },
    { symbol: 'VFH', name: 'Vanguard Financials ETF', price: 95.00, changePercent: 0.6, volume: 850000 },
    { symbol: 'GLD', name: 'SPDR Gold Shares', price: 185.00, changePercent: 0.3, volume: 8500000 },
    { symbol: 'SLV', name: 'iShares Silver Trust', price: 22.50, changePercent: 0.8, volume: 18000000 }
];

/**
 * Yahoo Finance API Integration for ETFs
 */
class ETFsAPI {
    constructor() {
        this.cacheTTL = {
            quote: parseInt(process.env.CACHE_TTL_QUOTE) || 60,
            history: parseInt(process.env.CACHE_TTL_HISTORY) || 300,
            search: parseInt(process.env.CACHE_TTL_SEARCH) || 600
        };
        this.useFallback = false;
    }

    /**
     * Get real-time ETF quote
     */
    async getQuote(symbol) {
        const cacheKey = `etf:quote:${symbol}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const quote = await yahooFinance.quote(symbol);

            const data = {
                symbol: quote.symbol,
                name: quote.longName || quote.shortName,
                price: quote.regularMarketPrice,
                change: quote.regularMarketChange,
                changePercent: quote.regularMarketChangePercent,
                volume: quote.regularMarketVolume,
                high: quote.regularMarketDayHigh,
                low: quote.regularMarketDayLow,
                open: quote.regularMarketOpen,
                previousClose: quote.regularMarketPreviousClose,
                fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
                fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
                avgVolume: quote.averageDailyVolume3Month,
                ytdReturn: quote.ytdReturn,
                threeYearAverageReturn: quote.threeYearAverageReturn,
                fiveYearAverageReturn: quote.fiveYearAverageReturn,
                timestamp: new Date().toISOString()
            };

            cacheService.set(cacheKey, data, this.cacheTTL.quote);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch ETF quote for ${symbol}: ${error.message}`);
        }
    }

    /**
     * Get historical ETF data
     */
    async getHistory(symbol, period = '1mo', interval = '1d') {
        const cacheKey = `etf:history:${symbol}:${period}:${interval}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const queryOptions = { period1: this.getPeriodDate(period), interval };
            const result = await yahooFinance.historical(symbol, queryOptions);

            const data = result.map(item => ({
                date: item.date,
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume
            }));

            cacheService.set(cacheKey, data, this.cacheTTL.history);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch ETF history for ${symbol}: ${error.message}`);
        }
    }

    /**
     * Search for ETFs
     */
    async search(query) {
        const cacheKey = `etf:search:${query}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const results = await yahooFinance.search(query);

            const data = results.quotes
                .filter(q => q.quoteType === 'ETF')
                .slice(0, 10)
                .map(q => ({
                    symbol: q.symbol,
                    name: q.longname || q.shortname,
                    exchange: q.exchange,
                    type: q.quoteType
                }));

            cacheService.set(cacheKey, data, this.cacheTTL.search);
            return data;
        } catch (error) {
            throw new Error(`Failed to search ETFs: ${error.message}`);
        }
    }

    /**
     * Get popular ETFs
     */
    async getPopular() {
        const cacheKey = 'etf:popular';
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            // Popular ETFs across different categories
            const symbols = ['SPY', 'QQQ', 'IWM', 'DIA', 'VTI', 'VOO', 'GLD', 'TLT', 'EEM', 'XLF'];
            const quotes = await Promise.all(symbols.map(s => this.getQuote(s)));

            cacheService.set(cacheKey, quotes, this.cacheTTL.quote);
            return quotes;
        } catch (error) {
            throw new Error(`Failed to fetch popular ETFs: ${error.message}`);
        }
    }

    /**
     * Get top 50+ ETFs across different categories with fallback
     */
    async getTopETFs(limit = 50) {
        const cacheKey = `etf:top:${limit}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        // If we've detected Yahoo Finance is down, use fallback immediately
        if (this.useFallback) {
            const fallbackData = FALLBACK_ETFS.slice(0, limit).map(etf => ({
                ...etf,
                marketCap: 0, // ETFs don't have market cap
                timestamp: new Date().toISOString()
            }));
            cacheService.set(cacheKey, fallbackData, 300);
            return fallbackData;
        }

        try {
            // Comprehensive list of popular ETFs
            const symbols = FALLBACK_ETFS.map(e => e.symbol).slice(0, Math.min(limit, 25));

            // Fetch quotes in smaller batches
            const batchSize = 5;
            const batches = [];
            for (let i = 0; i < symbols.length; i += batchSize) {
                batches.push(symbols.slice(i, i + batchSize));
            }

            const allQuotes = [];
            let failureCount = 0;

            for (const batch of batches) {
                const quotes = await Promise.allSettled(
                    batch.map(symbol => this.getQuote(symbol))
                );

                quotes.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        allQuotes.push(result.value);
                    } else {
                        failureCount++;
                        // Use fallback for this symbol
                        const fallback = FALLBACK_ETFS.find(e => e.symbol === batch[index]);
                        if (fallback) {
                            allQuotes.push({
                                ...fallback,
                                marketCap: 0,
                                timestamp: new Date().toISOString()
                            });
                        }
                    }
                });

                // Small delay between batches
                if (batches.indexOf(batch) < batches.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }

            // If too many failures, switch to fallback mode
            if (failureCount > symbols.length * 0.5) {
                console.warn('Yahoo Finance appears to be rate-limited for ETFs, switching to fallback mode');
                this.useFallback = true;
                setTimeout(() => { this.useFallback = false; }, 10 * 60 * 1000);
            }

            cacheService.set(cacheKey, allQuotes, this.cacheTTL.quote);
            return allQuotes;
        } catch (error) {
            console.error('Failed to fetch top ETFs, using fallback:', error.message);
            // Use fallback data
            const fallbackData = FALLBACK_ETFS.slice(0, limit).map(etf => ({
                ...etf,
                marketCap: 0,
                timestamp: new Date().toISOString()
            }));
            cacheService.set(cacheKey, fallbackData, 300);
            return fallbackData;
        }
    }

    /**
     * Get ETF holdings (basic info from quote data)
     */
    async getHoldings(symbol) {
        const cacheKey = `etf:holdings:${symbol}`;
        const cached = cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        try {
            const quoteSummary = await yahooFinance.quoteSummary(symbol, {
                modules: ['topHoldings', 'fundProfile']
            });

            const data = {
                symbol,
                holdings: quoteSummary.topHoldings?.holdings || [],
                sectorWeightings: quoteSummary.topHoldings?.sectorWeightings || [],
                category: quoteSummary.fundProfile?.categoryName,
                family: quoteSummary.fundProfile?.family,
                timestamp: new Date().toISOString()
            };

            cacheService.set(cacheKey, data, this.cacheTTL.history);
            return data;
        } catch (error) {
            throw new Error(`Failed to fetch ETF holdings for ${symbol}: ${error.message}`);
        }
    }

    /**
     * Helper: Convert period string to date
     */
    getPeriodDate(period) {
        const now = new Date();
        const periodMap = {
            '1d': 1,
            '5d': 5,
            '1mo': 30,
            '3mo': 90,
            '6mo': 180,
            '1y': 365,
            '5y': 1825
        };

        const days = periodMap[period] || 30;
        return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    }
}

module.exports = new ETFsAPI();
